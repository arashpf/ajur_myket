import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert,
  FlatList,
  RefreshControl,
  Dimensions,
  Share
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');
const ITEM_HEIGHT = 200 + 16 + 16 + 90;

const MarketingEducationScreen = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [seenPostIds, setSeenPostIds] = useState(new Set());

  // ✅ Load seen posts from AsyncStorage
  useEffect(() => {
    const loadSeenPosts = async () => {
      try {
        const seenPosts = await AsyncStorage.getItem('magazine_seen_posts');
        if (seenPosts) {
          setSeenPostIds(new Set(JSON.parse(seenPosts)));
        }
      } catch (error) {
        console.error('Error loading seen posts:', error);
      }
    };
    loadSeenPosts();
  }, []);

  // ✅ Save seen post IDs to AsyncStorage
  const saveSeenPostIds = async (newSeenIds) => {
    try {
      await AsyncStorage.setItem('magazine_seen_posts', JSON.stringify([...newSeenIds]));
    } catch (error) {
      console.error('Error saving seen posts:', error);
    }
  };

  const fetchPosts = useCallback(async (pageNum = 1, isRefreshing = false) => {
    console.log('Fetching posts, page:', pageNum);
    
    if (isRefreshing) {
      setRefreshing(true);
    } else if (pageNum === 1) {
      setLoading(true);
    }

    try {
      // ✅ Using the correct category ID 97 for marketing-education
      const url = `https://mag.ajur.app/wp-json/wp/v2/posts?per_page=2&page=${pageNum}&categories=97&_embed`;

      console.log('Fetching from URL:', url);
      
      const response = await fetch(url);
      
      console.log('Response status:', response.status);

      if (!response.ok) {
        throw new Error(`Failed to fetch posts: ${response.status}`);
      }

      const totalPages = response.headers.get('X-WP-TotalPages');
      console.log('Total pages:', totalPages);
      
      const data = await response.json();
      console.log('Received data length:', data.length);
      console.log('First post:', data[0]?.title?.rendered);

      if (data.length === 0 || pageNum >= parseInt(totalPages)) {
        console.log('No more posts available');
        setHasMore(false);
      } else {
        console.log('Setting posts, count:', data.length);
        
        if (pageNum === 1) {
          setPosts(data);
        } else {
          setPosts(prevPosts => [...prevPosts, ...data]);
        }
        setPage(pageNum + 1);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      Alert.alert('خطا', 'در دریافت مقالات آموزش بازاریابی مشکلی پیش آمده است');
    } finally {
      setLoading(false);
      setRefreshing(false);
      console.log('Loading state set to false');
    }
  }, []);

  // ✅ Fetch posts when component mounts
  useEffect(() => {
    console.log('Component mounted, starting initial fetch');
    setPosts([]);
    setPage(1);
    setHasMore(true);
    setLoading(true);
    
    fetchPosts(1);
  }, [fetchPosts]);

  // ✅ Share functionality
  const handleShare = async (post) => {
    try {
      const postUrl = `https://mag.ajur.app/${post.slug}`;
      
      const shareOptions = {
        message: `${post.title.rendered}\n\n${postUrl}`,
        title: post.title.rendered,
        url: postUrl,
      };

      await Share.share(shareOptions);
    } catch (error) {
      console.error('Error sharing post:', error);
      Alert.alert('خطا', 'در اشتراک گذاری مقاله مشکلی پیش آمده است');
    }
  };

  const handleLoadMore = () => {
    if (!loading && hasMore && posts.length > 0) {
      console.log('Loading more posts...');
      fetchPosts(page);
    }
  };

  const onRefresh = () => {
    console.log('Refreshing...');
    setRefreshing(true);
    setPage(1);
    setHasMore(true);
    fetchPosts(1, true);
  };

  // ✅ Post tap handler
  const handlePostPress = useCallback(async (item) => {
    // Mark post as seen when user opens it
    const newSeenIds = new Set(seenPostIds);
    newSeenIds.add(item.id);
    setSeenPostIds(newSeenIds);
    saveSeenPostIds(newSeenIds);

    const postUrl = `https://mag.ajur.app/${item.slug}`;

    navigation.navigate('WebViewScreen', {
      url: postUrl,
      title: 'بازگشت به آموزش بازاریابی'
    });
  }, [navigation, seenPostIds]);

  const stripHtmlTags = (html) => html?.replace(/<[^>]*>/g, '') || '';
  const formatDate = (dateString) => new Intl.DateTimeFormat('fa-IR').format(new Date(dateString));
  
  const getAuthorName = (item) => {
    if (item._embedded && item._embedded.author && item._embedded.author[0]) {
      return item._embedded.author[0].name;
    }
    return 'نویسنده ناشناس';
  };

  const renderItem = useCallback(({ item }) => {
    console.log('Rendering item:', item.id);
    
    const featuredMedia =
      item._embedded &&
      item._embedded['wp:featuredmedia'] &&
      item._embedded['wp:featuredmedia'][0];

    const isNewPost = !seenPostIds.has(item.id);

    return (
      <View style={styles.postCard}>
        <TouchableOpacity onPress={() => handlePostPress(item)}>
          <View style={styles.imageContainer}>
            {featuredMedia && featuredMedia.source_url ? (
              <FastImage
                source={{ uri: featuredMedia.source_url, priority: FastImage.priority.normal }}
                style={styles.postImage}
                resizeMode={FastImage.resizeMode.cover}
              />
            ) : (
              <View style={[styles.postImage, styles.postImagePlaceholder]}>
                <Ionicons name="image-outline" size={40} color="#ccc" />
              </View>
            )}
            {isNewPost && (
              <View style={styles.newBadge}>
                <Text style={styles.newBadgeText}>جدید</Text>
              </View>
            )}
          </View>

          <View style={styles.postContent}>
            <Text style={styles.postTitle}>{item.title?.rendered || 'No Title'}</Text>
            <Text style={styles.postExcerpt} numberOfLines={3}>
              {stripHtmlTags(item.excerpt?.rendered)}
            </Text>
            
            <View style={styles.postFooter}>
              <Text style={styles.postDate}>{formatDate(item.date)}</Text>
              
              <View style={styles.footerActions}>
                <TouchableOpacity 
                  style={styles.shareButton}
                  onPress={() => handleShare(item)}
                >
                  <Ionicons name="share-social-outline" size={16} color="#666" />
                  <Text style={styles.shareButtonText}>اشتراک گذاری</Text>
                </TouchableOpacity>
                
                <Text style={styles.authorText}>{getAuthorName(item)} : نویسنده  </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }, [handlePostPress, seenPostIds]);

  const renderFooter = () => {
    if (!hasMore && posts.length > 0) {
      return (
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>همه مقالات آموزش بازاریابی بارگذاری شدند</Text>
        </View>
      );
    }

    if (loading && page > 1) {
      return (
        <View style={styles.footerLoader}>
          <ActivityIndicator size="small" color="#2196F3" />
          <Text style={styles.footerText}>در حال بارگذاری مقالات بیشتر...</Text>
        </View>
      );
    }

    return null;
  };

  const keyExtractor = useCallback((item) => {
    return `post_${item.id}`;
  }, []);

  console.log('Current state - loading:', loading, 'posts length:', posts.length, 'hasMore:', hasMore);

  if (loading && posts.length === 0) {
    console.log('Showing loading state');
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>در حال بارگذاری مقالات آموزش بازاریابی...</Text>
      </View>
    );
  }

  if (posts.length === 0 && !loading) {
    console.log('Showing no posts state');
    return (
      <View style={styles.noPostsContainer}>
        <Ionicons name="document-text-outline" size={50} color="#ccc" />
        <Text style={styles.noPostsText}>مقاله‌ای در بخش آموزش بازاریابی یافت نشد</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => fetchPosts(1)}>
          <Text style={styles.retryButtonText}>تلاش مجدد</Text>
        </TouchableOpacity>
      </View>
    );
  }

  console.log('Rendering posts list with', posts.length, 'posts');
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>آموزش بازاریابی</Text>
        <Text style={styles.headerSubtitle}>مقالات تخصصی مارکتینگ و بازاریابی</Text>
      </View>
      <FlatList
        data={posts}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#2196F3']}
            tintColor={'#2196F3'}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingVertical: 15,
    paddingHorizontal: 16,
    borderBottomWidth: 2,
    borderBottomColor: '#2196F3',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#2196F3',
    fontFamily: 'iransans',
  },
  headerSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
    marginTop: 5,
    fontFamily: 'iransans',
  },
  loadingContainer: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    textAlign: 'center',
    color: '#666',
    fontFamily: 'iransans',
  },
  noPostsContainer: {
    flex: 1,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  noPostsText: {
    marginTop: 10,
    textAlign: 'center',
    color: '#666',
    fontFamily: 'iransans',
  },
  retryButton: {
    marginTop: 15,
    backgroundColor: '#2196F3',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: 'white',
    fontFamily: 'iransans',
  },
  postCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    margin: 16,
    marginBottom: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    position: 'relative',
  },
  postImage: {
    width: '100%',
    height: 180,
    borderRadius:15
  },
  postImagePlaceholder: {
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  postContent: {
    padding: 16,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
    textAlign: 'right',
    fontFamily: 'iransans',
  },
  postExcerpt: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    textAlign: 'right',
    lineHeight: 20,
    fontFamily: 'iransans',
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  postDate: {
    fontSize: 12,
    color: '#888',
    fontFamily: 'iransans',
  },
  footerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
    paddingHorizontal: 8,
    paddingVertical: 6,
    backgroundColor: '#f5f5f5',
    borderRadius: 6,
  },
  shareButtonText: {
    marginRight: 4,
    color: '#666',
    fontSize: 12,
    fontFamily: 'iransans',
  },
  authorText: {
    fontSize: 12,
    color: '#888',
    fontFamily: 'iransans',
  },
  newBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#FF3B30',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  newBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    fontFamily: 'iransans',
  },
  footerLoader: {
    padding: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  footerContainer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    color: '#666',
    fontFamily: 'iransans',
  },
});

export default MarketingEducationScreen;