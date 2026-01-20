// components/ToggleSwitch.js
import { Text, TouchableOpacity, View } from 'react-native';
import { useRTLStyles } from '../contexts/useRTLStyles';
import { globalStyle } from '../utils/styles';

const ToggleSwitch = ({ 
  value, 
  onToggle, 
  label, 
  description,
  disabled = false 
}) => {
  const { createRTLStyles, isRTL } = useRTLStyles();
  const styles = createRTLStyles(globalStyle);

  return (
    <View style={styles.toggleContainer}>
      <View style={[
        styles.toggleTextContainer,
        isRTL ? styles.toggleTextContainerRTL : styles.toggleTextContainerLTR
      ]}>
        <Text style={[styles.toggleLabel, { textAlign: isRTL ? 'right' : 'left' }]}>
          {label}
        </Text>
        {description && (
          <Text style={[styles.toggleDescription, { textAlign: isRTL ? 'right' : 'left' }]}>
            {description}
          </Text>
        )}
      </View>
      <TouchableOpacity
        style={[
          styles.toggleBtn,
          value && styles.toggleBtnActive,
          disabled && styles.toggleBtnDisabled,
        ]}
        onPress={onToggle}
        disabled={disabled}
      >
        <View 
          style={[
            styles.toggleKnob,
            value && (isRTL ? styles.toggleKnobActiveRTL : styles.toggleKnobActiveLTR),
          ]} 
        />
      </TouchableOpacity>
    </View>
  );
};

export default ToggleSwitch;
