import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  Share,
  RefreshControl,
  useWindowDimensions
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import RenderHtml from 'react-native-render-html';

const SingleMagazinePost = ({ route, navigation }) => {
  const { postId } = route.params;
  const { width } = useWindowDimensions();
  const [post, setPost] = useState(null);
  const [featuredImage, setFeaturedImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchPost();
  }, [postId]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch post data
      const postResponse = await axios.get(
        `https://mag.ajur.app/wp-json/wp/v2/posts/${postId}`
      );
      
      setPost(postResponse.data);
      
      // Fetch featured media if available
      if (postResponse.data.featured_media) {
        try {
          const mediaResponse = await axios.get(
            `https://mag.ajur.app/wp-json/wp/v2/media/${postResponse.data.featured_media}`
          );
          setFeaturedImage(mediaResponse.data);
        } catch (mediaError) {
          console.log('Featured image not available');
        }
      }
      
      setLoading(false);
      setRefreshing(false);
    } catch (err) {
      console.error('Error fetching post:', err);
      setError('خطا در دریافت مقاله');
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchPost();
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${stripHtmlTags(post.title.rendered)} | ${post.link}`,
        url: post.link,
        title: stripHtmlTags(post.title.rendered)
      });
    } catch (error) {
      alert('خطا در اشتراک گذاری');
    }
  };

  const stripHtmlTags = (html) => {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, '');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  // Custom HTML renderer styles
  const tagsStyles = {
    body: {
      direction: 'rtl',
      textAlign: 'right',
    },
    p: {
      fontSize: 16,
      lineHeight: 28,
      marginBottom: 20,
      textAlign: 'right',
      color: '#333',
      fontFamily: 'iransans',
    },
    h1: {
      fontSize: 26,
      fontWeight: 'bold',
      marginVertical: 20,
      textAlign: 'right',
      color: '#000',
      fontFamily: 'iransans',
    },
    h2: {
      fontSize: 22,
      fontWeight: 'bold',
      marginVertical: 18,
      textAlign: 'right',
      color: '#000',
      fontFamily: 'iransans',
    },
    h3: {
      fontSize: 20,
      fontWeight: '600',
      marginVertical: 16,
      textAlign: 'right',
      color: '#000',
      fontFamily: 'iransans',
    },
    img: {
      width: '100%',
      height: 200,
      borderRadius: 8,
      marginVertical: 16,
    },
    a: {
      color: '#007AFF',
      textDecorationLine: 'underline',
    },
    blockquote: {
      backgroundColor: '#f9f9f9',
      borderLeftWidth: 4,
      borderLeftColor: '#007AFF',
      padding: 15,
      marginVertical: 20,
      fontStyle: 'italic',
    },
    ul: {
      marginBottom: 20,
      paddingRight: 20,
    },
    ol: {
      marginBottom: 20,
      paddingRight: 20,
    },
    li: {
      marginBottom: 8,
      textAlign: 'right',
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>در حال بارگذاری مقاله...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <Ionicons name="alert-circle-outline" size={50} color="#ff3b30" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={fetchPost}
          >
            <Text style={styles.retryButtonText}>تلاش مجدد</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#007AFF']}
            tintColor={'#007AFF'}
          />
        }
      >
        {/* Featured Image */}
        {featuredImage && featuredImage.source_url && (
          <Image 
            source={{ uri: featuredImage.source_url }}
            style={styles.featuredImage}
            resizeMode="cover"
          />
        )}
        
        <View style={styles.content}>
          {/* Title */}
          <Text style={styles.title}>
            {stripHtmlTags(post.title.rendered)}
          </Text>
          
          {/* Meta Information */}
          <View style={styles.metaContainer}>
            <Text style={styles.date}>
              {formatDate(post.date)}
            </Text>
            
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={handleShare}
              >
                <Ionicons name="share-social-outline" size={20} color="#007AFF" />
                <Text style={styles.actionButtonText}>اشتراک</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Content */}
          {post.content && (
            <View style={styles.htmlContent}>
              <RenderHtml
                contentWidth={width}
                source={{ html: post.content.rendered }}
                tagsStyles={tagsStyles}
                baseStyle={styles.htmlBaseStyle}
              />
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#666',
    fontFamily: 'iransans',
  },
  errorText: {
    marginTop: 15,
    fontSize: 16,
    color: '#ff3b30',
    textAlign: 'center',
    fontFamily: 'iransans',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'iransans',
  },
  featuredImage: {
    width: '100%',
    height: 250,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'right',
    color: '#000',
    lineHeight: 36,
    fontFamily: 'iransans',
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  date: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'iransans',
  },
  actionButtons: {
    flexDirection: 'row',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
  },
  actionButtonText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#007AFF',
    fontFamily: 'iransans',
  },
  htmlContent: {
    marginBottom: 30,
  },
  htmlBaseStyle: {
    fontSize: 16,
    lineHeight: 28,
    textAlign: 'right',
    fontFamily: 'iransans',
  },
});

export default SingleMagazinePost;