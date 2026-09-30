import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  Text,
  FlatList,
  Platform,
  SafeAreaView,
  Share,
  Alert,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Spinner from 'react-native-spinkit';
import DashboardHeader from './parts/DashboardHeader';
import WorkerRealEstateCard from '../cards/WorkerRealEstateCard';
import Icon from 'react-native-vector-icons/Ionicons';
import NewWorkerFab from '../fabs/NewWorkerFab';

const { width: screenWidth } = Dimensions.get('window');

const Dashboard = ({ route, navigation }) => {
  // State variables
  const [search, setSearch] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedCat, setSelectedCat] = useState(0);
  const [loading, setLoading] = useState(true);
  const [noPost, setNoPost] = useState(false);
  const [selectMode, setSelectMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('all');

  const inputRef = useRef(null);

  // Load selected items from storage
  useEffect(() => {
    const loadSelectedItems = async () => {
      try {
        const savedItems = await AsyncStorage.getItem('selectedWorkers');
        if (savedItems) {
          setSelectedItems(JSON.parse(savedItems));
          if (JSON.parse(savedItems).length > 0) {
            setSelectMode(true);
          }
        }
      } catch (error) {
        console.error('Error loading selected items:', error);
      }
    };
    loadSelectedItems();
  }, []);

  // Save selected items to storage
  useEffect(() => {
    const saveSelectedItems = async () => {
      try {
        await AsyncStorage.setItem('selectedWorkers', JSON.stringify(selectedItems));
      } catch (error) {
        console.error('Error saving selected items:', error);
      }
    };
    saveSelectedItems();
  }, [selectedItems]);

  // Load data
  useEffect(() => {
    fetchData(selectedCat);
  }, [selectedCat]);

  const fetchData = (catId) => {
    setLoading(true);
    AsyncStorage.getItem('id_token').then((token) => {
      const params = {
        title: 'title',
        selectedcat: catId,
        token: token,
        collect: 'all',
      };

      axios({
        method: 'get',
        url: 'https://api.ajur.app/api/realstate-workers',
        params: params,
      })
      .then((response) => {
        const workers = response.data.workers || [];
        setAllData(workers);
        applyFilter(workers, selectedFilter);
        setSubcategories(response.data.subcategories || []);
        setNoPost(workers.length === 0);
      })
      .catch((error) => {
        console.error('Fetch error:', error);
      })
      .finally(() => {
        setLoading(false);
      });
    });
  };

  // Apply filter to data
  const applyFilter = useCallback((data, filterType) => {
    let filtered = [...data];
    
    switch (filterType) {
      case 'special':
        filtered = data.filter(w => w.is_special === true);
        break;
      case 'urgent':
        filtered = data.filter(w => w.is_urgent === true);
        break;
      case 'expired':
        filtered = data.filter(w => w.status === '5');
        break;
      case 'pending':
        filtered = data.filter(w => w.status === '2');
        break;
      case 'all':
      default:
        filtered = data;
        break;
    }
    
    setFilteredData(filtered);
  }, []);

  const handleDeleteSuccess = useCallback((deletedId) => {
    setAllData(prev => prev.filter(item => item.id !== deletedId));
    setFilteredData(prev => prev.filter(item => item.id !== deletedId));
    setSelectedItems(prev => prev.filter(id => id !== deletedId));
  }, []);

  // Handle filter change
  const handleFilterChange = useCallback((filterType) => {
    setSelectedFilter(filterType);
    applyFilter(allData, filterType);
  }, [allData, applyFilter]);

  // Get counts for statistics
  const counts = useMemo(() => {
    return {
      all: allData.length,
      special: allData.filter(w => w.is_special === true).length,
      urgent: allData.filter(w => w.is_urgent === true).length,
      expired: allData.filter(w => w.status === '5').length,
      pending: allData.filter(w => w.status === '2').length,
    };
  }, [allData]);

  // Selection handlers
  const toggleSelection = useCallback((id) => {
    setSelectedItems(prev => {
      const newSelected = prev.includes(id)
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id];
      
      if (newSelected.length > 0 && !selectMode) {
        setSelectMode(true);
      } else if (newSelected.length === 0 && selectMode) {
        setSelectMode(false);
      }
      
      return newSelected;
    });
  }, [selectMode]);

  const handleLongPress = useCallback((id) => {
    if (!selectMode) setSelectMode(true);
    toggleSelection(id);
  }, [selectMode, toggleSelection]);

  const clearSelection = useCallback(() => {
    setSelectedItems([]);
    setSelectMode(false);
  }, []);

  // Footer actions
  const handleShareSelected = useCallback(async () => {
    try {
      if (selectedItems.length === 0) {
        Alert.alert('خطا', 'لطفاً حداقل یک مورد را انتخاب کنید');
        return;
      }

      setLoading(true);
      
      const token = await AsyncStorage.getItem('id_token');
      
      const response = await axios.post(
        'https://api.ajur.app/api/share-selection',
        { selectedIds: selectedItems, token: token },
      );
      
      const shortUrl = response.data.short_url;
      
      await Share.share({
        message: `سلام ، لطفا به این فایل هایی که فرستادم نگاهی بندازید ${shortUrl}`,
        url: shortUrl,
        title: 'فایل های به اشتراک گذاشته شده با شما'
      });

    } catch (error) {
      console.error('Sharing error:', error);
      Alert.alert(
        'خطا', 
        error.response?.data?.message || 'در ایجاد لینک اشتراک‌گذاری خطایی رخ داد'
      );
    } finally {
      setLoading(false);
    }
  }, [selectedItems]);

  const handleAddToList = useCallback(() => {
    navigation.navigate('AddToList', { selectedItems });
  }, [navigation, selectedItems]);

  // Search and filter
  const handleInputChange = useCallback((text) => {
    setSearch(text);
    if (text) {
      const searched = allData.filter(item => 
        item.name?.toLowerCase().includes(text.toLowerCase()) ||
        item.cat_name?.toLowerCase().includes(text.toLowerCase())
      );
      applyFilter(searched, selectedFilter);
    } else {
      applyFilter(allData, selectedFilter);
    }
  }, [allData, selectedFilter, applyFilter]);

  // Category selection
  const onPressCategory = useCallback((cat) => {
    setSelectedCat(cat.id);
    setLoading(true);
    fetchData(cat.id);
  }, []);

  // Render statistics cards
  const renderStatisticsCards = useMemo(() => {
    const items = [
      { type: 'all', title: 'همه آگهی ها', color: '#1976d2', icon: 'apps-outline', count: counts.all },
      { type: 'special', title: 'ویژه', color: '#8e24aa', icon: 'star-outline', count: counts.special },
      { type: 'urgent', title: 'فوری', color: '#f57c00', icon: 'flash-outline', count: counts.urgent },
      { type: 'expired', title: 'منقضی شده', color: '#d32f2f', icon: 'close-circle-outline', count: counts.expired },
      { type: 'pending', title: 'در انتظار ', color: '#ed6c02', icon: 'time-outline', count: counts.pending },
    ];

    const cardWidth = (screenWidth - 40) / 5;

    return (
      <View style={styles.statsWrapper}>
        {items.map((item) => (
          <TouchableOpacity
            key={item.type}
            style={[
              styles.statCard,
              { width: cardWidth },
              selectedFilter === item.type && styles.statCardActive,
            ]}
            onPress={() => handleFilterChange(item.type)}
            activeOpacity={0.8}
          >
            <View style={[styles.statIconContainer, { backgroundColor: `${item.color}15` }]}>
              <Icon name={item.icon} size={22} color={item.color} />
            </View>
            <Text style={[styles.statCount, { color: item.color }]}>{item.count}</Text>
            <Text style={styles.statTitle}>{item.title}</Text>
            {selectedFilter === item.type && (
              <View style={[styles.activeIndicator, { backgroundColor: item.color }]} />
            )}
          </TouchableOpacity>
        ))}
      </View>
    );
  }, [counts, selectedFilter, handleFilterChange]);

  // Render categories
  const renderCategories = useCallback(() => (
    <>
      {!loading && (
        <TouchableOpacity
          key="all-files"
          onPress={() => onPressCategory({ id: 0 })}
          style={[
            styles.categoryBtn,
            selectedCat === 0 && styles.categoryBtnSelected,
          ]}>
          <Text style={[
            styles.categoryText,
            selectedCat === 0 && styles.categoryTextSelected,
          ]}>
            همه فایل ها
          </Text>
        </TouchableOpacity>
      )}
      {subcategories.map((cat) => (
        <TouchableOpacity
          key={cat.id}
          onPress={() => onPressCategory(cat)}
          style={[
            styles.categoryBtn,
            selectedCat === cat.id && styles.categoryBtnSelected,
          ]}>
          <Text style={[
            styles.categoryText,
            selectedCat === cat.id && styles.categoryTextSelected,
          ]}>
            {cat.name} ({cat.counts})
          </Text>
        </TouchableOpacity>
      ))}
    </>
  ), [loading, selectedCat, subcategories, onPressCategory]);

  const renderCategorySliders = useCallback(() => {
    if (noPost) {
      return (
        <TouchableOpacity
          onPress={() => navigation.navigate('NewWorker')}
          style={styles.noPostContainer}>
          <ImageBackground
            source={require('../assets/img/add-image.png')}
            style={{ height: 100, width: 100, margin: 20 }} />
          <Text style={styles.noPostText}>
            آگهی فعالی برای مشاور املاک شما هنوز وجود ندارد ، اولین آگهی خود
            را ثبت کنید و همزمان با دریافت ستاره دوم به کاربران فعال در اطراف
            محدوده مشاور املاک خود پیشنهاد شوید
          </Text>
        </TouchableOpacity>
      );
    }
    return (
      <View style={{ marginTop: 10 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScrollView}>
          {renderCategories()}
        </ScrollView>
      </View>
    );
  }, [noPost, navigation, renderCategories]);

  // Render grid or spinner
  const renderGridOrSpinner = useCallback(() => {
    if (loading) {
      return (
        <View style={styles.spinnerView}>
          <Spinner
            isVisible={true}
            size={30}
            type="Circle"
            color="#b92a31"
          />
        </View>
      );
    }
    
    if (filteredData.length === 0 && !loading) {
      return (
        <View style={styles.emptyContainer}>
          <Icon name="folder-open-outline" size={60} color="#ccc" />
          <Text style={styles.emptyText}>هیچ آگهی‌ای یافت نشد</Text>
        </View>
      );
    }
    
    return (
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        renderItem={({ item }) => (
          <WorkerRealEstateCard 
            data={item}
            isSelected={selectedItems.includes(item.id)}
            selectMode={selectMode}
            onPress={() => toggleSelection(item.id)}
            onLongPress={() => handleLongPress(item.id)}
            onDeleteSuccess={handleDeleteSuccess}
          />
        )}
        initialNumToRender={6}
        maxToRenderPerBatch={5}
        windowSize={10}
        removeClippedSubviews={true}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 10, paddingBottom: selectMode ? 70 : 20 }}
        getItemLayout={(data, index) => ({
          length: 180,
          offset: 180 * index,
          index,
        })}
        updateCellsBatchingPeriod={100}
      />
    );
  }, [loading, filteredData, selectedItems, selectMode, toggleSelection, handleLongPress, handleDeleteSuccess]);

  // Render footer
  const renderFooter = useCallback(() => {
    if (!selectMode) return null;
    
    return (
      <View style={styles.footerContainer}>
        <TouchableOpacity 
          style={styles.footerButton}
          onPress={clearSelection}
        >
          <Icon name="close" size={22} color="#ff3b30" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.footerButton}
          onPress={handleShareSelected}
        >
          <Icon name="share-social" size={22} color="#007AFF" />
          <Text style={styles.footerButtonText}> اشتراک گذاری</Text>
        </TouchableOpacity>
        
        <View style={styles.footerButton}>
          <Text style={styles.footerCountText}>{selectedItems.length} انتخاب شده</Text>
        </View>
      </View>
    );
  }, [selectMode, clearSelection, handleShareSelected, selectedItems]);

  return (
    <SafeAreaView style={styles.container}>
      <DashboardHeader
        isSearchFocused={isSearchFocused}
        search={search}
        onBackButtonPress={() => {
          setIsSearchFocused(false);
          setSearch('');
          applyFilter(allData, selectedFilter);
        }}
        onStartSearch={() => {
          setIsSearchFocused(true);
          setTimeout(() => inputRef.current?.focus(), 100);
        }}
        onInputChange={handleInputChange}
        onToggleFilter={() => navigation.navigate('Setting')}
        onCloseSearchPress={() => {
          setIsSearchFocused(false);
          setSearch('');
          applyFilter(allData, selectedFilter);
        }}
        inputRef={inputRef}
      />

      <ScrollView 
        keyboardShouldPersistTaps="handled" 
        style={styles.scrollView}
        contentContainerStyle={selectMode ? { paddingBottom: 70 } : {}}
        showsVerticalScrollIndicator={false}
      >
        {/* Statistics Cards */}
        {renderStatisticsCards}
        
        {/* Categories */}
        {renderCategorySliders()}
        
        {/* Content */}
        {renderGridOrSpinner()}
      </ScrollView>
      
      {/* Footer for selection mode */}
      {renderFooter()}
      
      {/* Floating Add Button */}
      <NewWorkerFab navigation={navigation} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  scrollView: {
    flex: 1,
  },
  spinnerView: {
    flex: 1,
    height: 430,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Statistics Cards Styles
  statsWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    marginTop: 60,
    marginBottom: 8,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    position: 'relative',
  },
  statCardActive: {
    backgroundColor: '#fff',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  statCount: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  statTitle: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    fontFamily: 'iransans',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  // Categories Styles
  categoryBtn: {
    margin: 5,
    padding: 8,
    borderWidth: 1,
    borderColor: 'orange',
    borderRadius: 5,
    backgroundColor: 'white',
  },
  categoryBtnSelected: {
    backgroundColor: 'orange',
  },
  categoryText: {
    color: 'black',
    fontFamily: 'iransans',
  },
  categoryTextSelected: {
    color: 'white',
  },
  categoriesScrollView: {
    height: 50,
    marginBottom: 8,
  },
  noPostContainer: {
    textAlign: 'center',
    marginTop: 20,
    alignItems: 'center',
    padding: 20,
    justifyContent: 'flex-end',
  },
  noPostText: {
    fontFamily: 'iransans',
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    marginTop: 12,
    fontFamily: 'iransans',
  },
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingVertical: 10,
    paddingHorizontal: 15,
    height: 60,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  footerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  footerButtonText: {
    fontFamily: 'iransans',
    color: '#007AFF',
    marginLeft: 7,
    fontSize: 14,
  },
  footerCountText: {
    fontFamily: 'iransans',
    color: '#333',
    fontSize: 14,
  },
});

export default Dashboard;