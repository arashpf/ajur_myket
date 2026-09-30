import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from './styles';

const SearchModal = ({ visible, onClose, notes = [], onCall, onEdit }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef(null);

  const handleSearchChange = (text) => {

   
    setSearchQuery(text);

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (text.trim().length > 1) {
      setIsSearching(true);

      // Set timeout for 1s debounce
      searchTimeoutRef.current = setTimeout(() => {
        const results = notes.filter((note) => {
          const searchableText = `
            ${note.name || ''}
            ${note.mobile || ''}
            ${note.phone || ''}
            ${note.description || ''}
            ${note.category || ''}
          `.toLowerCase();

          return searchableText.includes(text.toLowerCase());
        });

        setSearchResults(results);
        setIsSearching(false);
      }, 1000);
    } else {
      // Clear results if query is empty or only 1 char
      setSearchResults([]);
      setIsSearching(false);
    }
  };

  // Clear search when modal closes
  useEffect(() => {
    if (!visible) {
      setSearchQuery('');
      setSearchResults([]);
      setIsSearching(false);
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
        searchTimeoutRef.current = null;
      }
    }
  }, [visible]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, []);

  const getCategoryColor = (category) => {
    switch (category) {
      case 'خریداران': return '#4CAF50';
      case 'فروشندگان': return '#2196F3';
      case 'موجرین': return '#FF9800';
      case 'مستاجرین': return '#9C27B0';
      case 'نگهبانان': return '#009688';
      default: return '#795548';
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.searchModalOverlay}>
        <View style={styles.searchModalContent}>
          {/* Header */}
          <View style={styles.searchModalHeader}>
            <Text style={styles.searchModalTitle}>جستجوی مخاطبین</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#5d4037" />
            </TouchableOpacity>
          </View>

          {/* Search Input */}
          <View style={styles.searchInputContainer}>
            <Ionicons name="search" size={20} color="#8d6e63" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={handleSearchChange}
              placeholder="جستجو بر اساس نام، شماره، توضیحات..."
              placeholderTextColor="#8d6e63"
              autoFocus
            />
            {searchQuery ? (
              <TouchableOpacity
                onPress={() => {
                  setSearchQuery('');
                  setSearchResults([]);
                  setIsSearching(false);
                  if (searchTimeoutRef.current) {
                    clearTimeout(searchTimeoutRef.current);
                    searchTimeoutRef.current = null;
                  }
                }}
              >
                <Ionicons name="close-circle" size={20} color="#8d6e63" />
              </TouchableOpacity>
            ) : null}
          </View>

          {/* Search Results */}
          <View style={styles.searchResultsContainer}>
            {isSearching ? (
              <View style={styles.searchLoading}>
                <ActivityIndicator size="small" color="#4CAF50" />
                <Text style={styles.searchLoadingText}>در حال جستجو...</Text>
              </View>
            ) : searchQuery.length > 1 && searchResults.length === 0 ? (
              <View style={styles.searchEmpty}>
                <Ionicons name="search-outline" size={48} color="#d7ccc8" />
                <Text style={styles.searchEmptyText}>نتیجه‌ای یافت نشد</Text>
              </View>
            ) : (
              <ScrollView>
                {searchResults.map((note) => (
                  <TouchableOpacity
                    key={note.id}
                    style={styles.searchResultItem}
                    onPress={() => {
                      onEdit(note);
                      onClose();
                    }}
                  >
                    <View style={styles.searchResultContent}>
                      <Text style={styles.searchResultName}>{note.name || 'بدون نام'}</Text>
                      <View style={styles.searchResultDetails}>
                        {note.mobile && (
                          <TouchableOpacity
                            style={styles.searchResultPhone}
                            onPress={(e) => {
                              e.stopPropagation();
                              onCall(note.mobile);
                            }}
                          >
                            <Ionicons name="phone-portrait-outline" size={14} color="#4CAF50" />
                            <Text style={styles.searchResultText}>{note.mobile}</Text>
                          </TouchableOpacity>
                        )}
                        {note.phone && (
                          <TouchableOpacity
                            style={styles.searchResultPhone}
                            onPress={(e) => {
                              e.stopPropagation();
                              onCall(note.phone);
                            }}
                          >
                            <Ionicons name="call-outline" size={14} color="#2196F3" />
                            <Text style={styles.searchResultText}>{note.phone}</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                      {note.description && (
                        <Text style={styles.searchResultDescription} numberOfLines={1}>
                          {note.description}
                        </Text>
                      )}
                    </View>
                    <View
                      style={[
                        styles.searchResultCategory,
                        { backgroundColor: getCategoryColor(note.category) },
                      ]}
                    >
                      <Text style={styles.searchResultCategoryText}>{note.category}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default SearchModal;
