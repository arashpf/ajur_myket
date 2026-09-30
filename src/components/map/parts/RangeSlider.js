const React = require('react');
const { View, Text, StyleSheet } = require('react-native');
const RangeSlider = require('rn-range-slider').default;

const RangeSliderExample = React.memo(function({ fl, onChange }) {
  // Convert and validate all numeric inputs with proper bounds checking
  const min = Math.max(0, +fl.min_range || 0);
  const max = Math.max(min + 1, +fl.max_range || min + 100);
  const initialLow = Math.min(max, Math.max(min, +fl.value?.low || min));
  const initialHigh = Math.min(max, Math.max(min, +fl.value?.high || max));

  const [low, setLow] = React.useState(initialLow);
  const [high, setHigh] = React.useState(initialHigh);

  // Update when props change
  React.useEffect(function() {
    const newMin = Math.max(0, +fl.min_range || 0);
    const newMax = Math.max(newMin + 1, +fl.max_range || newMin + 100);
    const newLow = Math.min(newMax, Math.max(newMin, +fl.value?.low || newMin));
    const newHigh = Math.min(newMax, Math.max(newMin, +fl.value?.high || newMax));
    
    if (newLow !== low || newHigh !== high || newMin !== min || newMax !== max) {
      setLow(newLow);
      setHigh(newHigh);
    }
  }, [fl.min_range, fl.max_range, fl.value]);

  const renderThumb = React.useCallback(function() {
    return React.createElement(View, { style: styles.thumb });
  }, []);

  const renderRail = React.useCallback(function() {
    return React.createElement(View, { style: styles.rail });
  }, []);

  const renderRailSelected = React.useCallback(function() {
    return React.createElement(View, { style: styles.railSelected });
  }, []);

  

  const handleValueChange = React.useCallback(function(newLow, newHigh) {
    const validatedLow = Math.min(max, Math.max(min, +newLow || min));
    const validatedHigh = Math.min(max, Math.max(min, +newHigh || max));
    
    setLow(validatedLow);
    setHigh(validatedHigh);
    
    // if (onChange) {
    //   onChange(fl.id || fl.field_type, { 
    //     low: validatedLow, 
    //     high: validatedHigh ,
    //   });
    // }
  }, [min, max, fl.id, fl.field_type, onChange]);

  const handleValueChangeCompleted = React.useCallback(function(newLow, newHigh) {
    const validatedLow = Math.min(max, Math.max(min, +newLow || min));
    const validatedHigh = Math.min(max, Math.max(min, +newHigh || max));
    
    setLow(validatedLow);
    setHigh(validatedHigh);
    
    if (onChange) {
      onChange(fl.id || fl.field_type, { 
        low: validatedLow, 
        high: validatedHigh ,
      });
    }
  }, [min, max, fl.id, fl.field_type, onChange]);

  function formatValue(value) {
    const numValue = +value || 0;
    if (numValue >= 1e9) return (numValue / 1e9).toFixed(1) + ' میلیارد ';
    if (numValue >= 1e6) return (numValue / 1e6).toFixed(0) + ' میلیون ';
    if (numValue >= 1e3) return (numValue / 1e3).toFixed(0) + ' هزار';
    return numValue.toString();
  }

  function SpeechBubble({ children }) {
    return React.createElement(
      View,
      { style: styles.speechBubbleContainer },
      [
        React.createElement(
          View,
          { style: styles.speechBubbleBox },
          React.createElement(
            Text,
            { style: styles.speechBubbleText },
            children
          )
        ),
        React.createElement(View, { style: styles.speechBubbleArrow })
      ]
    );
  }

  const calculateStep = (min, max) => {
    const range = max - min;
    
    if (range <= 100) return 1;              // Small range: step=1 (0-100)
    if (range <= 10000) return 100;         // Medium range: step=100 (e.g., 1K-10K)
    if (range <= 1000000) return 1000;    // Larger range: step=1K (e.g., 50K-1M)
    if (range <= 100000000) return 10000; // Big range: step=10K (e.g., 1M-100M)
    return range / 1000;                     // Huge range: dynamic step (e.g., 1M-50B → step=50M)
  };
  
  // Usage
  const step = calculateStep(min, max);

  // Final validated slider props
  const sliderProps = {
    min: min,
    max: max,
    // low: low,
    ...(fl.low>0 ? { low: fl.low } :{ low: low }),
    ...(fl.high>0 ? { high: fl.high } : { high: high }),
    // high: high,
    step: calculateStep(min, max),  // Dynamic step
    floatingLabel: true,
    renderThumb: renderThumb,
    renderRail: renderRail,
    renderRailSelected: renderRailSelected,
    onValueChanged: handleValueChange,
    onSliderTouchEnd:handleValueChangeCompleted,
    disableRange: false
  };

  return React.createElement(
    View,
    { style: styles.container },
    [
      React.createElement(
        SpeechBubble,
        null,
        fl.value + ' ' + formatValue(low) + ' تا ' + formatValue(high)    
      ),
      React.createElement(
        RangeSlider,
        sliderProps
      )
    ]
  );
});

const styles = StyleSheet.create({
  container: {
    padding: 20,
    width: '100%'
  },
  thumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#007AFF',
    borderWidth: 2,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3
  },
  rail: {
    flex: 1,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2
  },
  railSelected: {
    height: 4,
    backgroundColor: '#007AFF',
    borderRadius: 2
  },
  speechBubbleContainer: {
    alignItems: 'center',
    marginTop: 20,
    top: 5
  },
  speechBubbleBox: {
    backgroundColor: '#b92a31',
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 8,
    shadowOpacity: 0.1,
    shadowRadius: 6,
    minWidth: 150,
    maxWidth: 300
  },
  speechBubbleText: {
    fontSize: 13,
    color: '#f9f9f9',
    textAlign: 'center',
  },
  speechBubbleArrow: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 12,
    borderRightWidth: 12,
    borderTopWidth: 12,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#b92a31',
    position: 'relative',
    top: -1
  },
});

module.exports = RangeSliderExample;