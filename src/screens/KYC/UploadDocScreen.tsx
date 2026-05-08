import React, { useState } from 'react';
import { 
  View, Text, ScrollView, Alert, Modal, Image, 
  TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator 
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { db, auth } from '../../firebaseConfig'; 
import { doc, updateDoc } from "firebase/firestore";

const UploadDoc = ({ navigation }: any) => {
  const [selectedDoc, setSelectedDoc] = useState('Passport');
  const [previewUri, setPreviewUri] = useState<string | null>(null);
  const [fileName, setFileName] = useState('No file selected');
  const [loading, setLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  // --- CLOUDINARY CONFIGURATION ---
  const CLOUD_NAME = "dagaadhde"; 
  const UPLOAD_PRESET = "goldblock_preset";

  const docTypes = [
    { id: 'Passport', title: 'Passport' },
    { id: 'ID', title: 'National Identity' },
    { id: 'Address', title: 'Proof of Address' },
    { id: 'Photo', title: 'Facial Photo' },
  ];

  // --- IMAGE & DOCUMENT PICKERS ---
  const openCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (permission.granted) {
      const result = await ImagePicker.launchCameraAsync({ 
        allowsEditing: true, 
        quality: 0.7 
      });
      if (!result.canceled) {
        setPreviewUri(result.assets[0].uri);
        setFileName(`Captured_${selectedDoc}.jpg`);
      }
    } else {
      Alert.alert("Permission Denied", "Camera access is required.");
    }
  };

  const openGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ 
      allowsEditing: true, 
      quality: 0.7 
    });
    if (!result.canceled) {
      setPreviewUri(result.assets[0].uri);
      setFileName(`Gallery_${selectedDoc}.jpg`);
    }
  };

  const openDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: 'application/pdf' });
    if (!result.canceled) {
      setPreviewUri(null); // PDF ka preview Image component mein nahi dikh sakta
      setFileName(result.assets[0].name);
      // PDF ke liye hum link save karenge magar preview gallery image jaisa nahi hoga
    }
  };

  const showChoices = () => {
    Alert.alert(
      "Upload Option",
      `How do you want to upload your ${selectedDoc}?`,
      [
        { text: "Take Photo (Camera)", onPress: openCamera },
        { text: "Choose from Gallery", onPress: openGallery },
        { text: "Upload PDF (Files)", onPress: openDocument },
        { text: "Cancel", style: "cancel" }
      ]
    );
  };

  // --- CLOUDINARY UPLOAD LOGIC ---
  const uploadToCloudinary = async (uri: string) => {
    const data = new FormData();
    data.append('file', {
      uri: uri,
      type: 'image/jpeg',
      name: 'upload.jpg',
    } as any);
    data.append('upload_preset', UPLOAD_PRESET);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: data,
    });

    const resData = await response.json();
    if (resData.secure_url) {
      return resData.secure_url;
    } else {
      throw new Error("Cloudinary upload failed");
    }
  };

  // --- FINAL SUBMIT & FIRESTORE INTEGRATION ---
  const handleSubmit = async () => {
    if (fileName === 'No file selected' || (!previewUri && selectedDoc !== 'Address')) {
       return Alert.alert("Error", "Please upload a document first!");
    }

    setLoading(true);

    try {
      const user = auth.currentUser;
      if (!user) throw new Error("No authenticated user found");

      // 1. Cloudinary par upload karein
      let uploadedUrl = "";
      if (previewUri) {
        uploadedUrl = await uploadToCloudinary(previewUri);
      }

      // 2. Firestore payload tayyar karein
      const userRef = doc(db, "users", user.uid);
      const updatePayload: any = {
        [`kyc_docs.${selectedDoc}`]: uploadedUrl,
        kyc_status: "Pending",
        last_kyc_update: new Date().toISOString()
      };

      // Agar Facial Photo hai toh profile picture bhi update hogi
      if (selectedDoc === 'Photo') {
        updatePayload.profileImage = uploadedUrl;
      }

      // 3. Database update karein
      await updateDoc(userRef, updatePayload);

      setLoading(false);
      setIsVerified(true); // Modal show karein

    } catch (error: any) {
      setLoading(false);
      console.error(error);
      Alert.alert("Upload Failed", error.message || "Something went wrong");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>KYC Verification</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.label}>SELECT DOCUMENT TYPE</Text>
          <View style={styles.docGrid}>
            {docTypes.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.docButton, selectedDoc === item.id && styles.activeDocButton]}
                onPress={() => {
                  setSelectedDoc(item.id);
                  setPreviewUri(null);
                  setFileName('No file selected');
                }}
              >
                <Text style={[styles.docButtonText, selectedDoc === item.id && styles.activeDocText]}>
                  {item.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={[styles.label, { marginTop: 25 }]}>Upload Document</Text>
          
          <TouchableOpacity style={styles.uploadArea} onPress={showChoices}>
            {previewUri ? (
              <Image source={{ uri: previewUri }} style={styles.previewImage} />
            ) : (
              <View style={{ alignItems: 'center' }}>
                <MaterialCommunityIcons name="cloud-upload" size={40} color="#606063" />
                <Text style={styles.uploadText}>{fileName}</Text>
                <Text style={styles.subText}>Tap to upload your {selectedDoc}</Text>
              </View>
            )}
          </TouchableOpacity>

          {previewUri && (
            <TouchableOpacity 
              onPress={() => { setPreviewUri(null); setFileName('No file selected'); }}
              style={styles.removeButton}
            >
              <Text style={styles.removeText}>Remove & Re-upload</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity 
            style={[styles.submitButton, loading && { opacity: 0.7 }]} 
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={styles.submitButtonText}>Submit for Review</Text>
            )}
          </TouchableOpacity>

          {/* Success Modal */}
          <Modal visible={isVerified} transparent={true} animationType="fade">
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={styles.successIcon}>
                  <Text style={{ color: '#00FF85', fontSize: 24, fontWeight: 'bold' }}>✓</Text>
                </View>
                <Text style={styles.modalTitle}>Verification Submitted</Text>
                <Text style={styles.modalSubtitle}>
                  Your documents are under review. We'll notify you within 24 hours.
                </Text>
                
                <TouchableOpacity 
                  onPress={() => {
                    setIsVerified(false);
                    navigation.navigate('hero'); 
                  }}
                  style={styles.modalButton}
                >
                  <Text style={styles.modalButtonText}>Continue</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0B0C' },
  scrollContent: { paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, marginTop: 25 },
  headerTitle: { color: 'white', fontSize: 20, fontWeight: 'bold', marginLeft: 15 },
  content: { paddingHorizontal: 20 },
  label: { color: '#606063', fontSize: 12, marginBottom: 15, fontWeight: '600', letterSpacing: 1 },
  docGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  docButton: { width: '48%', backgroundColor: '#1C1C1E', paddingVertical: 15, borderRadius: 12, alignItems: 'center', marginBottom: 10 },
  activeDocButton: { backgroundColor: '#F3E932' },
  docButtonText: { color: '#606063', fontSize: 13, fontWeight: '500' },
  activeDocText: { color: '#000', fontWeight: 'bold' },
  uploadArea: { width: '100%', height: 200, backgroundColor: '#121214', borderRadius: 20, borderWidth: 1, borderColor: '#1C1C1E', borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', marginTop: 10 },
  previewImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  uploadText: { color: '#FFF', fontSize: 14, marginTop: 10 },
  subText: { color: '#606063', fontSize: 12, marginTop: 5 },
  removeButton: { marginTop: 15, alignItems: 'center' },
  removeText: { color: '#FF4444', fontWeight: 'bold' },
  submitButton: { backgroundColor: '#F3E932', height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginTop: 30 },
  submitButtonText: { color: '#000', fontSize: 16, fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.85)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '85%', backgroundColor: '#121214', borderRadius: 24, padding: 30, alignItems: 'center', borderWidth: 1, borderColor: '#1C1C1E' },
  successIcon: { width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(0, 255, 133, 0.1)', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  modalTitle: { color: '#FFF', fontSize: 22, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  modalSubtitle: { color: '#606063', fontSize: 14, textAlign: 'center', marginBottom: 30 },
  modalButton: { backgroundColor: '#F3E932', width: '100%', height: 52, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  modalButtonText: { color: '#000', fontWeight: 'bold', fontSize: 16 }
});

export default UploadDoc;