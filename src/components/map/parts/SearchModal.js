import React from 'react';
import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import axios from 'axios';

const SearchModal = ({visible, search, search_places, onChangeInput, onPlacePress}) => {
  if (!visible) return null;

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <ScrollView style={{marginTop: 50}}>
        {search_places.map((place, index) => (
          <TouchableOpacity key={place.id} onPress={() => onPlacePress(place)} style={{padding: 10, borderBottomWidth: 1, borderColor: '#ddd'}}>
            <Text>{place.title} {place.city} ({place.province})</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

SearchModal.debouncedSearch = async (text, set_search_places) => {
  if (!text || text.length < 2) {
    set_search_places([]);
    return;
  }
  try {
    const res = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: { q: text + ' ایران', countrycodes: 'ir', format: 'json', limit: 5 },
      headers: { 'User-Agent': 'AjurApp/1.0 (+https://ajur.app)' },
    });
    const processed = res.data.map(item => ({
      id: item.place_id,
      title: item.display_name.split(',')[0],
      city: item.address.city || item.address.town || '',
      province: item.address.province || item.address.state || '',
      location: {x: parseFloat(item.lat), y: parseFloat(item.lon)},
    }));
    set_search_places(processed);
  } catch (err) {
    console.error('Search error:', err);
  }
};

SearchModal.handleChangeInput = (text, set_search, set_search_places) => {
  set_search(text);
  SearchModal.debouncedSearch(text, set_search_places);
};

SearchModal.handleSingleLocationClicked = ({place, mapRef, set_search, setShowFooter}) => {
  set_search(place.title);
  setShowFooter(false);
  mapRef.current?.animateToRegion({
    latitude: Number(place.location.y),
    longitude: Number(place.location.x),
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  }, 500);
};

export default SearchModal;
