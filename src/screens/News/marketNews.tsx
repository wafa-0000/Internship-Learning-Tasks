import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator, Dimensions
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import YoutubePlayer from "react-native-youtube-iframe";
import { db } from '../../firebaseConfig';
import { SIZES } from '../../utils/constants/theme';
import { collection, query, onSnapshot } from 'firebase/firestore';
const { width } = Dimensions.get('window');
const MarketNews = ({ navigation }: any) => {
  const [heroVideo, setHeroVideo] = useState<any>(null);
  const [videoInsights, setVideoInsights] = useState<any[]>([]);
  const [realTimeArticles, setRealTimeArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const fetchLiveNews = async () => {
    try {
      const API_KEY = '26f017775688b128f04bbc15e4423b49';
      const url = `https://gnews.io/api/v4/search?q=bitcoin+OR+finance&lang=en&apikey=${API_KEY}`;
      const response = await fetch(url);
      const data = await response.json();
      if (data.articles && data.articles.length > 0) {
        const formatted = data.articles.map((art: any, index: number) => ({
          id: `news-${index}`,
          title: art.title,
          thumbnail: art.image || art.urlToImage || 'https://images.unsplash.com/photo-1611974714658-958b4822060d?w=400',
          date: new Date(art.publishedAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short' }),
          link: art.url,
          category: 'TRENDING',
          type: 'article'
        }));
        setRealTimeArticles(formatted);
      }
    } catch (error) {
      console.log("API Fetch Error:", error);
    }
  };
  useEffect(() => {
    fetchLiveNews();
    const q = query(collection(db, "news"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allNews = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setHeroVideo(allNews.find((item: any) => item.type === 'hero'));
      setVideoInsights(allNews.filter((item: any) => item.type === 'video'));
      setLoading(false);
    }, (error) => {
      console.log("Firebase Error:", error);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);
  if (loading) {
    return <View style={styles.loader}><ActivityIndicator size="large" color="#FFD700" /></View>;
  }
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Market News</Text>
            <Text style={styles.headerSubText}>LIVE UPDATES & INSIGHTS</Text>
          </View>
          <TouchableOpacity style={styles.headerIcon} onPress={fetchLiveNews}>
            <MaterialCommunityIcons name="refresh" size={24} color="#FFD700" />
          </TouchableOpacity>
        </View>
        {heroVideo && (
          <View style={styles.heroBox}>
            {heroVideo.videoId ? (
              <YoutubePlayer
                height={210}
                play={false} 
                videoId={heroVideo.videoId}
              />
            ) : (
              <TouchableOpacity
                style={styles.fullWidth}
                onPress={() => navigation.navigate('NewsDetail', { item: heroVideo })}
              >
                <Image source={{ uri: heroVideo.thumbnail }} style={styles.heroImg} />
                <View style={styles.heroOverlay}>
                  <View style={styles.playIcon}>
                    <MaterialCommunityIcons name="play" size={30} color="#000" />
                  </View>
                  <Text style={styles.heroTitleText} numberOfLines={2}>{heroVideo.title}</Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
        )}
        <Text style={styles.sectionTitle}>Video Insights</Text>
        {videoInsights.map((item) => (
          <TouchableOpacity key={item.id} style={styles.listCard} onPress={() => navigation.navigate('NewsDetail', { item })}>
            <Image source={{ uri: item.thumbnail }} style={styles.listImg} />
            <View style={styles.listContent}>
              <Text style={styles.categoryLabel}>{item.category || 'ANALYSIS'}</Text>
              <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
              <Text style={styles.cardMeta}>{item.views || 'Live'} • {item.channel || 'Market Watch'}</Text>
            </View>
          </TouchableOpacity>
        ))}
        <Text style={styles.sectionTitle}>Trending Articles</Text>
        {realTimeArticles.length > 0 ? (
          realTimeArticles.map((article) => (
            <TouchableOpacity key={article.id} style={styles.listCard} onPress={() => navigation.navigate('NewsDetail', { item: article })}>
              <Image source={{ uri: article.thumbnail }} style={styles.listImg} />
              <View style={styles.listContent}>
                <Text style={styles.categoryLabel}>{article.category}</Text>
                <Text style={styles.cardTitle} numberOfLines={2}>{article.title}</Text>
                <Text style={styles.cardMeta}>{article.date}</Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={{color: '#444', textAlign: 'center', marginTop: 10}}>Loading latest articles...</Text>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', paddingHorizontal: 20 },
  scrollContent: { paddingBottom: 20, padding: SIZES.padding  },
  loader: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, marginBottom: 20 },
  headerTitle: { color: '#FFF', fontSize: 24, fontWeight: 'bold' },
  headerSubText: { color: '#888', fontSize: 10, letterSpacing: 1 },
  headerIcon: { backgroundColor: '#1A1A1A', padding: 10, borderRadius: 12 },
  heroBox: { height: 210, borderRadius: 24, overflow: 'hidden', backgroundColor: '#111' },
  fullWidth: { width: '100%', height: '100%' },
  heroImg: { width: '100%', height: '100%' },
  heroOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
  playIcon: { backgroundColor: '#FFD700', width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center' },
  heroTitleText: { color: '#FFF', fontSize: 16, fontWeight: 'bold', position: 'absolute', bottom: 20, left: 15, right: 15 },
  sectionTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginTop: 25, marginBottom: 15 },
  listCard: { flexDirection: 'row', backgroundColor: '#111', padding: 12, borderRadius: 18, marginBottom: 15 },
  listImg: { width: 90, height: 75, borderRadius: 12 },
  listContent: { flex: 1, marginLeft: 15, justifyContent: 'center' },
  categoryLabel: { color: '#FFD700', fontSize: 10, fontWeight: 'bold', marginBottom: 4 },
  cardTitle: { color: '#FFF', fontSize: 14, fontWeight: '600' },
  cardMeta: { color: '#666', fontSize: 11, marginTop: 4 }
});
export default MarketNews;