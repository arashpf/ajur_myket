import { useState, useCallback } from 'react';
import { debounce } from 'lodash';
import axios from 'axios';

const useMapSearch = () => {
  const [search, set_search] = useState('');
  const [search_places, set_search_places] = useState([]);
  const [loading_search_place, set_loading_search_place] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isSearchModalVisible, setIsSearchModalVisible] = useState(false);

  const debouncedSearch = useCallback(
    debounce(text => {
      set_search_places([]);
      const query = text.trim();

      if (query.length < 2) {
        set_search_places([]);
        set_loading_search_place(false);
        return;
      }
      
      set_loading_search_place(true);
      axios
        .get('https://nominatim.openstreetmap.org/search', {
          params: {
            q: query + ' ایران',
            countrycodes: 'ir',
            format: 'json',
            addressdetails: 1,
            limit: 5,
            'accept-language': 'fa',
          },
          headers: {
            'User-Agent': 'AjurApp/1.0 (+https://ajur.app)',
          },
        })
        .then(res => {
          const processed = res.data.map(item => {
            const address = item.address || {};
            const province = address.province || address.state || '';
            const city = address.city || address.town || '';
            const neighbourhood = address.neighbourhood || address.district || address.residential || '';

            return {
              id: item.place_id,
              title: item.display_name.split(',')[0],
              neighbourhood: neighbourhood,
              city: city,
              province: province,
              location: {
                y: parseFloat(item.lat),
                x: parseFloat(item.lon),
              },
            };
          });

          set_search_places(processed);
        })
        .catch(err => {
          console.error('Search error:', err);
        })
        .finally(() => set_loading_search_place(false));
    }, 1000),
    [],
  );

  const handleChangeInput = useCallback((text) => {
    set_search(text);

    if (text.length < 2) {
      set_search_places([]);
      return;
    }

    debouncedSearch(text);
  }, [debouncedSearch]);

  const handleStartSearch = useCallback(() => {
    setIsSearchFocused(true);
    setIsSearchModalVisible(true);
  }, []);

  const onBackButtonSerachPressed = useCallback(() => {
    setIsSearchFocused(false);
    setIsSearchModalVisible(false);
  }, []);

  const closeSearchModal = useCallback(() => {
    setIsSearchModalVisible(false);
  }, []);

  const toggleSearchModal = useCallback(() => {
    setIsSearchModalVisible(!isSearchModalVisible);
  }, [isSearchModalVisible]);

  return {
    search,
    search_places,
    loading_search_place,
    isSearchFocused,
    isSearchModalVisible,
    
    set_search,
    set_search_places,
    set_loading_search_place,
    setIsSearchFocused,
    setIsSearchModalVisible,

    handleChangeInput,
    handleStartSearch,
    onBackButtonSerachPressed,
    closeSearchModal,
    toggleSearchModal,
    debouncedSearch
  };
};

export default useMapSearch;