import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import RangeFilters from './RangeFilters';
import { border } from 'native-base/lib/typescript/theme/styled-system';

const MainFilters = ({
  selectedCategory,
  selectedNeighborhoods,
  selectedFeatures,
  rangeFilters,
  sortBy,
  onSectionChange,
  onFeatureToggle,
  onRangeFilterChange,
  onSortChange,
  getSortDisplayText,
  features,
  // NEW: Add props for category fields
  categoryFields = {},
  loadingFields = false,
  onFieldValueChange = () => {},
  fieldValues = {},
}) => {
  // Destructure category fields
  const { normal = [], tick = [], predefine = [] } = categoryFields;

  // Render normal fields as min/max inputs
  const renderNormalFields = () => {
    if (normal.length === 0) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>مشخصات:</Text>
        {normal.map((field) => {

          if (field.special != 1) return null;

          const fieldType = determineFieldType(field);
          
          // Only show number/price fields as min/max
          if (fieldType === 'number' || fieldType === 'price') {
            return renderMinMaxField(field);
          }
          
          // For other field types, use the original render
          const value = fieldValues[field.name] || '';
          const label = field.label || field.name || 'بدون عنوان';
          
          switch (fieldType) {
            case 'text':
              return renderTextField(field, value, label);
            case 'boolean':
              return renderBooleanField(field, value, label);
            default:
              return renderTextField(field, value, label); // Default to text
          }
        })}
      </View>
    );
  };

  // Render min/max field (از تا)
  const renderMinMaxField = (field) => {
    const label = field.label || field.name || 'بدون عنوان';
    const placeholder = getPlaceholder(field);
    const unit = getFieldUnit(field);
    
    // Get min and max values from fieldValues
    const minValue = fieldValues[`${field.name}_min`] || '';
    const maxValue = fieldValues[`${field.name}_max`] || '';
    
    return (
      <View key={field.id || field.name} style={styles.minMaxContainer}>
        <Text style={styles.fieldLabel}>{label}</Text>
        
        <View style={styles.minMaxRow}>

          {/* Max Input */}
          <View style={styles.minMaxInputContainer}>
            {/* <Text style={styles.minMaxLabel}>تا:</Text> */}
            <View style={styles.inputWithUnit}>
              <TextInput
                style={styles.minMaxInput}
                placeholder={" تا "+label}
                value={maxValue}
                onChangeText={(text) => onFieldValueChange(`${field.name}_max`, text)}
                keyboardType="numeric"
                placeholderTextColor="#999"
              />
              {/* {unit && <Text style={styles.unitText}>{unit}</Text>} */}
            </View>
          </View>

          {/* Min Input */}
          <View style={styles.minMaxInputContainer}>
            {/* <Text style={styles.minMaxLabel}>از:</Text> */}
            <View style={styles.inputWithUnit}>
             <TextInput
              style={styles.minMaxInput}
              placeholder={" از "+label}
              value={minValue}
              onChangeText={(text) => onFieldValueChange(`${field.name}_min`, text)}
              keyboardType="numeric"
              placeholderTextColor="#999"
            />
              {/* {unit && <Text style={styles.unitText}>{unit}</Text>} */}
            </View>
          </View>
          
          
        </View>
      </View>
    );
  };

  // Render text input field (unchanged)
  const renderTextField = (field, value, label) => {
    return (
      <View key={field.id || field.name} style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>{label}</Text>
        <TextInput
          style={styles.textInput}
          placeholder={`${label} را وارد کنید`}
          value={value}
          onChangeText={(text) => onFieldValueChange(field.name, text)}
          placeholderTextColor="#999"
        />
      </View>
    );
  };

  // Render boolean (switch) field (unchanged)
  const renderBooleanField = (field, value, label) => {
    const boolValue = value === true || value === 'true' || value === '1';

    return (
      <View key={field.id || field.name} style={styles.booleanField}>
        <Text style={styles.fieldLabel}>{label}</Text>
        <Switch
          value={boolValue}
          onValueChange={(newValue) => onFieldValueChange(field.name, newValue)}
          trackColor={{ false: "#767577", true: "#b92a31" }}
          thumbColor={Platform.OS === 'android' ? "#f4f3f4" : "#f4f3f4"}
        />
      </View>
    );
  };

  // Determine field type function (unchanged)
  const determineFieldType = (field) => {
    if (field.type) {
      return field.type === '1' ? 'number' : 'text';
    }
    
    const value = field.value?.toLowerCase() || '';
    
    if (value.includes('قیمت') || value.includes('price')) {
      return 'price';
    }
    
    if (value.includes('متراژ') || value.includes('area') || value.includes('متر')) {
      return 'number';
    }
    
    if (value.includes('سال') || value.includes('year') || value.includes('age')) {
      return 'number';
    }
    
    if (value.includes('تعداد') || value.includes('count') || value.includes('room')) {
      return 'number';
    }
    
    if (value.includes('آسانسور') || value.includes('پارکینگ') || 
        value.includes('انباری') || value.includes('آب') || 
        value.includes('برق') || value.includes('گاز')) {
      return 'boolean';
    }
    
    return 'text';
  };

  // Get placeholder text for field
  const getPlaceholder = (field) => {
    const name = field.name?.toLowerCase() || '';
    
    if (name.includes('price') || name.includes('قیمت')) {
      return 'مثال: 1000000';
    } else if (name.includes('rent') || name.includes('اجاره')) {
      return 'مثال: 5000000';
    } else if (name.includes('deposit') || name.includes('پول پیش')) {
      return 'مثال: 20000000';
    } else if (name.includes('area') || name.includes('متراژ')) {
      return 'مثال: 120';
    } else if (name.includes('age') || name.includes('سن')) {
      return 'مثال: 5';
    } else if (name.includes('room') || name.includes('اتاق')) {
      return 'مثال: 3';
    } else if (name.includes('floor') || name.includes('طبقه')) {
      return 'مثال: 2';
    }
    return 'مقدار';
  };

  // Get field unit based on field name
  const getFieldUnit = (field) => {
    const name = field.name?.toLowerCase() || '';
    
    if (field.unit) return field.unit;
    if (name.includes('price') || name.includes('قیمت') || 
        name.includes('rent') || name.includes('اجاره') ||
        name.includes('deposit') || name.includes('پول پیش')) {
      return 'تومان';
    }
    if (name.includes('area') || name.includes('متراژ')) return 'متر';
    if (name.includes('age') || name.includes('سن')) return 'سال';
    return null;
  };

  // Rest of your component remains the same...
  // renderFeatures, loading state, etc.

  // Loading state for fields
  const renderLoadingState = () => {
    if (!loadingFields || (normal.length + tick.length + predefine.length > 0)) {
      return null;
    }

    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>در حال بارگذاری فیلترها...</Text>
      </View>
    );
  };

  // MainFilters.js - simplified renderFeatures
  const renderFeatures = () => {
    // ... your existing renderFeatures function ...
    if (categoryFields.tick && categoryFields.tick.length > 0) {
      return (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>امکانات:</Text>
          {categoryFields.tick.map((feature) => {

            if (feature.special != 1) return null;
            const isSelected = selectedFeatures.some(
              (f) => f.value === feature.value || f.id === feature.id
            );

            return (
              <TouchableOpacity
                key={feature.id || feature.value}
                style={[
                  styles.featureItem,
                  isSelected && styles.featureItemSelected,
                ]}
                onPress={() => onFeatureToggle(feature)}
              >
                <View style={styles.checkbox}>
                  {isSelected && <Icon name="check" size={16} color="#a92b31" />}
                </View>
                <Text style={[
                  styles.featureText,
                  isSelected && styles.featureTextSelected
                ]}>
                  {feature.value}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      );
    }
    
    if (features && features.length > 0) {
      return (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>امکانات:</Text>
          {features.map((feature) => {
            const isSelected = selectedFeatures.some(
              (f) => f.value === feature.value
            );

            return (
              <TouchableOpacity
                key={feature.id}
                style={[
                  styles.featureItem,
                  isSelected && styles.featureItemSelected,
                ]}
                onPress={() => onFeatureToggle(feature)}
              >
                <View style={styles.checkbox}>
                  {isSelected && <Icon name="check" size={16} color="white" />}
                </View>
                <Text style={[
                  styles.featureText,
                  isSelected && styles.featureTextSelected
                ]}>
                  دارای {feature.value}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      );
    }
    
    return null;
  };

  return (
    <ScrollView style={styles.filterContent}>
      {/* Loading State */}
      {renderLoadingState()}

      {/* Category Selection */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <TouchableOpacity 
            style={styles.changeButton}
            onPress={() => onSectionChange('categories')}
          >
            <Text style={styles.changeButtonText}>
              {selectedCategory ? 'تغییر' : 'انتخاب'}
            </Text>
          </TouchableOpacity>
          <Text style={styles.sectionTitle}>
            {selectedCategory ? `دسته بندی: ${selectedCategory.name}` : 'انتخاب دسته بندی'}
          </Text>
        </View>
      </View>

      {/* Features (Dynamic or Static) */}
      {renderFeatures()}

      {/* Dynamic Normal Fields as Min/Max */}
      {renderNormalFields()}

      {/* Neighborhood Selection */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <TouchableOpacity 
            style={styles.changeButton}
            onPress={() => onSectionChange('neighborhoods')}
          >
            <Text style={styles.changeButtonText}>
              {selectedNeighborhoods.length > 0 ? 'تغییر' : 'انتخاب'}
            </Text>
          </TouchableOpacity>
          <Text style={styles.sectionTitle}>
            {selectedNeighborhoods.length > 0 
              ? `محلات: ${selectedNeighborhoods.slice(0, 2).map(n => n.name).join('، ')}${selectedNeighborhoods.length > 2 ? '...' : ''}`
              : 'انتخاب محلات'
            }
          </Text>
        </View>
      </View>

      {/* Range Filters */}
      <RangeFilters
        rangeFilters={rangeFilters}
        onRangeFilterChange={onRangeFilterChange}
        categoryFields={categoryFields}
        loadingFields={loadingFields}
        onFieldValueChange={onFieldValueChange}
        fieldValues={fieldValues}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  filterContent: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 20,
    marginLeft:10,
    marginRight:10
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    fontFamily: 'iransans',
  },
  changeButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
  },
  changeButtonText: {
    fontSize: 15,
    color: '#333',
    fontFamily: 'iransans',
  },
  // Min/Max field styles
  minMaxContainer: {
    marginBottom: 20,
  },
  minMaxRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  minMaxInputContainer: {
    flex: 1,
    padding:5,
  },
  minMaxLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 6,
    fontFamily: 'iransans',
    textAlign: 'right',
  },
  minMaxInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 18,
    fontFamily: 'iransans',
    textAlign: 'center',
    color: '#333',
  },
  inputWithUnit: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  unitText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
    fontFamily: 'iransans',
    width: 40,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    fontFamily: 'iransans',
  },
  // Other styles remain the same...
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    fontFamily: 'iransans',
    textAlign: 'left',
    color: '#333',
  },
  booleanField: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 8,
  },
  featureItemSelected: {
    backgroundColor: '#e3f2fd',
    borderColor: '#b92a31',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#666',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureText: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'iransans',
    flex: 1,
    marginRight: 12,
  },
  featureTextSelected: {
    color: '#b92a31',
    fontWeight: 'bold',
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'iransans',
  },
});

export default MainFilters;