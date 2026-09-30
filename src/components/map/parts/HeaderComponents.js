import React from 'react';
import {View, TouchableOpacity, ActivityIndicator, Text, ScrollView} from 'react-native';
import MapHeader from './MapHeader';
import SearchBars from '../../search/SearchBars';
import Icon from 'react-native-vector-icons/Ionicons';
import styles from '../assets/MainMap.styles';

const HeaderComponents = ({
  loading,
  visibleMarkers,
  isSearchFocused,
  search,
  onBackButtonPress,
  onStartSearch,
  onInputChange,
  onCloseSearchPress,
  onToggleFilter,
  inputRef,
  renderHeaderFilters,
  renderMapLoader
}) => {
  return (
    <>
      {/* Main Header */}
      {/* <MapHeader
        isSearchFocused={isSearchFocused}
        search={search}
        onBackButtonPress={onBackButtonPress}
        onStartSearch={onStartSearch}
        onInputChange={onInputChange}
        onCloseSearchPress={onCloseSearchPress}
        onToggleFilter={onToggleFilter}
        inputRef={inputRef}
      /> */}

      {/* Search Bars */}
      <SearchBars />

      {/* Map Loader */}
      {renderMapLoader && renderMapLoader()}

      {/* Header Filters */}
      {renderHeaderFilters && renderHeaderFilters()}

      {/* Visible Marker Count */}
      <TouchableOpacity style={styles.visisbleMarkerButton}>
        <Text style={styles.visisbleMarkerText}>
          {loading ? (
            <>
              در حال بارگذاری : <ActivityIndicator size={20} color="white" />
            </>
          ) : (
            `قابل مشاهده : ${visibleMarkers?.length || 0}`
          )}
        </Text>
      </TouchableOpacity>
    </>
  );
};

export default HeaderComponents;