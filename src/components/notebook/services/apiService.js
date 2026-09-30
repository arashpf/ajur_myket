import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

const API_BASE_URL = 'https://api.ajur.app/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Always send token in params
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('id_token');
      if (token) {
        config.params = {
          ...config.params,
          token: token,
        };
      }
    } catch (error) {
      console.error('Error getting token:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.status, error.response?.data);

    if (error.response?.status === 401) {
      AsyncStorage.removeItem('id_token');
      Alert.alert('Error', 'Please log in again');
    } else if (error.response?.status >= 500) {
      Alert.alert('Error', 'A server error occurred');
    } else if (error.code === 'NETWORK_ERROR') {
      Alert.alert('Error', 'No internet connection');
    }

    return Promise.reject(error);
  }
);

class ApiService {
  // Contacts
  static createContact = (contactData) => api.post('/contacts', contactData);
  static getContacts = () => api.get('/contacts');
  static getContactById = (id) => api.get(`/contacts/${id}`);
  static updateContact = (id, contactData) => api.put(`/contacts/${id}`, contactData);
  static deleteContact = (id) => api.post(`/contact-delete/${id}`);
  static searchContacts = (query) => api.get(`/contacts/search/${encodeURIComponent(query)}`);
  static getContactsByCategory = (category) => api.get(`/contacts/category/${encodeURIComponent(category)}`);

  // Test API connection
  static testConnection = () => api.get('/test');
}

export default ApiService;
