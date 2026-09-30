// // services/filterApi.js - ENHANCED version
// import axios from 'axios';
// import { Alert, Platform } from 'react-native';

// const BASE_URL = 'https://api.ajur.app/api';

// export const filterApi = {
//   getFilteredWorkers: async (filters = {}) => {
//     try {
//       // Show detailed alert with ALL filters
//       // Alert.alert('🔍 فیلترهای دریافتی', 
//       //   `تعداد: ${Object.keys(filters).length}\n\n` +
//       //   Object.entries(filters)
//       //     .map(([key, value]) => `• ${key}: ${value}`)
//       //     .join('\n')
//       // );

//       // Remove lat/lng from filters if they exist
//       const cleanFilters = { ...filters };
//       delete cleanFilters.lat;
//       delete cleanFilters.long;
      
//       // Clean other filter keys
//       const finalFilters = {};
//       Object.entries(cleanFilters).forEach(([key, value]) => {
//         if (value !== undefined && value !== null && value !== '') {
//           // IMPORTANT: For Persian keys, ensure no extra spaces
//           const cleanKey = key.trim();
          
//           // DEBUG: Log Persian parameters
//           if (/[\u0600-\u06FF]/.test(cleanKey)) {
//             console.log('🔍 پارامتر فارسی تشخیص داده شد:', {
//               originalKey: key,
//               cleanKey: cleanKey,
//               value: value,
//               hasSpace: cleanKey.includes(' '),
//               hasUnderscore: cleanKey.includes('_'),
//               endsWithMin: cleanKey.endsWith('_min'),
//               endsWithMax: cleanKey.endsWith('_max'),
//               keyLength: cleanKey.length
//             });
//           }
          
//           finalFilters[cleanKey] = value;
//         }
//       });

//       // Show what we're actually sending
//       Alert.alert('📤 فیلترهای نهایی برای ارسال', 
//         `تعداد: ${Object.keys(finalFilters).length}\n\n` +
//         Object.entries(finalFilters)
//           .map(([key, value]) => `• ${key}: ${value}`)
//           .join('\n')
//       );

//       const response = await axios({
//         method: 'get',
//         url: `${BASE_URL}/server-filtered-workers`,
//         timeout: 15000,
//         params: finalFilters,
//         paramsSerializer: function(params) {
//           // Build query string manually to debug
//           const parts = [];
//           Object.keys(params).forEach(key => {
//             const value = params[key];
//             if (value !== undefined && value !== null && value !== '') {
//               const encodedKey = encodeURIComponent(key);
//               const encodedValue = encodeURIComponent(value);
//               parts.push(`${encodedKey}=${encodedValue}`);
              
//               // Debug URL encoding
//               console.log('🔗 بخش URL:', {
//                 key: key,
//                 encodedKey: encodedKey,
//                 value: value,
//                 encodedValue: encodedValue,
//                 part: `${encodedKey}=${encodedValue}`
//               });
//             }
//           });
          
//           const queryString = parts.join('&');
//           console.log('🔗 رشته کوئری کامل:', queryString);
          
//           // Also show the full URL
//           const fullUrl = `${BASE_URL}/server-filtered-workers?${queryString}`;
//           Alert.alert('🔗 URL کامل درخواست', queryString);
          
//           return queryString;
//         },
//         headers: {
//           'Accept': 'application/json',
//           'Content-Type': 'application/json',
//         }
//       });

//       // Show response details
//       Alert.alert('✅ پاسخ سرور', 
//         `وضعیت: ${response.status}\n` +
//         `تعداد آگهی‌ها: ${response.data.workers?.length || 0}\n` +
//         `پیام: ${response.data.message || 'بدون پیام'}\n` +
//         `فیلترهای اعمال شده: ${JSON.stringify(response.data.filters_applied?.json_properties || [])}`
//       );
      
//       return response.data;

//     } catch (error) {
//       console.error('🚨 filterApi Error:', error.message);
      
//       Alert.alert('❌ خطا در ارتباط', 
//         `پیام: ${error.message}\n` +
//         `کد: ${error.response?.status || 'بدون پاسخ'}`
//       );
      
//       return {
//         workers: [],
//         pagination: {
//           current_page: 1,
//           total_pages: 0,
//           total_count: 0,
//           has_next: false,
//           per_page: 10
//         },
//         status: error.response?.status || 500,
//         message: error.message || 'خطای ناشناخته',
//         error: true
//       };
//     }
//   }
// };

// export default filterApi;



// services/filterApi.js - FIXED VERSION
import axios from 'axios';
import { Alert, Platform } from 'react-native';

const BASE_URL = 'https://api.ajur.app/api';

export const filterApi = {
  getFilteredWorkers: async (filters = {}) => {
    try {
      // Show what we're receiving
      // Alert.alert('📤 Filters received', 
      //   Object.entries(filters)
      //     .map(([key, value]) => `${key}: ${value}`)
      //     .join('\n')
      // );

      // Remove lat/lng
      const cleanFilters = { ...filters };
      delete cleanFilters.lat;
      delete cleanFilters.long;
      
      // Fix: Don't manually encode Persian keys - let axios handle it
      const finalFilters = {};
      Object.entries(cleanFilters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          // IMPORTANT: Keep Persian keys as-is, don't encode them here
          finalFilters[key] = value;
        }
      });

      // Show final filters
      console.log('🎯 Final filters to send:', finalFilters);

      // Make request with proper encoding
      const response = await axios({
        method: 'get',
        url: `${BASE_URL}/server-filtered-workers`,
        timeout: 15000,
        params: finalFilters,
        // Let axios handle encoding automatically
        paramsSerializer: function(params) {
          // This is the CORRECT way to serialize
          const parts = [];
          
          Object.keys(params).forEach(key => {
            const value = params[key];
            if (value !== undefined && value !== null && value !== '') {
              // Axios will encode these properly
              parts.push(`${key}=${value}`);
            }
          });
          
          const queryString = parts.join('&');
          console.log('🔗 Generated query string:', queryString);
          
          // Show the actual URL
          const fullUrl = `${BASE_URL}/server-filtered-workers?${queryString}`;
          // Alert.alert('🔗 Full URL being called', fullUrl);
          
          return queryString;
        },
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });

      console.log('✅ API Response:', {
        workers: response.data.workers?.length || 0,
        message: response.data.message
      });
      
      return response.data;

    } catch (error) {
      console.error('🚨 Error:', error.message);
      // Alert.alert('❌ API Error', error.message);
      
      return {
        workers: [],
        pagination: {
          current_page: 1,
          total_pages: 0,
          total_count: 0,
          has_next: false,
          per_page: 10
        },
        status: 500,
        message: error.message,
        error: true
      };
    }
  }
};

export default filterApi;