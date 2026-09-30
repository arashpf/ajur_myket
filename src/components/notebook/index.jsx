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
  const [activeCategory, setActiveCategory] = useState('همه');
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
  
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [previousCategory, setPreviousCategory] = useState('همه');

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

  const categories = [
    { id: 'همه', name: 'همه', color: '#607D8B' },
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

        // For debugging - always show intro
    // setShowIntroSlider(true);
    // return;

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

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    loadContacts();
  }, []);

  const handleSearch = () => {
    setPreviousCategory(activeCategory);
    setActiveCategory('همه');
    setIsSearching(true);
  };

  const handleSearchCancel = () => {
    setIsSearching(false);
    setSearchQuery('');
    setActiveCategory(previousCategory);
  };

  const handleSearchChange = (text) => {
    setSearchQuery(text);
  };

  // Improved duplicate check - better handling for editing
  const isDuplicateContact = (name, mobile, excludeId = null) => {
    if (!name.trim() && !mobile.trim()) return false;
    
    return notes.some(note => {
      // Skip the contact we're editing
      if (excludeId && note.id === excludeId) return false;
      
      const nameMatch = name && note.name && 
        note.name.trim().toLowerCase() === name.trim().toLowerCase();
      
      const mobileMatch = mobile && note.mobile && 
        note.mobile === mobile;
      
      return nameMatch || mobileMatch;
    });
  };

  const filteredNotes = notes.filter(note => {
    const matchesCategory = activeCategory === 'همه' || note.category === activeCategory;
    
    if (!searchQuery.trim()) return matchesCategory;
    
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

  // Reset form when opening for new contact
  const handleAddButtonPress = () => {

   
   
 
    
    setSelectedNote(null); // Clear any previous selection
     setNewContactData(null); // Clear any pending contact data
    setShowAddModal(true);
  };

  const handleAddNote = async (data) => {
    if (!userToken) {
      Alert.alert('خطا', 'لطفا ابتدا وارد شوید');
      return;
    }

    if (!data.name.trim() && !data.mobile.trim()) {
      Alert.alert('خطا', 'لطفا حداقل نام یا شماره موبایل را وارد کنید');
      return;
    }

    // For NEW contacts only: Check for duplicates
    if (!selectedNote && isDuplicateContact(data.name, data.mobile)) {
      Alert.alert('خطا', 'مخاطبی با این نام یا شماره موبایل از قبل وجود دارد');
      return;
    }

    // For EDITING: Check for duplicates but exclude the current contact
    if (selectedNote && isDuplicateContact(data.name, data.mobile, selectedNote.id)) {
      Alert.alert('خطا', 'مخاطبی با این نام یا شماره موبایل از قبل وجود دارد');
      return;
    }

    try {
      const contactData = {
        ...data,
        date: new Date().toLocaleDateString('fa-IR'),
        time: new Date().toLocaleTimeString('fa-IR'),
        category: data.category || activeCategory,
      };

      // If editing existing contact
      if (selectedNote) {
        await handleUpdateNote(contactData);
        return;
      }

      // If adding new contact
      setNewContactData(contactData);
      setShowSavePhoneModal(true);
      
    } catch (error) {
      console.error('Error preparing contact:', error);
      Alert.alert('خطا', 'آماده‌سازی مخاطب با مشکل مواجه شد');
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

  const updateContactInAPI = async (contactId, contactData) => {
    try {
      console.log('Updating contact in API:', contactId);
      const response = await ApiService.updateContact(contactId, contactData);
      
      let updatedContact;
      if (response.data && response.data.id) {
        updatedContact = response.data;
      } else if (response.data && response.data.data && response.data.data.id) {
        updatedContact = response.data.data;
      } else {
        updatedContact = { ...contactData, id: contactId };
      }
      
      setNotes(prev => prev.map(note => 
        note.id === contactId ? updatedContact : note
      ));
      
      return true;
    } catch (error) {
      console.error('Error updating contact in API:', error);
      Alert.alert('خطا', 'بروزرسانی مخاطب با مشکل مواجه شد');
      return false;
    }
  };

  // Add this function to request contacts permission
const requestContactsPermission = async () => {
  try {
    console.log('Requesting contacts permission...');
    const permission = await Contacts.requestPermission();
    
    if (permission === 'authorized') {
      console.log('Contacts permission granted');
      return true;
    } else if (permission === 'denied') {
      console.log('Contacts permission denied');
      Alert.alert(
        'مجوز دسترسی به مخاطبین',
        'برای ذخیره مخاطبین در گوشی، نیاز به مجوز دسترسی دارید. لطفاً از طریق تنظیمات برنامه، مجوز دسترسی به مخاطبین را فعال کنید.',
        [
          { text: 'بعداً', style: 'cancel' },
          { 
            text: 'تنظیمات', 
            onPress: () => Linking.openSettings() 
          }
        ]
      );
      return false;
    } else {
      console.log('Contacts permission not granted');
      return false;
    }
  } catch (error) {
    console.error('Error requesting contacts permission:', error);
    Alert.alert('خطا', 'درخواست مجوز دسترسی با مشکل مواجه شد');
    return false;
  }
};

  // Improved phone contact saving with better error handling
  const saveToPhoneContacts = async (contact) => {
    try {
      // Check if we have at least one phone number
      if (!contact.mobile && !contact.phone) {
        Alert.alert('خطا', 'شماره تلفنی برای ذخیره وجود ندارد');
        return false;
      }

      // Request permission
      const permission = await Contacts.requestPermission();
      
      if (permission === 'authorized') {
        const newContact = {
          givenName: contact.name || 'مخاطب جدید',
          familyName: '', // Optional: you can add family name if needed
          phoneNumbers: []
        };

        // Add mobile number if exists
        if (contact.mobile) {
          newContact.phoneNumbers.push({
            label: 'mobile',
            number: contact.mobile.replace(/\s/g, '') // Remove spaces from number
          });
        }

        // Add phone number if exists
        if (contact.phone) {
          newContact.phoneNumbers.push({
            label: 'home',
            number: contact.phone.replace(/\s/g, '') // Remove spaces from number
          });
        }

        // Add note/description if exists
        if (contact.description) {
          newContact.note = contact.description;
        }

        // Save contact to phone
        await Contacts.addContact(newContact);
        
        Alert.alert('موفقیت', 'مخاطب با موفقیت در گوشی ذخیره شد');
        return true;
      } else if (permission === 'denied') {
        // Handle denied permission with better guidance
        Alert.alert(
          'مجوز دسترسی', 
          'برای ذخیره مخاطب در گوشی، نیاز به مجوز دسترسی به مخاطبین دارید. لطفاً از طریق تنظیمات برنامه، مجوز دسترسی را فعال کنید.',
          [
            { text: 'بعداً', style: 'cancel' },
            { 
              text: 'تنظیمات', 
              onPress: () => Linking.openSettings() 
            }
          ]
        );
        return false;
      } else {
        // User didn't grant permission
        Alert.alert('مجوز نیاز است', 'ذخیره مخاطب در گوشی نیاز به مجوز دارد');
        return false;
      }
    } catch (error) {
      console.error('Error saving to phone contacts:', error);
      
      // More specific error messages
      if (error.message?.includes('permission')) {
        Alert.alert('خطای دسترسی', 'مجوز دسترسی به مخاطبین داده نشده است');
      } else if (error.message?.includes('exists')) {
        Alert.alert('تکراری', 'این مخاطب از قبل در گوشی شما وجود دارد');
      } else {
        Alert.alert('خطا', 'ذخیره مخاطب در گوشی با مشکل مواجه شد');
      }
      
      return false;
    }
  };

  const handleSaveToPhone = async () => {
    if (!newContactData) return;

    try {
      // First save to API
      const apiSuccess = await saveContactToAPI(newContactData);
      
      if (apiSuccess) {
        // Then try to save to phone
        const phoneSuccess = await saveToPhoneContacts(newContactData);
        
        if (!phoneSuccess) {
          // If phone save fails, still show success for API save
          Alert.alert('موفقیت', 'مخاطب در آجر ذخیره شد اما در گوشی ذخیره نشد');
        }
      }
      
    } catch (error) {
      console.error('Error in save process:', error);
      Alert.alert('خطا', 'ذخیره مخاطب با مشکل مواجه شد');
    } finally {
      setShowSavePhoneModal(false);
      setNewContactData(null);
      setShowAddModal(false);
    }
  };

  const handleSkipSaveToPhone = async () => {
    if (!newContactData) return;

    try {
      // Only save to API, not to phone
      await saveContactToAPI(newContactData);
      Alert.alert('موفقیت', 'مخاطب با موفقیت در آجر ذخیره شد');
    } catch (error) {
      console.error('Error saving to API:', error);
      Alert.alert('خطا', 'ذخیره مخاطب با مشکل مواجه شد');
    } finally {
      setShowSavePhoneModal(false);
      setNewContactData(null);
      setShowAddModal(false);
    }
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
    if (!selectedNote) return;

    if (!data.name.trim() && !data.mobile.trim()) {
      Alert.alert('خطا', 'لطفا حداقل نام یا شماره موبایل را وارد کنید');
      return;
    }

    try {
      const updatedData = {
        ...data,
        date: new Date().toLocaleDateString('fa-IR'),
        time: new Date().toLocaleTimeString('fa-IR'),
      };

      await updateContactInAPI(selectedNote.id, updatedData);
      
      setSelectedNote(null);
      setShowAddModal(false);
      Alert.alert('موفقیت', 'مخاطب با موفقیت بروزرسانی شد');
      
    } catch (error) {
      console.error('Error updating contact:', error);
      Alert.alert('خطا', 'بروزرسانی مخاطب با مشکل مواجه شد');
    }
  };

  const callNumber = (number) => {
    if (!number) return;

   
    
   
    const url = `tel:${number}`;

    const phoneNumber = `tel:${number}`;
        Linking.openURL(phoneNumber).then(supported => {
        if (!supported) {
          Alert.alert('خطا', 'امکان برقراری تماس از طریق این دستگاه وجود ندارد');
        } else {
          return Linking.openURL(url);
        }
      })
      .catch(err => console.error('An error occurred', err));

      return;
    
    // Linking.canOpenURL(url)
    //   .then(supported => {
    //     if (!supported) {
    //       Alert.alert('خطا', 'امکان برقراری تماس از طریق این دستگاه وجود ندارد');
    //     } else {
    //       return Linking.openURL(url);
    //     }
    //   })
    //   .catch(err => console.error('An error occurred', err));
  };

  const handleViewDetails = (contact) => {
    setSelectedContact(contact);
    setShowContactModal(true);
  };

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
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
        onPress={handleAddButtonPress}  // Use the new function here
        disabled={!userToken}
      >
        <Text style={styles.fabIcon}>＋</Text>
      </TouchableOpacity>

      {/* Dynamic Contact Form Modal */}
      {/* <DynamicContactForm
        visible={showAddModal}
        onClose={() => {
          setSelectedNote(null); // Clear selection when closing
          setShowAddModal(false);
        }}
        onSave={handleAddNote}
        isEditing={!!selectedNote}
        initialData={selectedNote} // Will be null for new contacts
        categories={categories.filter(cat => cat.id !== 'همه')}
      /> */}


      <DynamicContactForm
        visible={showAddModal}
        onClose={() => {
          setSelectedNote(null);
          setShowAddModal(false);
        }}
        onSave={handleAddNote}
        isEditing={!!selectedNote}
        initialData={selectedNote} // This will be null for new contacts
        categories={categories.filter(cat => cat.id !== 'همه')}
        key={selectedNote ? `edit-${selectedNote.id}` : 'add-new'} // Add this line to force re-render
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

      {/* Save to Phone Modal - Only show for new contacts */}
      <SaveToPhoneModal
        visible={showSavePhoneModal && !selectedNote}
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