import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  Image
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function AIAssistantHub({navigation}) {
  const [notifications, setNotifications] = useState([
    { 
      id: 1, 
      text: 'هوش مصنوعی پاسخ جدیدی برای شما تولید کرد', 
      time: '۵ دقیقه پیش', 
      read: false,
      icon: 'sparkles'
    },
    { 
      id: 2, 
      text: 'فایل جدیدی در پوشه "پروژه‌ها" آپلود شد', 
      time: '۱ ساعت پیش', 
      read: false,
      icon: 'document'
    },
    { 
      id: 3, 
      text: 'یادآوری: جلسه فردا با تیم توسعه', 
      time: '۲ ساعت پیش', 
      read: true,
      icon: 'calendar'
    },
  ]);

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('https://mag.ajur.app/wp-json/wp/v2/posts?per_page=5&page=2&categories=6');
      const data = await response.json();
      setPosts(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setLoading(false);
    }
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? {...notif, read: true} : notif
    ));
  };

  const onPressFileBank = () => {
    alert('file bank is clicked');
    navigation.navigate('FileBank');
  };

  const handleFeaturePress = (featureName) => {
    Alert.alert(featureName, `این بخش ${featureName} را باز می‌کند`);
  };

  const stripHtmlTags = (html) => {
    return html.replace(/<[^>]*>/g, '');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fa-IR').format(date);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>مرکز کمک هوش مصنوعی</Text>
        <TouchableOpacity>
          <Ionicons name="settings-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Main Features Section - 8 Tiles */}
        <View style={styles.section}>
          <View style={styles.featuresGrid}>
            {/* Files Feature */}
            <TouchableOpacity 
              style={styles.featureCard}
              onPress={() => handleFeaturePress('فایل‌ها')}
            >
              <View style={styles.featureContent}>
                <View style={[styles.featureIcon, {backgroundColor: '#4CAF50'}]}>
                  <Ionicons name="document-outline" size={32} color="white" />
                </View>
                <Text style={styles.featureTitle}>فایل‌ها</Text>
              </View>
            </TouchableOpacity>

            {/* Notebook Feature */}
            <TouchableOpacity 
              style={styles.featureCard}
              onPress={() => handleFeaturePress('دفترچه')}
            >
              <View style={styles.featureContent}>
                <View style={[styles.featureIcon, {backgroundColor: '#FF9800'}]}>
                  <Ionicons name="book-outline" size={32} color="white" />
                </View>
                <Text style={styles.featureTitle}>دفترچه</Text>
              </View>
            </TouchableOpacity>
          </View>
          
          <View style={[styles.featuresGrid, {marginTop: 12}]}>
            {/* Regional File Bank Feature */}
            <TouchableOpacity 
              style={styles.featureCard}
              onPress={() => onPressFileBank()}
            >
              <View style={styles.featureContent}>
                <View style={[styles.featureIcon, {backgroundColor: '#2196F3'}]}>
                  <Ionicons name="archive-outline" size={32} color="white" />
                </View>
                <Text style={styles.featureTitle}>بانک فایل</Text>
              </View>
            </TouchableOpacity>

            {/* Education Feature */}
            <TouchableOpacity 
              style={styles.featureCard}
              onPress={() => onPressFileBank()}
            >
              <View style={styles.featureContent}>
                <View style={[styles.featureIcon, {backgroundColor: '#9C27B0'}]}>
                  <Ionicons name="school-outline" size={32} color="white" />
                </View>
                <Text style={styles.featureTitle}>آموزش</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={[styles.featuresGrid, {marginTop: 12}]}>
            {/* Increase Views Feature */}
            <TouchableOpacity 
              style={styles.featureCard}
              onPress={() => onPressFileBank()}
            >
              <View style={styles.featureContent}>
                <View style={[styles.featureIcon, {backgroundColor: '#2196F3'}]}>
                  <Ionicons name="eye-outline" size={32} color="white" />
                </View>
                <Text style={styles.featureTitle}>افزایش بازدید</Text>
              </View>
            </TouchableOpacity>

            {/* Management Feature */}
            <TouchableOpacity 
              style={styles.featureCard}
              onPress={() => onPressFileBank()}
            >
              <View style={styles.featureContent}>
                <View style={[styles.featureIcon, {backgroundColor: '#9C27B0'}]}>
                  <Ionicons name="settings-outline" size={32} color="white" />
                </View>
                <Text style={styles.featureTitle}>مدیریت</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={[styles.featuresGrid, {marginTop: 12}]}>
            {/* Support Feature */}
            <TouchableOpacity 
              style={styles.featureCard}
              onPress={() => onPressFileBank()}
            >
              <View style={styles.featureContent}>
                <View style={[styles.featureIcon, {backgroundColor: '#9C27B0'}]}>
                  <Ionicons name="help-buoy-outline" size={32} color="white" />
                </View>
                <Text style={styles.featureTitle}>پشتیبانی</Text>
              </View>
            </TouchableOpacity>

            {/* Brick Marketing Feature */}
            <TouchableOpacity 
              style={styles.featureCard}
              onPress={() => onPressFileBank()}
            >
              <View style={styles.featureContent}>
                <View style={[styles.featureIcon, {backgroundColor: '#2196F3'}]}>
                  <Ionicons name="megaphone-outline" size={32} color="white" />
                </View>
                <Text style={styles.featureTitle}>بازاریابی آجر</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Blog Posts Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>مقالات اخیر</Text>
          
          {loading ? (
            <Text style={styles.loadingText}>در حال بارگذاری مقالات...</Text>
          ) : posts.length > 0 ? (
            posts.map((post) => (
              <TouchableOpacity 
                key={post.id} 
                style={styles.postCard}
                onPress={() => Alert.alert(post.title.rendered, 'باز کردن مقاله کامل')}
              >
                {post.featured_media && (
                  <Image 
                    source={{ uri: `https://mag.ajur.app/wp-json/wp/v2/media/${post.featured_media}` }}
                    style={styles.postImage}
                    resizeMode="cover"
                  />
                )}
                <View style={styles.postContent}>
                  <Text style={styles.postTitle}>{post.title.rendered}</Text>
                  <Text style={styles.postExcerpt} numberOfLines={2}>
                    {stripHtmlTags(post.excerpt.rendered)}
                  </Text>
                  <Text style={styles.postDate}>{formatDate(post.date)}</Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noPostsText}>مقاله‌ای یافت نشد</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: 'white',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
    textAlign: 'right',
  },
  featuresGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  featureCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featureContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  featureIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'right',
    fontFamily: 'iransans'
  },
  // Post styles
  postCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  postImage: {
    width: '100%',
    height: 200,
  },
  postContent: {
    padding: 16,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
    textAlign: 'right',
  },
  postExcerpt: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    textAlign: 'right',
    lineHeight: 20,
  },
  postDate: {
    fontSize: 12,
    color: '#888',
    textAlign: 'right',
  },
  loadingText: {
    textAlign: 'center',
    padding: 20,
    color: '#666',
  },
  noPostsText: {
    textAlign: 'center',
    padding: 20,
    color: '#666',
  },
});