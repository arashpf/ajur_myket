import React from 'react';
import { View } from 'react-native';
import { Select, Box, Text, CheckIcon } from 'native-base';

const RangeDropdown = ({ fl, onChange }) => {
  const MAX_LIMIT = 100000000000000; // 100 trillion
  // Generate options based on min/max range
  const options = React.useMemo(() => {
    const min = Math.max(0, +fl.min_range || 0);
    const max = Math.max(min + 1, +fl.max_range || min + 100);
    const step = calculateStep(min, max);
    const options = [];
    
    for (let i = min; i <= max; i += step) {
      options.push(i);
    }
    if (options[options.length - 1] !== max) {
      options.push(max);
    }
    
    return options;
  }, [fl.min_range, fl.max_range]);

  const [minValue, setMinValue] = React.useState(fl.value?.low || options[0]);
  const [maxValue, setMaxValue] = React.useState(fl.value?.high || 'more-than');

  const handleMinChange = (itemValue) => {
    const numValue = parseInt(itemValue);
    setMinValue(numValue);
    if (numValue > (maxValue === 'more-than' ? MAX_LIMIT : maxValue)) {
      const newMax = numValue;
      setMaxValue(newMax);
      onChange(fl.id || fl.field_type, { low: numValue, high: newMax });
    } else {
      onChange(fl.id || fl.field_type, { 
        low: numValue, 
        high: maxValue === 'more-than' ? MAX_LIMIT : maxValue 
      });
    }
  };

  const handleMaxChange = (itemValue) => {
    if (itemValue === 'more-than') {
      setMaxValue('more-than');
      onChange(fl.id || fl.field_type, { 
        low: minValue, 
        high: MAX_LIMIT 
      });
    } else {
      const numValue = parseInt(itemValue);
      setMaxValue(numValue);
      if (numValue < minValue) {
        setMinValue(numValue);
        onChange(fl.id || fl.field_type, { low: numValue, high: numValue });
      } else {
        onChange(fl.id || fl.field_type, { low: minValue, high: numValue });
      }
    }
  };

  // Calculate appropriate step size
  function calculateStep(min, max) {
    const range = max - min;
    if (range <= 100) return 1;
    if (range <= 10000) return 100;
    if (range <= 1000000) return 1000;
    if (range <= 100000000) return 10000;
    return range / 10;
  }

  // Format values for display (Persian)
  function formatValue(value) {
    const numValue = +value || 0;
    if (numValue >= 1e9) return (numValue / 1e9).toFixed(1) + ' میلیارد';
    if (numValue >= 1e6) return (numValue / 1e6).toFixed(0) + ' میلیون';
    if (numValue >= 1e3) return (numValue / 1e3).toFixed(0) + ' هزار';
    return numValue.toString();
  }

  return (
    <Box width="100%" p={2}>
      <Text style={{padding:10, fontFamily:'iransans'}}>{fl.value}</Text>
      <Box flexDirection="row" justifyContent="space-between">
        {/* Minimum Selector */}
        <Box flex={1} mr={2}>
          <Select
            selectedValue={minValue.toString()}
            minWidth="100%"
            accessibilityLabel="حداقل"
            placeholder="حداقل"
            _selectedItem={{
              bg: "primary.100",
              endIcon: <CheckIcon size="5" />
            }}
            onValueChange={handleMinChange}
          >
            {options.map(value => (
              <Select.Item 
                key={`min-${value}`}
                label={`از ${formatValue(value)}`}
                value={value.toString()}
              />
            ))}
          </Select>
        </Box>

        {/* Maximum Selector */}
        <Box flex={1}>
          <Select
            selectedValue={maxValue === 'more-than' ? 'more-than' : maxValue.toString()}
            minWidth="100%"
            accessibilityLabel="حداکثر"
            placeholder="حداکثر"
            _selectedItem={{
              bg: "primary.100",
              endIcon: <CheckIcon size="5" />
            }}
            onValueChange={handleMaxChange}
          >
            {options.map(value => (
              <Select.Item 
                key={`max-${value}`}
                label={`تا ${formatValue(value)}`}
                value={value.toString()}
              />
            ))}
            <Select.Item 
              key="more-than"
              label={`بیشتر از ${formatValue(options[options.length - 1])}`}
              value="more-than"
            />
          </Select>
        </Box>
      </Box>
    </Box>
  );
};

export default RangeDropdown;