import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Linking,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

const NewsDetail = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const [loading, setLoading] = React.useState(false);

  const item = route.params?.item;
  if (!item) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Error: No item data found</Text>
      </SafeAreaView>
    );
  }

  const handleOpenLink = async () => {
    try {
      setLoading(true);

      if (item.videoId) {
        const youtubeUrl = `https://www.youtube.com/watch?v=${item.videoId}`;
        const canOpen = await Linking.canOpenURL(youtubeUrl);
        if (canOpen) {
          await Linking.openURL(youtubeUrl);
        } else {
          alert('Cannot open YouTube link');
        }
      } else if (item.link) {
        const canOpen = await Linking.canOpenURL(item.link);
        if (canOpen) {
          await Linking.openURL(item.link);
        } else {
          alert('Cannot open link');
        }
      } else {
        alert('No link available for this item');
      }
    } catch (error) {
      console.error('Error opening link:', error);
      alert('Error opening link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isVideo = item.videoId ? true : false;

  return (
    <SafeAreaView style={styles.container}>
      {/* Back Button with Top: 25 */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <MaterialCommunityIcons name="arrow-left" size={24} color="#FFF" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Image with Top Margin: 25 */}
        <Image source={item.thumbnail} style={styles.thumbnail} />

        <View style={styles.contentWrapper}>
          <Text style={styles.category}>{item.category || 'News'}</Text>
          <Text style={styles.title}>{item.title}</Text>

          <View style={styles.metaContainer}>
            <Text style={styles.metaText}>
              {item.channel || item.date}
            </Text>
            {item.views && (
              <Text style={styles.metaText}> • {item.views}</Text>
            )}
          </View>

          {item.description && (
            <Text style={styles.description}>{item.description}</Text>
          )}

          <TouchableOpacity
            style={[styles.actionButton, loading && styles.actionButtonDisabled]}
            onPress={handleOpenLink}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#000" size="small" />
            ) : (
              <>
                <MaterialCommunityIcons
                  name={isVideo ? 'youtube' : 'web'}
                  size={24}
                  color="#000"
                />
                <Text style={styles.buttonText}>
                  {isVideo ? 'Watch on YouTube' : 'Read Full Article'}
                </Text>
              </>
            )}
          </TouchableOpacity>

          <View style={styles.infoSection}>
            <Text style={styles.infoTitle}>
              {isVideo ? 'Video Details' : 'Article Details'}
            </Text>
            <Text style={styles.infoText}>
              Type: {isVideo ? 'Video' : 'Article'}
            </Text>
            {item.channel && (
              <Text style={styles.infoText}>Source: {item.channel}</Text>
            )}
            {item.date && (
              <Text style={styles.infoText}>Published: {item.date}</Text>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  scrollContent: {
    paddingBottom: 30,
  },
  backButton: {
    position: 'absolute',
    top: 25, // Requested Header Margin
    left: 20,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 10,
    borderRadius: 20,
  },
  thumbnail: {
    width: '100%',
    height: 250,
    marginTop: 25, // Requested Image Top Margin
    resizeMode: 'cover',
  },
  contentWrapper: {
    padding: 20,
  },
  category: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  title: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    lineHeight: 30,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  metaText: {
    color: '#888',
    fontSize: 14,
  },
  description: {
    color: '#CCC',
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 25,
  },
  actionButton: {
    flexDirection: 'row',
    backgroundColor: '#FFD700',
    padding: 15,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  actionButtonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  infoSection: {
    backgroundColor: '#1E1E1E',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  infoTitle: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoText: {
    color: '#AAA',
    fontSize: 13,
    marginBottom: 6,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 50,
  },
});

export default NewsDetail;