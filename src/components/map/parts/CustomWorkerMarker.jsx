import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CustomWorkerMarker = ({ worker,zoomLevel }) => {

    const renderPrice = properties => {
        // const formatNumber = (num) => {
        //   return String(num).replace(/(.)(?=(\d{3})+$)/g, "$1,");
        // };
    
        const formatNumber = num => {
          const number = Number(num); // Ensure it's a number
    
          if (number >= 1000000000) {
            // For billions
            return `${parseFloat((number / 1000000000).toFixed(1))} میلیارد`;
          } else if (number >= 1000000) {
            // For millions
            return `${parseFloat((number / 1000000).toFixed(1))} میلیون`;
          } else {
            // For smaller numbers, show as is with commas
            return String(number).replace(/(.)(?=(\d{3})+$)/g, '$1,');
          }
        };
    
        const pricePerM2 = properties.find(item => item.name === 'قیمت هر متر');
        const priceItem = properties.find(item => item.name === 'قیمت');
    
        const rentFront = properties.find(item => item.name === 'پول پیش');
        const rentPerMonth = properties.find(item => item.name === 'اجاره ماهیانه');
    
        if (priceItem) {
          const priceNoFormat = priceItem.value;
          const pricePerM2Value = pricePerM2?.value || 0;
    
          return (
            <Text style={[styles.text, styles.rtl]}>
              <Text style={styles.boldText}>{formatNumber(priceNoFormat)}</Text>
              {zoomLevel > 15 && (
                <>
                  {'\n'}
                  {' متری '}
    
                  {formatNumber(pricePerM2Value)}
                </>
              )}
            </Text>
          );
        } else if (rentFront) {
          const rentFrontNoFormat = rentFront.value;
          const rentPerMonthNoFormat = rentPerMonth?.value || 0;
    
          return (
            <View style={styles.price_row}>
              {rentPerMonthNoFormat !== 0 ? (
                <Text style={[styles.text, styles.rtl, styles.paddingRight]}>
                  <Text style={styles.boldText}>
                    {formatNumber(rentPerMonthNoFormat)} {' اجاره '}
                  </Text>
                </Text>
              ) : (
                <Text style={[styles.text, styles.rtl, styles.paddingRight]}>
                  <Text style={styles.boldText}>{'کامل'}</Text>
                </Text>
              )}
    
              <Text style={[styles.text, styles.rtl]}>
                <Text style={styles.boldText}>
                  {formatNumber(rentFrontNoFormat)} {' رهن '}
                </Text>
              </Text>
            </View>
          );
        }
    
        return null;
      };

  return (
    <View style={styles.container}>
      <Text style={styles.priceText}>
      {renderPrice(JSON.parse(worker.json_properties, worker.id))} 
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#b92a31',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderWidth: 1.5,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  priceText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    includeFontPadding: false,
  },
});

export default CustomWorkerMarker;