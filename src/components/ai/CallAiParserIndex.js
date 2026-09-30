import axios from 'axios';
import { Platform } from 'react-native';

const API_TIMEOUT = 15000; // 15 seconds timeout
export const CallAiParserIndex = async (query, { cityId }) => {
  const source = axios.CancelToken.source();
  const timer = setTimeout(() => {
    source.cancel('Request timeout');
  }, API_TIMEOUT);

  try {
    // First get the search intent (category + neighborhoods)
    const { category, neighborhoods } = await searchProperties(query, cityId);
    
    // Then make the main search request
    const startTime = Date.now();
    const response = await axios({
      method: 'post',
      url: 'http://api.ajur.app/api/search-intent', // Different endpoint for actual results
      data: { 
        query,
        cityid: cityId,
        category // Pass the identified category
      },
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Platform': Platform.OS,
        'X-App-Version': '1.0.0'
      },
      cancelToken: source.token,
      timeout: API_TIMEOUT
    });

    clearTimeout(timer);
    const responseTime = Date.now() - startTime;

    return {
      success: true,
      data: response.data.results || [],
      metadata: {
        category,
        neighborhoods,
        filters: response.data.filters || {},
        responseTime
      }
    };

  } catch (error) {
    clearTimeout(timer);
    
    // Fallback to just search intent if main search fails
    if (axios.isCancel(error)) {
      const { category, neighborhoods } = await searchProperties(query, cityId);
      return {
        success: false,
        error: 'Request timeout',
        metadata: { category, neighborhoods },
        isTimeout: true
      };
    }

    console.error('Search error:', error);
    return {
      success: false,
      error: error.response?.data?.error || 'Connection error',
      metadata: {
        category: 'general',
        neighborhoods: []
      }
    };
  }
};

// Your existing searchProperties function
const searchProperties = async (query, cityId) => {
  try {
    const response = await axios.post('http://search.ajur.app/api/search-intent', {
      query,
      cityid: cityId
    });

    return {
      category: response.data.category,
      neighborhoods: response.data.neighborhoods
    };
    
  } catch (error) {
    console.error('Search intent error:', error);
    return {
      category: 'general',
      neighborhoods: []
    };
  }
};