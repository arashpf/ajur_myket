import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  TextInput,
  FlatList,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import {CityContext} from '../CityContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CitySelection = ({navigation}) => {
  const {updateCity, currentCity} = useContext(CityContext);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchCities();
  }, [searchQuery]);

  const fetchCities = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        'https://api.ajur.app/api/search-cities',
        {params: {title: searchQuery || ''}, timeout: 5000},
      );
      setCities(response.data?.items || getDefaultCities());
    } catch (error) {
      console.error('Error fetching cities:', error);
      setCities(getDefaultCities());
    } finally {
      setLoading(false);
    }
  };

  const getDefaultCities = () => [
    {id: 1, title: 'تهران'},
    {id: 2, title: 'رباط کریم'},
    {id: 3, title: 'کرج'},
    {id: 4, title: 'اصفهان'},
    {id: 5, title: 'مشهد'},
  ];

  const handleCitySelection = async city => {
    const success = await updateCity(city);
    if (success) {
      // Reset to Base (MainDashboard) — remove CitySelection and Entro from stack
      navigation.reset({
        index: 0,
        routes: [{name: 'Base'}],
      });
    } else {
      Alert.alert('خطا', 'ذخیره شهر با مشکل مواجه شد');
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo / Branding */}
      <View style={styles.brandContainer}>
        <Text style={styles.logoText}>آجر</Text>
        <Text style={styles.tagline}>فراتر از یک آگهی املاک</Text>
      </View>

      <View style={styles.header}>
        <Text style={styles.title}>انتخاب شهر</Text>
        <Text style={styles.subtitle}>
          برای دیدن آگهی‌های املاک شهر خود، لطفاً شهر موردنظرتان را انتخاب کنید
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="جستجوی شهر..."
          placeholderTextColor="#94a3b8"
          value={searchQuery}
          onChangeText={setSearchQuery}
          returnKeyType="search"
        />
        <Icon name="search" size={20} color="#64748b" />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#a92b31" style={styles.loader} />
      ) : (
        <FlatList
          data={cities}
          keyExtractor={item => item.id.toString()}
          renderItem={({item}) => (
            <Pressable
              style={styles.cityItem}
              onPress={() => handleCitySelection(item)}>
              <Text style={styles.cityItemText}>{item.title}</Text>
              {currentCity?.id === item.id ? (
                <Icon name="checkmark" size={20} color="#a92b31" />
              ) : (
                <Icon name="chevron-back" size={20} color="#a92b31" />
              )}
            </Pressable>
          )}
          ListEmptyComponent={
            <Text style={styles.noResults}>شهری یافت نشد</Text>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  brandContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 8,
  },
  logoText: {
    fontSize: 40,
    color: '#a92b31',
    fontFamily: 'iransans',
    fontWeight: 'bold',
  },
  tagline: {
    fontSize: 13,
    color: '#64748b',
    fontFamily: 'iransans',
    marginTop: 4,
  },
  header: {
    marginBottom: 24,
    marginTop: 24,
  },
  title: {
    fontSize: 22,
    color: '#0f172a',
    fontFamily: 'iransans',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    color: '#64748b',
    fontFamily: 'iransans',
    textAlign: 'center',
    lineHeight: 22,
  },
  searchContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 15,
    color: '#0f172a',
    textAlign: 'right',
    fontFamily: 'iransans',
  },
  loader: {
    marginTop: 40,
  },
  cityItem: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cityItemText: {
    fontSize: 16,
    color: '#334155',
    fontFamily: 'iransans',
  },
  noResults: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#64748b',
    fontFamily: 'iransans',
  },
});

export default CitySelection;
