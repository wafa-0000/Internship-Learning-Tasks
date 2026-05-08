import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { newsData } from '../../Component/data/newsData';

const MarketNews = ({ navigation }:any) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Market News</Text>
            <Text style={styles.headerSub}>INSIGHTS & UPDATES</Text>
          </View>
          <TouchableOpacity>
            <MaterialCommunityIcons
              name="newspaper-variant-outline"
              size={28}
              color="#FFD700"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.featuredVideoBox}
          onPress={() => {
            navigation.navigate('NewsDetail', { item: newsData.heroVideo });
          }}
        >
          <Image
            source={newsData.heroVideo.thumbnail}
            style={styles.fullImage}
          />
          <View style={styles.overlay}>
            <MaterialCommunityIcons name="play" size={50} color="#FFD700" />
          </View>
        </TouchableOpacity>

        <Text style={styles.videoTitleText}>{newsData.heroVideo.title}</Text>

        <View style={styles.sectionHeaderContainer}>
          <Text style={styles.sectionHeading}>Video Insights</Text>
        </View>

        {newsData.videoInsights.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.videoItemBox}
            onPress={() => {
              navigation.navigate('NewsDetail', { item });
            }}
          >
            <Image source={item.thumbnail} style={styles.smallThumbnail} />
            <View style={styles.infoBox}>
              <Text style={styles.categoryLabel}>{item.category}</Text>
              <Text style={styles.videoTitleText} numberOfLines={2}>
                {item.title}
              </Text>
              <Text style={styles.detailsText}>
                {item.channel} • {item.views}
              </Text>
            </View>
          </TouchableOpacity>
        ))}

        <View style={styles.sectionHeaderContainer}>
          <Text style={styles.sectionHeading}>Trending Articles</Text>
        </View>

        {newsData.trendingArticles.map((article) => (
          <TouchableOpacity
            key={article.id}
            style={styles.videoItemBox}
            onPress={() => {
              navigation.navigate('NewsDetail', { item: article });
            }}
          >
            <Image source={article.thumbnail} style={styles.smallThumbnail} />
            <View style={styles.infoBox}>
              <Text style={styles.videoTitleText} numberOfLines={2}>
                {article.title}
              </Text>
              <Text style={styles.detailsText}>{article.date}</Text>
            </View>
          </TouchableOpacity>
        ))}

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 15 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 20,
  },
  headerTitle: { color: '#FFF', fontSize: 24, fontWeight: 'bold' },
  headerSub: { color: '#888', fontSize: 12 },
  sectionHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 15,
    marginTop: 25,
  },
  sectionHeading: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  featuredVideoBox: {
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    marginVertical: 10,
  },
  fullImage: { width: '100%', height: '100%' },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  videoItemBox: {
    flexDirection: 'row',
    marginBottom: 15,
    backgroundColor: '#1E1E1E',
    padding: 10,
    borderRadius: 10,
  },
  smallThumbnail: { width: 100, height: 70, borderRadius: 8 },
  infoBox: { flex: 1, marginLeft: 10, justifyContent: 'center' },
  videoTitleText: { color: '#FFF', fontSize: 14, fontWeight: '600' },
  categoryLabel: { color: '#FFD700', fontSize: 10, fontWeight: 'bold' },
  detailsText: { color: '#888', fontSize: 11, marginTop: 4 },
});

export default MarketNews;
