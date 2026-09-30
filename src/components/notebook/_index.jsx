import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Alert,
  Linking,
  ActivityIndicator,
  TextInput,
  RefreshControl,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Contacts from 'react-native-contacts';

// Import services
import ApiService from './services/apiService';

// Import components
import IntroSlider from './parts/IntroSlider';
import CategoryTabs from './parts/CategoryTabs';
import ContactCard from './parts/ContactCard';
import EmptyState from './parts/EmptyState';
import DynamicContactForm from './parts/DynamicContactForm';
import SingleContactModal from './parts/SingleContactModal';
import AboutModal from './parts/AboutModal';
import SaveToPhoneModal from './parts/SaveToPhoneModal';

const NoteBook = () => {
  const [showIntroSlider, setShowIntroSlider] = useState(false);
  const [activeCategory, setActiveCategory] = useState('همه'); // Default to 'All'
  const [selectedNote, setSelectedNote] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showSavePhoneModal, setShowSavePhoneModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [newContactData, setNewContactData] = useState(null);
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [userToken, setUserToken] = useState(null);
  
  // New states for search and refresh
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [previousCategory, setPreviousCategory] = useState('همه'); // Store previous category

  const introSlides = [
    {
      id: 1,
      title: 'دفترچه تلفن اختصاصی املاک ',
      description: 'راهکاری متفاوت و هوشمندانه برای مدیریت مشتریان املاک',
      lottieSource: require('./assets/lottie/one.json'),
      color: '#4CAF50',
    },
    {
      id: 2,
      title: 'دفترچه تلفنی هوشمند',
      description: 'یادآوری پیگیری مشتریان به صورت هوشمند',
      lottieSource: require('./assets/lottie/two.json'),
      color: '#2196F3',
    },
    {
      id: 3,
      title: 'دیگه نگران پاک شدن شماره مشتری هات نباش',
      description: 'دسترسی یکپارچه از روی وب و اپ ، روی هر دستگاهی ، حتی اگه موبایلتو گم کنی !',
      lottieSource: require('./assets/lottie/three.json'),
      color: '#FF9800',
    },
    {
      id: 4,
      title: 'جستجو هوشمندانه ',
      description: 'جستجو روی نام ، توضیحات شماره و غیره',
      lottieSource: require('./assets/lottie/four.json'),
      color: '#9C27B0',
    }
  ];

  // Add 'همه' category at the beginning
  const categories = [
    { id: 'همه', name: 'همه', color: '#607D8B' }, // New 'All' category
    { id: 'خریداران', name: 'خریداران', color: '#4CAF50' },
    { id: 'فروشندگان', name: 'فروشندگان', color: '#2196F3' },
    { id: 'موجرین', name: 'موجرین', color: '#FF9800' },
    { id: 'مستاجرین', name: 'مستاجرین', color: '#9C27B0' },
    { id: 'نگهبانان', name: 'نگهبانان', color: '#009688' },
    { id: 'متفرقه', name: 'متفرقه', color: '#795548' },
  ];

  useEffect(() => {
    const initializeApp = async () => {
      await checkFirstTimeVisit();
      await loadToken();
    };

    initializeApp();
  }, []);

  useEffect(() => {
    if (userToken) {
      loadContacts();
    }
  }, [userToken]);

  const loadToken = async () => {
    try {
      const token = await AsyncStorage.getItem('id_token');
      console.log('Token loaded:', !!token);
      setUserToken(token);
      
      if (!token) {
        Alert.alert('خطا', 'لطفا ابتدا وارد شوید');
        setHasError(true);
      }
    } catch (error) {
      console.error('Error loading token:', error);
      setHasError(true);
    }
  };

  const checkFirstTimeVisit = async () => {
    try {
      const hasSeenIntro = await AsyncStorage.getItem('hasSeenFileBankIntro');
      if (hasSeenIntro === null) {
        setShowIntroSlider(true);
      }
    } catch (error) {
      console.error('Error checking intro status:', error);
    }
  };

  const loadContacts = async () => {
    setRefreshing(false);
    if (!userToken) {
      console.log('No token available, skipping contacts load');
      return;
    }

    try {
      setIsLoading(true);
      setHasError(false);
      
      console.log('Loading contacts from API with token...');
      const response = await ApiService.getContacts();
      
      if (response.data && Array.isArray(response.data)) {
        setNotes(response.data);
      } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
        setNotes(response.data.data);
      } else {
        console.warn('Unexpected API response format:', response.data);
        setNotes([]);
        setHasError(true);
      }
      
    } catch (error) {
      console.error('Error loading contacts:', error);
      setHasError(true);
      
      if (error.response?.status === 401) {
        Alert.alert('خطا', 'توکن نامعتبر است. لطفا مجدداً وارد شوید');
        await AsyncStorage.removeItem('id_token');
        setUserToken(null);
      } else if (error.code === 'NETWORK_ERROR') {
        Alert.alert('خطا', 'اتصال اینترنت برقرار نیست');
      } else {
        Alert.alert('خطا', 'در دریافت مخاطبین مشکلی پیش آمده است');
      }
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  // Pull to refresh handler
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    loadContacts();
  }, []);

  // Search functionality
  const handleSearch = () => {
    // Store current category before switching to search
    setPreviousCategory(activeCategory);
    // Switch to 'همه' category when search starts
    setActiveCategory('همه');
    setIsSearching(true);
  };

  const handleSearchCancel = () => {
    setIsSearching(false);
    setSearchQuery('');
    // Return to previous category when search is cancelled
    setActiveCategory(previousCategory);
  };

  const handleSearchChange = (text) => {
    setSearchQuery(text);
  };

  // Filter notes based on search query and active category
  const filteredNotes = notes.filter(note => {
    // If category is 'همه', show all contacts that match search
    const matchesCategory = activeCategory === 'همه' || note.category === activeCategory;
    
    // If no search query, just filter by category
    if (!searchQuery.trim()) return matchesCategory;
    
    // Search through all fields
    const query = searchQuery.toLowerCase();
    const searchableFields = [
      note.name || '',
      note.mobile || '',
      note.phone || '',
      note.description || '',
      note.category || ''
    ];
    
    return matchesCategory && searchableFields.some(field => 
      field.toLowerCase().includes(query)
    );
  });

  // Rest of your functions remain the same (handleAddNote, saveContactToAPI, etc.)
  const handleAddNote = async (data) => {
    if (!userToken) {
      Alert.alert('خطا', 'لطفا ابتدا وارد شوید');
      return;
    }

    if (data.name.trim() || data.mobile.trim()) {
      try {
        const newNote = {
          ...data,
          date: new Date().toLocaleDateString('fa-IR'),
          time: new Date().toLocaleTimeString('fa-IR'),
          category: data.category || activeCategory,
        };

        setNewContactData(newNote);
        setShowSavePhoneModal(true);
        
      } catch (error) {
        console.error('Error preparing contact:', error);
        Alert.alert('خطا', 'آماده‌سازی مخاطب با مشکل مواجه شد');
      }
    } else {
      Alert.alert('خطا', 'لطفا حداقل نام یا شماره موبایل را وارد کنید');
    }
  };

  const saveContactToAPI = async (contactData) => {
    try {
      console.log('Saving contact to API with token:', userToken);
      const response = await ApiService.createContact(contactData);
      
      let savedContact;
      if (response.data && response.data.id) {
        savedContact = response.data;
      } else if (response.data && response.data.data && response.data.data.id) {
        savedContact = response.data.data;
      } else {
        savedContact = { ...contactData, id: Date.now().toString() };
      }
      
      setNotes(prev => [savedContact, ...prev]);
      return true;
    } catch (error) {
      console.error('Error saving contact to API:', error);
      
      const offlineContact = { ...contactData, id: `offline-${Date.now()}`, offline: true };
      setNotes(prev => [offlineContact, ...prev]);
      
      Alert.alert('هشدار', 'مخاطب به صورت موقت ذخیره شد. بعداً همگام‌سازی خواهد شد');
      return false;
    }
  };

  const saveToPhoneContacts = async (contact) => {
    if (!contact.mobile && !contact.phone) {
      Alert.alert('خطا', 'شماره تلفنی برای ذخیره وجود ندارد');
      return false;
    }

    try {
      const permission = await Contacts.requestPermission();
      
      if (permission === 'authorized') {
        const newContact = {
          givenName: contact.name || 'مخاطب جدید',
          phoneNumbers: []
        };

        if (contact.mobile) {
          newContact.phoneNumbers.push({
            label: 'mobile',
            number: contact.mobile
          });
        }

        if (contact.phone) {
          newContact.phoneNumbers.push({
            label: 'home',
            number: contact.phone
          });
        }

        await Contacts.addContact(newContact);
        Alert.alert('موفقیت', 'مخاطب با موفقیت در گوشی ذخیره شد');
        return true;
      } else {
        Alert.alert(
          'مجوز دسترسی', 
          'برای ذخیره مخاطب در گوشی، نیاز به مجوز دسترسی به مخاطبین دارید',
          [
            { text: 'انصراف', style: 'cancel' },
            { 
              text: 'تنظیمات', 
              onPress: () => Linking.openSettings() 
            }
          ]
        );
        return false;
      }
    } catch (error) {
      console.error('Error saving to phone contacts:', error);
      Alert.alert('خطا', 'ذخیره مخاطب در گوشی با مشکل مواجه شد');
      return false;
    }
  };

  const handleSaveToPhone = async () => {
    if (!newContactData) return;

    const apiSuccess = await saveContactToAPI(newContactData);
    
    if (apiSuccess) {
      await saveToPhoneContacts(newContactData);
    }
    
    setShowSavePhoneModal(false);
    setNewContactData(null);
  };

  const handleSkipSaveToPhone = async () => {
    if (!newContactData) return;

    await saveContactToAPI(newContactData);
    
    setShowSavePhoneModal(false);
    setNewContactData(null);
  };

  const handleCancelSave = () => {
    setShowSavePhoneModal(false);
    setNewContactData(null);
    Alert.alert('انصراف', 'افزودن مخاطب لغو شد');
  };

  const handleDeleteNote = async (id) => {
    try {
      const token = await AsyncStorage.getItem('id_token');
      console.log('Deleting contact ID:', id);

      const formData = new FormData();
      formData.append('token', token);
      
      const response = await fetch(`https://api.ajur.app/api/contact-delete/${id}`, {
        method: 'POST',
        body: formData,
      });
      
      const result = await response.json();
      console.log('Delete result:', result);
      
      if (result.success) {
        setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
        
        if (selectedContact && selectedContact.id === id) {
          setSelectedContact(null);
          setShowContactModal(false);
        }
        
        if (selectedNote && selectedNote.id === id) {
          setSelectedNote(null);
          setShowAddModal(false);
        }
        
        Alert.alert('موفقیت', 'مخاطب با موفقیت حذف شد');
      } else {
        Alert.alert('خطا', result.message || 'حذف مخاطب با مشکل مواجه شد');
      }
      
    } catch (error) {
      console.error('Delete error:', error);
      
      if (error.message?.includes('Network')) {
        Alert.alert('خطا', 'اتصال اینترنت برقرار نیست');
      } else {
        Alert.alert('خطا', 'حذف مخاطب با مشکل مواجه شد');
      }
    }
  };

  const handleEditNote = (note) => {
    setSelectedNote(note);
    setShowAddModal(true);
  };

  const handleUpdateNote = async (data) => {
    if ((data.name.trim() || data.mobile.trim()) && selectedNote) {
      try {
        await ApiService.updateContact(selectedNote.id, {
          ...data,
          date: new Date().toLocaleDateString('fa-IR'),
          time: new Date().toLocaleTimeString('fa-IR'),
        });
        
        setNotes(prev => prev.map(note => 
          note.id === selectedNote.id 
            ? { ...note, ...data }
            : note
        ));
        
        setSelectedNote(null);
      } catch (error) {
        console.error('Error updating contact:', error);
        Alert.alert('خطا', 'بروزرسانی مخاطب با مشکل مواجه شد');
      }
    } else {
      Alert.alert('خطا', 'لطفا حداقل نام یا شماره موبایل را وارد کنید');
    }
  };

  const callNumber = (number) => {
    if (!number) return;

    alert('the number you calling is :' + number);
   
    const url = `tel:${number}`;
    
    Linking.canOpenURL(url)
      .then(supported => {
        if (!supported) {
          Alert.alert('خطا', 'امکان برقراری تماس از طریق این دستگاه وجود ندارد');
        } else {
          return Linking.openURL(url);
        }
      })
      .catch(err => console.error('An error occurred', err));
  };

  const handleViewDetails = (contact) => {
    setSelectedContact(contact);
    setShowContactModal(true);
  };

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    // If we're switching categories while searching, clear search
    if (isSearching && category !== 'همه') {
      setIsSearching(false);
      setSearchQuery('');
    }
  };

  const renderHeader = () => {
    if (isSearching) {
      return (
        <View style={styles.searchHeader}>
          <TextInput
            style={styles.searchInput}
            placeholder="جستجو در همه مخاطبین..."
            value={searchQuery}
            onChangeText={handleSearchChange}
            autoFocus={true}
          />
          <TouchableOpacity onPress={handleSearchCancel}>
            <Ionicons name="close" size={24} color="#5d4037" />
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setShowAboutModal(true)}>
          <Ionicons name="settings-outline" size={24} color="#5d4037" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>دفترچه تلفن</Text>
        
        <TouchableOpacity onPress={handleSearch} disabled={!userToken}>
          <Ionicons 
            name="search" 
            size={24} 
            color={userToken ? '#5d4037' : '#ccc'} 
          />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#085283ff" />
      
      <IntroSlider
        visible={showIntroSlider}
        onClose={() => setShowIntroSlider(false)}
        slides={introSlides}
      />

      {renderHeader()}

      <View style={styles.notebookContainer}>
        <CategoryTabs
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
        />

        {isLoading && !refreshing ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#4CAF50" />
            <Text style={styles.loadingText}>در حال بارگذاری مخاطبین...</Text>
          </View>
        ) : hasError ? (
          <View style={styles.centerContainer}>
            <Ionicons name="cloud-offline" size={64} color="#f44336" />
            <Text style={styles.errorText}>
              {userToken ? 'خطا در دریافت مخاطبین' : 'لطفا ابتدا وارد شوید'}
            </Text>
            <TouchableOpacity 
              style={styles.retryButton}
              onPress={loadContacts}
            >
              <Text style={styles.retryButtonText}>تلاش مجدد</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <ScrollView 
            style={styles.notesList}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['#4CAF50']}
                tintColor="#4CAF50"
              />
            }
          >
            {filteredNotes.map((note) => (
              <ContactCard
                key={note.id}
                note={note}
                categories={categories}
                onEdit={handleEditNote}
                onSaveToContacts={() => saveToPhoneContacts(note)}
                onDelete={handleDeleteNote}
                onCall={callNumber}
                onViewDetails={handleViewDetails}
              />
            ))}
            
            {filteredNotes.length === 0 && !hasError && (
              <EmptyState 
                isSearching={!!searchQuery.trim()}
                searchQuery={searchQuery}
              />
            )}
          </ScrollView>
        )}
      </View>

      {/* Add FAB */}
      <TouchableOpacity 
        style={[styles.addFab, !userToken && styles.disabledFab]}
        onPress={() => setShowAddModal(true)}
        disabled={!userToken}
      >
        <Text style={styles.fabIcon}>＋</Text>
      </TouchableOpacity>

      {/* Dynamic Contact Form Modal */}
      <DynamicContactForm
        visible={showAddModal}
        onClose={() => {
          setSelectedNote(null);
          setShowAddModal(false);
        }}
        onSave={handleAddNote}
        isEditing={!!selectedNote}
        initialData={selectedNote || null}
        categories={categories.filter(cat => cat.id !== 'همه')} // Exclude 'All' from form categories
      />

      {/* Single Contact Modal */}
      <SingleContactModal
        visible={showContactModal}
        contact={selectedContact}
        onClose={() => setShowContactModal(false)}
        onCall={callNumber}
        onEdit={handleEditNote}
        onDelete={handleDeleteNote}
      />

      {/* About Modal */}
      <AboutModal
        visible={showAboutModal}
        onClose={() => setShowAboutModal(false)}
      />

      {/* Save to Phone Modal */}
      <SaveToPhoneModal
        visible={showSavePhoneModal}
        contact={newContactData}
        onSave={handleSaveToPhone}
        onSkip={handleSkipSaveToPhone}
        onCancel={handleCancelSave}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#085283ff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#d7ccc8',
    backgroundColor: 'white',
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#d7ccc8',
    backgroundColor: 'white',
  },
  searchInput: {
    flex: 1,
    marginRight: 12,
    padding: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    textAlign: 'right',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#5d4037',
  },
  notebookContainer: {
    flex: 1,
    backgroundColor: '#085283ff',
  },
  notesList: {
    flex: 1,
    paddingHorizontal: 12,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#5d4037',
  },
  errorText: {
    fontSize: 18,
    color: '#f44336',
    marginTop: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  addFab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  disabledFab: {
    backgroundColor: '#cccccc',
  },
  fabIcon: {
    fontSize: 30,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default NoteBook;