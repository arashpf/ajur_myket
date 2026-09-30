import React, {forwardRef} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const MapHeader = forwardRef((props, ref) => {
  const {
    isSearchFocused,
    search,
    onBackButtonPress,
    onStartSearch,
    onInputChange,
    onToggleFilter,
    onCloseSearchPress,
    inputRef,
    searchInputProps,
    style,
  } = props;

  const renderSearchField = () => {
    
    if (isSearchFocused) {
      return (
        <>
          <Icon
            name="arrow-back-outline"
            size={30}
            color="#999"
            onPress={onBackButtonPress}
            style={styles.searchIcon}
          />
          <TextInput
            ref={inputRef}
            style={styles.searchInput}
            placeholder="جستجو شهر و منطقه"
            placeholderTextColor="#999"
            value={search}
            onChangeText={onInputChange}
            {...searchInputProps}
          />
        </>
      );
    }

    return (
      <TouchableOpacity
        style={styles.searchPlaceholder}
        onPress={onStartSearch}>
        <Text style={styles.placeholderText}>
          {search || 'جستجو شهر ، منطقه'}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View ref={ref} style={[styles.header, style]}>
      <View
        style={[
          styles.searchContainer,
          isSearchFocused && styles.searchContainerFocused,
        ]}>
        {!isSearchFocused && (
          <Icon
            name="search-outline"
            onPress={onStartSearch}
            size={20}
            color="#999"
            style={styles.searchIcon}
          />
        )}
        {renderSearchField()}
      </View>

      {!isSearchFocused ? (
        <TouchableOpacity style={styles.filterButton} onPress={onToggleFilter}>
          <Icon name="options-outline" size={24} color="#333" />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.filterButton} onPress={onCloseSearchPress}>
          <Icon name="close" size={24} color="#333" />
        </TouchableOpacity>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    padding: 10,
    position: 'absolute',
    top: 0,
    width: '100%',
    zIndex: 10,
    backgroundColor: 'white',
  },
  searchContainer: {
    flex: 0.9,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  searchContainerFocused: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: '#333',
    textAlign: 'right',
  },
  searchPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    height: 40,
  },
  placeholderText: {
    color: '#999',
    textAlign: 'right',
  },
  filterButton: {
    flex: 0.1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MapHeader;
