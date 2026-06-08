import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Dimensions, Image, StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import YoutubePlayer from "react-native-youtube-iframe";
import { WebView } from 'react-native-webview';
import { SIZES } from '../../utils/constants/theme';
const { width } = Dimensions.get('window');
const NewsDetail = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const [showIframe, setShowIframe] = useState(false);
  const item = route.params?.item;
  if (!item) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Error: No item data found</Text>
      </SafeAreaView>
    );
  }
  const isVideo = !!item.videoId;
  const getUrl = () => {
    if (isVideo) {
      return `https://www.youtube.com/embed/${item.videoId}?autoplay=1&rel=0&showinfo=0&controls=1`;
    }
    return item.link || item.url;
  };
  if (!isVideo) {
    return (
      <View style={styles.fullScreenArticle}>
        <StatusBar barStyle="light-content" backgroundColor="#111" />
        <SafeAreaView style={styles.articleHeaderContainer}>
          <View style={styles.articleHeader}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn}>
              <MaterialCommunityIcons name="close" size={24} color="#FFF" />
            </TouchableOpacity>
            <View style={styles.headerTextStack}>
              <Text style={styles.articleHost} numberOfLines={1}>
                {item.link?.split('/')[2] || 'Article View'}
              </Text>
              <Text style={styles.articleTitleHeader} numberOfLines={1}>
                {item.title}
              </Text>
            </View>
            <TouchableOpacity style={styles.shareBtn}>
              <MaterialCommunityIcons name="share-variant" size={20} color="#FFF" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
        <WebView 
          source={{ uri: getUrl() }} 
          style={styles.webViewFrame} 
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          renderLoading={() => (
            <View style={styles.browserLoader}>
              <ActivityIndicator color="#F3E932" size="large" />
            </View>
          )}
        />
      </View>
    );
  }
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <TouchableOpacity style={styles.backButtonDetailed} onPress={() => navigation.goBack()}>
        <MaterialCommunityIcons name="arrow-left" size={24} color="#FFF" />
      </TouchableOpacity>
      <ScrollView contentContainerStyle={styles.scrollContent}>
       <View style={styles.mediaContainer}>
  {showIframe ? (
    <YoutubePlayer
      height={280}
      play={true}
      videoId={item.videoId}
      onChangeState={(state:any) => {
        if (state === "ended") setShowIframe(false);
      }}
    />
  ) : (
    <TouchableOpacity activeOpacity={0.9} onPress={() => setShowIframe(true)} style={styles.fullWidth}>
      <View style={styles.imageOverlay}>
        <Image source={{ uri: item.thumbnail }} style={StyleSheet.absoluteFill} resizeMode="cover" />
        <View style={styles.playBtnBackground}>
          <MaterialCommunityIcons name="play-circle" size={80} color="#F3E932" />
        </View>
      </View>
    </TouchableOpacity>
  )}
</View>
        <View style={styles.contentWrapper}>
          <Text style={styles.categoryTag}>{item.category || 'ANALYSIS'}</Text>
          <Text style={styles.mainTitle}>{item.title}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.metaInfo}>{item.channel || 'Market News'}</Text>
            <Text style={styles.metaInfo}> • {item.date || item.views || 'Latest'}</Text>
          </View>
          <View style={styles.descriptionBox}>
            <Text style={styles.boxTitle}>Key Insights</Text>
            <Text style={styles.boxDescription}>
              Watch this expert analysis to understand how these market shifts impact your gold-backed assets.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0B0C' },
  scrollContent: { paddingBottom: 40, padding: SIZES.padding  },
  fullScreenArticle: { flex: 1, backgroundColor: '#0B0B0C' },
  articleHeaderContainer: { backgroundColor: '#111', borderBottomWidth: 0.5, borderBottomColor: '#333' },
  articleHeader: { height: 55, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, justifyContent: 'space-between' },
  headerTextStack: { flex: 1, marginHorizontal: 15 },
  articleHost: { color: '#888', fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5 },
  articleTitleHeader: { color: '#FFF', fontSize: 13, fontWeight: '500' },
  closeBtn: { padding: 5 },
  shareBtn: { padding: 5 },
  webViewFrame: { flex: 1, backgroundColor: '#FFF' },
  browserLoader: { ...StyleSheet.absoluteFillObject, backgroundColor: '#0B0B0C', justifyContent: 'center', alignItems: 'center' },
  backButtonDetailed: { position: 'absolute', top: 20, left: 15, zIndex: 50, backgroundColor: 'rgba(0,0,0,0.5)', padding: 8, borderRadius: 20 },
  mediaContainer: { width: '100%', height: 280, backgroundColor: '#000' },
  videoPlayer: { width: width, height: 280 },
  videoLoader: { position: 'absolute', top: '40%', left: '45%' },
  imageOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  playBtnBackground: { backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: 100 },
  contentWrapper: { padding: 20 },
  categoryTag: { color: '#F3E932', fontSize: 11, fontWeight: 'bold', marginBottom: 10, letterSpacing: 1 },
  mainTitle: { color: '#FFF', fontSize: 22, fontWeight: 'bold', lineHeight: 30 },
  metaRow: { flexDirection: 'row', marginTop: 12, marginBottom: 25 },
  metaInfo: { color: '#8E8E93', fontSize: 13 },
  descriptionBox: { backgroundColor: '#121214', padding: 20, borderRadius: 18, borderWidth: 1, borderColor: '#1C1C1E' },
  boxTitle: { color: '#F3E932', fontSize: 14, fontWeight: 'bold', marginBottom: 8 },
  boxDescription: { color: '#D1D1D6', fontSize: 14, lineHeight: 22 },
  errorText: { color: '#FF453A', textAlign: 'center', marginTop: 50 },
  fullWidth: { width: '100%', height: '100%' },
});
export default NewsDetail;