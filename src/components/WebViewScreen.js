import React, { useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  TouchableOpacity,
  Text,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { WebView } from 'react-native-webview';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function WebViewScreen({ navigation, route }) {
  const { url, title = 'وبسایت' } = route.params;
  const webViewRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);

  // Handle navigation state change
  const onNavigationStateChange = (navState) => {
    setCanGoBack(navState.canGoBack);
    setCanGoForward(navState.canGoForward);
    setLoading(navState.loading);
  };

  // Go back in webview history
  const goBack = () => {
    if (canGoBack) {
      webViewRef.current?.goBack();
    } else {
      navigation.goBack();
    }
  };

  // Go forward in webview history
  const goForward = () => {
    if (canGoForward) {
      webViewRef.current?.goForward();
    }
  };

  // Reload the webview
  const reload = () => {
    webViewRef.current?.reload();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      
      {/* Custom Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.headerButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>

        <View style={styles.headerTitleContainer}>
          {loading && <ActivityIndicator size="small" color="#2196F3" style={styles.loadingIndicator} />}
          <Text style={styles.headerTitle} numberOfLines={1}>{title}</Text>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity onPress={goForward} style={[styles.headerButton, !canGoForward && styles.disabledButton]}>
            <Ionicons name="arrow-forward" size={24} color={canGoForward ? "#333" : "#ccc"} />
          </TouchableOpacity>
          
          <TouchableOpacity onPress={reload} style={styles.headerButton}>
            <Ionicons name="refresh" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      {/* WebView */}
      <WebView
        ref={webViewRef}
        source={{ uri: url }}
        style={styles.webview}
        onNavigationStateChange={onNavigationStateChange}
        startInLoadingState={true}
        allowsBackForwardNavigationGestures={true}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        sharedCookiesEnabled={true}
        renderLoading={() => (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2196F3" />
            <Text style={styles.loadingText}>در حال بارگذاری...</Text>
          </View>
        )}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.warn('WebView error: ', nativeEvent);
        }}
      />
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
  headerButton: {
    padding: 4,
  },
  disabledButton: {
    opacity: 0.5,
  },
  headerTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'iransans',
    textAlign: 'center',
  },
  loadingIndicator: {
    marginRight: 8,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  webview: {
    flex: 1,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
    fontFamily: 'iransans',
  },
});