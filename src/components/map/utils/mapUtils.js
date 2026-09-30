// utils/mapUtils.js
import Spinner from 'react-native-spinkit';

export const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371000;
  const toRad = deg => deg * (Math.PI / 180);

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return (R * c) / 1000;
};

export const formatNumber = num => {
  const number = Number(num);
  if (number >= 1000000000) {
    return `${parseFloat((number / 1000000000).toFixed(1))} میلیارد`;
  } else if (number >= 1000000) {
    return `${parseFloat((number / 1000000).toFixed(1))} میلیون`;
  } else {
    return String(number).replace(/(.)(?=(\d{3})+$)/g, '$1,');
  }
};