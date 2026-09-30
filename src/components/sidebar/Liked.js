import React, {useState, useEffect} from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Text,
  StatusBar,
  FlatList,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Spinner from 'react-native-spinkit';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import WorkerCard from '../cards/WorkerCard';

const Liked = (props) => {
  const navigation = useNavigation();
  
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState([]);
  const [isLoaded, setIsLoaded] = useState(true);
  const [noPost, setNoPost] = useState(false);

  const searchOnFiles = () => {
    navigation.navigate('جستجو');
  };

  const goBack = () => {
    navigation.goBack();
  };

  useFocusEffect(
    useCallback(() => {
      setData([]);
      setIsLoaded(true);

      AsyncStorage.getItem('favorited').then((existingProducts) => {
        let newProduct = JSON.parse(existingProducts) || [];
        
        axios({
          method: 'get',
          url: 'https://api.ajur.app/api/history-workers',
          params: { workers_holder: newProduct },
        })
        .then(function (response) {
          setData(response.data);
          setIsLoaded(false); 
          setNoPost(response.data.length === 0);
        })
        .catch(function (error) {
          console.error('Error fetching data:', error);
          setIsLoaded(false);
          setNoPost(true);
        });
      });

      return () => {};
    }, [])
  );

  const renderItem = ({ item }) => (
    <WorkerCard data={item} />
  );

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Image
        style={styles.emptyImage}
        source={require('../assets/half-heart.png')}
      />
      <Text style={styles.emptyTitle}>شما هنوز ملکی را نپسندیده اید</Text>
      <Text style={styles.emptyText}>
        با استفاده از آیکون قلب در فایل ها میتوانید آنها را به این
        صفحه اضافه کنید ، تا از آخرین تغییرات قیمت ، تغییر وضعیت و
        فایل های مشابه آگاه شوید
      </Text>
      <TouchableOpacity 
        style={styles.searchButton}
        onPress={searchOnFiles}
      >
        <Text style={styles.buttonText}>جستجو در فایل ها</Text>
      </TouchableOpacity>
    </View>
  );

  if (isLoaded) {
    return (
      <View style={styles.spinnerView}>
        <Spinner isVisible={true} size={30} type='Circle' color='#b92a31'/>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#b92a31" />
      
      {/* ============ HEADER ============ */}
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <Icon name="chevron-back" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>پسندها</Text>
        <View style={styles.headerRight} />
      </View>

      {noPost ? (
        <ScrollView 
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          {renderEmptyComponent()}
        </ScrollView>
      ) : (
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            // Refresh logic here
            AsyncStorage.getItem('favorited').then((existingProducts) => {
              let newProduct = JSON.parse(existingProducts) || [];
              axios({
                method: 'get',
                url: 'https://api.ajur.app/api/history-workers',
                params: { workers_holder: newProduct },
              })
              .then(function (response) {
                setData(response.data);
                setNoPost(response.data.length === 0);
                setRefreshing(false);
              })
              .catch(function (error) {
                console.error('Error fetching data:', error);
                setRefreshing(false);
              });
            });
          }}
          ListEmptyComponent={renderEmptyComponent}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flexGrow: 1,
    backgroundColor: '#f5f5f5',
  },
  list: {
    paddingBottom: 20,
    backgroundColor: '#f5f5f5',
  },
  spinnerView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  // ============ Header Styles ============
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  backButton: {
    padding: 4,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'iransans',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    width: 44,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    marginTop: 20,
    backgroundColor: '#f5f5f5',
  },
  emptyImage: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  emptyTitle: {
    fontFamily: 'yekan',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  emptyText: {
    fontFamily: 'iransans',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 24,
    color: '#666',
    marginBottom: 20,
  },
  searchButton: {
    backgroundColor: '#b92a31',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontFamily: 'iransans',
    fontSize: 16,
  },
});

export default Liked;