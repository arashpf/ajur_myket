import axios from 'axios';
import { Platform } from 'react-native';

const API_TIMEOUT = 15000; // 15 seconds timeout

export const CallAiParserIndex = async (query,cityid) => {


 
  const source = axios.CancelToken.source();
  const timer = setTimeout(() => {
    source.cancel('Request timeout');
  }, API_TIMEOUT);

  try {
    const startTime = Date.now();
    const response = await axios({
      method: 'post',
      url: 'http://search.ajur.app/api/search-intent', // Updated endpoint
      data: { query,cityid }, // Simplified payload structure
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

    // Transform the response to match your existing format
    return {
      success: true,
      data: response.data.results || [], // Map to your expected properties array
      responseTime: responseTime,
      metadata: { // Include additional data if needed
        filters: response.data.filters,
        suggestions: response.data.suggestions
      }
    };

  } catch (error) {
    clearTimeout(timer);
    
    let errorMessage = 'خطای ناشناخته';
    if (axios.isCancel(error)) {
      errorMessage = 'زمان درخواست به پایان رسید';
    } else if (!error.response) {
      errorMessage = 'اتصال اینترنت خود را بررسی کنید';
    } else if (error.response.status >= 500) {
      errorMessage = 'مشکل از سرور است. لطفاً بعداً تلاش کنید';
    } else if (error.response.status === 404) {
      errorMessage = 'آدرس سرویس یافت نشد';
    }

    console.error('Search API Error:', {
      query,
      error: error.message,
      status: error.response?.status,
      time: new Date().toISOString(),
      platform: Platform.OS
    });

    return {
      success: false,
      error: errorMessage,
      isTimeout: axios.isCancel(error)
    };
  }
};