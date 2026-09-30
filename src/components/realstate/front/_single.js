import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  Dimensions,
  Text,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Spinner from 'react-native-spinkit';
import Grid from 'react-native-grid-component';
import Geolocation from 'react-native-geolocation-service';
import WorkerCard from '../../cards/WorkerCard';
import RealEstateCard from '../../cards/RealEstateCard';
import FooterContact from '../../parts/FooterContact';
import CustomHeader from '../../parts/CustomHeader';
import AgentErrorModal from '../parts/AgentErrorModal';

const { width } = Dimensions.get('window');

const Single = ({ route, navigation }) => {
  const { id } = route.params;

  const [refreshing, set_refreshing] = useState(false);
  const [data, set_data] = useState([]);
  const [workers, set_workers] = useState([]);
  const [realstate, set_realstate] = useState({});
  const [subcategories, set_subcategories] = useState([]);
  const [selectedcat, set_selectedcat] = useState('all');
  const [isLoaded, set_isLoaded] = useState(true);
  const [nopost, set_nopost] = useState(false);
  const [loading, set_loading] = useState(true);
  const [userLat, set_userLat] = useState(null);
  const [userLong, set_userLong] = useState(null);
  const [errorModalVisible, setErrorModalVisible] = useState(false);

  // Request location permission (Android only)
  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn('Permission error:', err);
        return false;
      }
    }
    return true; // iOS handles via Info.plist + Geolocation.requestAuthorization if needed
  };

  // Get current position with fallback
  const getCurrentLocation = async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      console.log('Location permission denied');
      return null;
    }

    return new Promise((resolve) => {
      Geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log('Location obtained:', latitude, longitude);
          resolve({ lat: latitude, long: longitude });
        },
        (error) => {
          console.log('Geolocation error (continuing without location):', error.message);
          resolve(null); // Continue without location
        },
        { enableHighAccuracy: false, timeout: 15000, maximumAge: 10000 }
      );
    });
  };

  // Main data loader
  const loadData = async () => {
    set_loading(true);
    set_isLoaded(true);

    const location = await getCurrentLocation();

    const params = {
      title: 'title',
      realstate_id: id,
      collect: 'all',
      selectedcat: selectedcat === 'all' ? '' : selectedcat,
    };

    // Only add lat/long if available
    if (location) {
      params.lat = location.lat;
      params.long = location.long;
      set_userLat(location.lat);
      set_userLong(location.long);
    }

    try {
      const response = await axios.get('https://api.ajur.app/api/realstate-front-workers', { params });

      const sortedWorkers = (response.data.workers || []).sort((a, b) => {
        return new Date(b.created_at) - new Date(a.created_at);
      });

      set_workers(sortedWorkers);
      set_data(sortedWorkers);
      set_realstate(response.data.realstate || {});
      set_subcategories(response.data.subcategories || []);

      set_nopost(sortedWorkers.length === 0);
    } catch (error) {
      console.error('API Error:', error);
      set_nopost(true);
    } finally {
      set_isLoaded(false);
      set_loading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter workers when category changes
  useEffect(() => {
    if (!workers.length) return;

    set_isLoaded(true);

    const filtered = selectedcat === 'all'
      ? workers
      : workers.filter(worker => worker.category_id == selectedcat);

    set_data(filtered);
    set_isLoaded(false);
  }, [selectedcat, workers]);

  const onPressingSingleCat = (cat) => {
    set_selectedcat(cat.id || 'all');
  };

  const renderRealstateHeader = () => (
    <View key={realstate.id}>
      <RealEstateCard realstate={realstate} />
      <View style={styles.scrollViewDescriptionWrapper}>
        <Text style={styles.scrollViewAddDescription}>
          {realstate.description || ''}
        </Text>
      </View>
    </View>
  );

  const renderItem = (item, i) => <WorkerCard key={i} data={item} />;

  const renderAllButton = () => (
    <TouchableOpacity onPress={() => onPressingSingleCat({ id: 'all' })}>
      <Text style={[
        styles.categoryButton,
        selectedcat === 'all' && styles.selectedCategoryButton
      ]}>
        ({workers.length}) همه
      </Text>
    </TouchableOpacity>
  );

  const renderCategories = () => subcategories.map(cat => (
    <TouchableOpacity key={cat.id} onPress={() => onPressingSingleCat(cat)}>
      <Text style={[
        styles.categoryButton,
        selectedcat == cat.id && styles.selectedCategoryButton
      ]}>
        {cat.name} ({cat.counts})
      </Text>
    </TouchableOpacity>
  ));

  const renderCategorySliders = () => {
    if (nopost) {
      return (
        <View style={styles.noPostContainer}>
          <ImageBackground
            source={require('../assets/images/low-poly-1.png')}
            style={styles.noPostImage}
            resizeMode="contain"
          />
          <Text style={styles.noPostText}>
            آگهی آنلاینی برای این مشاور املاک وجود ندارد ، لطفا با شماره های موجود تماس بگیرید
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.categoryScrollContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {renderAllButton()}
          {renderCategories()}
        </ScrollView>
      </View>
    );
  };

  const renderGrid = () => {
    if (isLoaded) {
      return (
        <View style={styles.spinnerView}>
          <Spinner isVisible={true} size={50} type="Circle" color="orange" />
        </View>
      );
    }

    return (
      <Grid
        style={styles.list}
        renderItem={renderItem}
        data={data}
        itemsPerRow={1}
        itemHasChanged={(d1, d2) => d1.id !== d2.id}
      />
    );
  };

  if (loading) {
    return (
      <View style={styles.spinnerView}>
        <Spinner isVisible={true} size={60} type="Circle" color="#A91b13" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView>
        <CustomHeader title={`${realstate.name || ''} ${realstate.family || ''}`} />
        {renderRealstateHeader()}
        {renderCategorySliders()}
        {renderGrid()}
      </ScrollView>

      <View style={styles.FooterWrapper}>
        <FooterContact realstate={realstate} />
      </View>

      <AgentErrorModal
        visible={errorModalVisible}
        onGoBack={() => navigation.goBack()}
        onRefresh={() => {
          setErrorModalVisible(false);
          loadData();
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  list: {
    flex: 1,
    marginBottom: 100,
  },
  spinnerView: {
    flex: 1,
    height: 430,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryScrollContainer: {
    height: 70,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  categoryButton: {
    margin: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: 'orange',
    borderRadius: 8,
    backgroundColor: 'white',
    textAlign: 'center',
    fontSize: 14,
  },
  selectedCategoryButton: {
    backgroundColor: 'orange',
    color: 'white',
  },
  noPostContainer: {
    alignItems: 'center',
    padding: 30,
    marginTop: 20,
  },
  noPostImage: {
    height: 200,
    width: 200,
  },
  noPostText: {
    fontFamily: 'IRAN Sans',
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
    fontSize: 16,
    lineHeight: 24,
  },
  scrollViewDescriptionWrapper: {
    padding: 15,
    backgroundColor: '#444',
  },
  scrollViewAddDescription: {
    color: '#f4f4f4',
    fontFamily: 'IRAN Sans',
    fontSize: 14,
    textAlign: 'right',
  },
  FooterWrapper: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
});

export default Single;