import React, {useState} from 'react';
import {Modal, View, TouchableOpacity, ScrollView, Text} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import ImageSliderModal from './ImageSliderModal';
import GuideOverlay from './MapGuideOverlay';
import MapErrorModal from './MapErrorModal';
import styles from '../assets/MainMap.styles';

const ModalComponents = ({
  isSearchModalVisible,
  isFilterModalVisible,
  isHintModalVisible,
  showGuide,
  errorModalVisible,
  onCloseSearchModal,
  onCloseFilterModal,
  onCloseHintModal,
  onCloseGuide,
  onCloseErrorModal,
  onRefreshData,
  renderFilterSectionPages,
  renderTimeFrameFilter,
  renderFiltersBasedOnCategorySelected,
  renderFilterActionButtons
}) => {
  const [showMoreFilters, setShowMoreFilters] = useState(false);

  const toggleMoreFilters = () => {
    setShowMoreFilters(!showMoreFilters);
  };

  return (
    <>
      {/* Filter Modal */}
      <Modal
        visible={isFilterModalVisible}
        transparent={false}
        animationType="slide"
        onRequestClose={onCloseFilterModal}>
        <View style={styles.fullScreenFilterModalContainer}>
          <View style={styles.filterModalContent}>
            {/* Filter Header */}
            {/* <View style={styles.filterHeader}>
              <Text style={styles.filterTitle}>فیلترهای پیشرفته</Text>
              <TouchableOpacity onPress={onCloseFilterModal} style={styles.closeFilterButton}>
                <Icon name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View> */}

            {/* Scrollable Filter Content */}
            <ScrollView 
              style={styles.filterScrollView}
              contentContainerStyle={styles.filterScrollContent}
              showsVerticalScrollIndicator={true}>
              {renderFilterSectionPages && renderFilterSectionPages()}
              {renderTimeFrameFilter && renderTimeFrameFilter()}
              
              {/* More Filters Toggle */}
              <TouchableOpacity
                style={[
                  styles.moreFilter,
                  showMoreFilters && styles.moreFilterActive,
                ]}
                onPress={toggleMoreFilters}>
                <View style={styles.moteFilterButtonWrapper}>
                  <Text
                    style={[
                      styles.moreFilterText,
                      showMoreFilters && styles.moreFilterTextActive,
                    ]}>
                    {showMoreFilters ? 'نمایش فیلترهای کمتر' : 'فیلتر های بیشتر'}
                  </Text>
                  <Icon
                    name={showMoreFilters ? 'chevron-up' : 'chevron-down'}
                    size={16}
                    color={showMoreFilters ? '#d96e6eff' : '#b92a31'}
                    style={styles.arrow}
                  />
                </View>
              </TouchableOpacity>

              {/* More Filters Content */}
              {showMoreFilters && (
                <View style={styles.moreFiltersContent}>
                  {renderFiltersBasedOnCategorySelected && renderFiltersBasedOnCategorySelected()}
                </View>
              )}
            </ScrollView>

            {/* Fixed Action Buttons - OUTSIDE ScrollView */}
            <View style={styles.filterActionsContainer}>
              {renderFilterActionButtons && renderFilterActionButtons()}
            </View>
          </View>
        </View>
      </Modal>

      {/* Other Modals */}
      <ImageSliderModal
        visible={isHintModalVisible}
        onClose={onCloseHintModal}
      />

      <GuideOverlay
        visible={showGuide}
        onComplete={onCloseGuide}
      />

      <MapErrorModal
        visible={errorModalVisible}
        onRefresh={onRefreshData}
        onClose={onCloseErrorModal}
      />
    </>
  );
};

export default ModalComponents;