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
const ITEM_HEIGHT = 200 + 16 + 16 + 90; // ✅ Increased height for share button

const MagazinePosts = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [categoryId, setCategoryId] = useState(null);
  const [seenPostIds, setSeenPostIds] = useState(new Set()); // ✅ Track seen posts

  // ✅ Load category_id and seen posts from AsyncStorage when component mounts
  useEffect(() => {
    const loadStorageData = async () => {
      try {
        const savedCategoryId = await AsyncStorage.getItem('magazine_category_id');
        if (savedCategoryId) {
          setCategoryId(savedCategoryId);
        }

        // ✅ Load seen post IDs
        const seenPosts = await AsyncStorage.getItem('magazine_seen_posts');
        if (seenPosts) {
          setSeenPostIds(new Set(JSON.parse(seenPosts)));
        }
      } catch (error) {
        console.error('Error loading storage data:', error);
      }
    };
    loadStorageData();
  }, []);

  // ✅ Save seen post IDs to AsyncStorage
  const saveSeenPostIds = async (newSeenIds) => {
    try {
      await AsyncStorage.setItem('magazine_seen_posts', JSON.stringify([...newSeenIds]));
    } catch (error) {
      console.error('Error saving seen posts:', error);
    }
  };

  // ✅ Helper function to remove duplicates
  const removeDuplicatePosts = (postsArray) => {
    const seenIds = new Set();
    return postsArray.filter(post => {
      if (seenIds.has(post.id)) {
        return false;
      }
      seenIds.add(post.id);
      return true;
    });
  };

  // ✅ Helper function to shuffle array (for randomization)
  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  // ✅ Filter out seen posts and prioritize new ones
  const filterAndSortPosts = (postsArray, seenIds) => {
    const newPosts = [];
    const seenPosts = [];

    // Separate new posts from seen posts
    postsArray.forEach(post => {
      if (seenIds.has(post.id)) {
        seenPosts.push(post);
      } else {
        newPosts.push(post);
      }
    });

    // Shuffle new posts and seen posts separately
    const shuffledNewPosts = shuffleArray(newPosts);
    const shuffledSeenPosts = shuffleArray(seenPosts);

    return [...shuffledNewPosts, ...shuffledSeenPosts];
  };

  const fetchPosts = useCallback(async (pageNum = 1, isRefreshing = false) => {
    if (isRefreshing) {
      setRefreshing(true);
    } else if (pageNum === 1) {
      setLoading(true);
    }

    try {
      // ✅ Build API URL based on whether we have a category_id
      let url = `https://mag.ajur.app/wp-json/wp/v2/posts?per_page=5&page=${pageNum}&_embed`;
      if (categoryId) {
        url = `https://mag.ajur.app/wp-json/wp/v2/posts?per_page=5&page=${pageNum}&categories=${categoryId}&_embed`;
      }

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }

      const totalPages = response.headers.get('X-WP-TotalPages');
      const data = await response.json();

      if (data.length === 0 || pageNum >= parseInt(totalPages)) {
        setHasMore(false);
      } else {
        // ✅ Remove duplicates before updating state
        const cleanData = removeDuplicatePosts(data);
        
        if (pageNum === 1) {
          // ✅ For first page, filter and randomize posts
          const filteredAndSortedPosts = filterAndSortPosts(cleanData, seenPostIds);
          setPosts(filteredAndSortedPosts);
        } else {
          // ✅ For pagination, merge and remove duplicates
          setPosts(prevPosts => {
            const mergedPosts = [...prevPosts, ...cleanData];
            const uniquePosts = removeDuplicatePosts(mergedPosts);
            return filterAndSortPosts(uniquePosts, seenPostIds);
          });
        }
        setPage(pageNum + 1);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      Alert.alert('خطا', 'در دریافت مقالات مشکلی پیش آمده است');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [categoryId, seenPostIds]);

  // ✅ Reset posts when category changes
  useEffect(() => {
    setPosts([]);
    setPage(1);
    setHasMore(true);
    setLoading(true);
    
    const timeoutId = setTimeout(() => {
      fetchPosts(1);
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }, [categoryId, fetchPosts]);

  // ✅ Share functionality - FIXED: Removed automatic refresh
  const handleShare = async (post) => {
    try {
      // ✅ Construct WordPress post URL
      const postUrl = `https://mag.ajur.app/${post.slug}`;
      
      const shareOptions = {
        message: `${post.title.rendered}\n\n${postUrl}`,
        title: post.title.rendered,
        url: postUrl, // For apps that can handle URLs
      };

      await Share.share(shareOptions);
      
      // ✅ Only mark as seen when shared successfully - no automatic refresh
      // const newSeenIds = new Set(seenPostIds);
      // newSeenIds.add(post.id);
      // setSeenPostIds(newSeenIds);
      // saveSeenPostIds(newSeenIds);
      
    } catch (error) {
      console.error('Error sharing post:', error);
      Alert.alert('خطا', 'در اشتراک گذاری مقاله مشکلی پیش آمده است');
    }
  };

  const handleLoadMore = () => {
    if (!loading && hasMore && posts.length > 0) {
      fetchPosts(page);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setPage(1);
    setHasMore(true);
    fetchPosts(1, true);
  };

  // ✅ Improved post tap handler
  const handlePostPress = useCallback(async (item) => {

    
    // ✅ Mark post as seen when user opens it
    const newSeenIds = new Set(seenPostIds);
    newSeenIds.add(item.id);
    setSeenPostIds(newSeenIds);
    saveSeenPostIds(newSeenIds);

    

    // ✅ Save category_id of pressed post
    if (item.categories && item.categories.length > 0) {
      try {
        const newCategoryId = item.categories[0].toString();
        await AsyncStorage.setItem('magazine_category_id', newCategoryId);
      } catch (error) {
        console.error('Error saving category_id:', error);
      }
    }

    // navigation.navigate('SingleMagazinePost', { postId: item.id });

     const postUrl = `https://mag.ajur.app/${item.slug}`;

    //  alert('show me the post');
    // return;
     navigation.navigate('WebViewScreen', {
     url: postUrl,
     title: 'بازگشت به صفحه دستیار هوشمند'
    });
  }, [navigation, seenPostIds]);

  const stripHtmlTags = (html) => html.replace(/<[^>]*>/g, '');
  const formatDate = (dateString) => new Intl.DateTimeFormat('fa-IR').format(new Date(dateString));
  
  // ✅ Get author name from embedded data
  const getAuthorName = (item) => {
    if (item._embedded && item._embedded.author && item._embedded.author[0]) {
      return item._embedded.author[0].name;
    }
    return 'نویسنده ناشناس';
  };

  const renderItem = useCallback(({ item }) => {
    const featuredMedia =
      item._embedded &&
      item._embedded['wp:featuredmedia'] &&
      item._embedded['wp:featuredmedia'][0];

    const isNewPost = !seenPostIds.has(item.id);

    return (
      <View style={styles.postCard}>
        <TouchableOpacity onPress={() => handlePostPress(item)}>
          {/* ✅ Rounded image with margin from content */}
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
            {/* ✅ New post badge */}
            {isNewPost && (
              <View style={styles.newBadge}>
                <Text style={styles.newBadgeText}>جدید</Text>
              </View>
            )}
          </View>

          {/* ✅ Content with proper spacing from image */}
          <View style={styles.postContent}>
            <Text style={styles.postTitle}>{item.title.rendered}</Text>
            <Text style={styles.postExcerpt} numberOfLines={3}>
              {stripHtmlTags(item.excerpt.rendered)}
            </Text>
            
            {/* ✅ Footer with date, share button, and author */}
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
          <Text style={styles.footerText}>همه مقالات بارگذاری شدند</Text>
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

  const keyExtractor = useCallback((item, index) => {
    return `${item.id}_${index}_${item.date}`;
  }, []);

  if (loading && posts.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>در حال بارگذاری مقالات...</Text>
      </View>
    );
  }

  if (posts.length === 0 && !loading) {
    return (
      <View style={styles.noPostsContainer}>
        <Ionicons name="document-text-outline" size={50} color="#ccc" />
        <Text style={styles.noPostsText}>مقاله‌ای یافت نشد</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => fetchPosts(1)}>
          <Text style={styles.retryButtonText}>تلاش مجدد</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
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
        maxToRenderPerBatch={5}
        windowSize={5}
        initialNumToRender={5}
        removeClippedSubviews={true}
        getItemLayout={(data, index) => ({
          length: ITEM_HEIGHT,
          offset: ITEM_HEIGHT * index,
          index,
        })}
        updateCellsBatchingPeriod={100}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 16,
    paddingHorizontal: 16,
    backgroundColor: '#f5f5f5',
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
    borderRadius: 16, // ✅ Increased border radius
    marginBottom: 16,
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
    borderRadius: 16
  },
  postImagePlaceholder: {
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  postContent: {
    padding: 16,
    paddingTop: 12, // ✅ Reduced top padding to create distance from image
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
    flex: 1,
  },
  footerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 2,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
    marginRight:16,
    paddingHorizontal: 8,
    paddingVertical: 8,
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
    padding: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  footerContainer: {
    padding: 10,
    alignItems: 'center',
  },
  footerText: {
    color: '#666',
    fontFamily: 'iransans',
  },
});

export default MagazinePosts;