import { StyleSheet } from 'react-native';
import { useLanguage } from '../contexts/LanguageContext';

export const useRTLStyles = () => {
  const { isRTL } = useLanguage();

  const createRTLStyles = (styles) => {
    return StyleSheet.create(
      Object.keys(styles).reduce((acc, key) => {
        const style = styles[key];
        
        // Handle margin and padding for RTL
        if (style.marginLeft || style.marginRight) {
          acc[key] = {
            ...style,
            marginLeft: isRTL ? style.marginRight : style.marginLeft,
            marginRight: isRTL ? style.marginLeft : style.marginRight,
          };
        } else if (style.paddingLeft || style.paddingRight) {
          acc[key] = {
            ...style,
            paddingLeft: isRTL ? style.paddingRight : style.paddingLeft,
            paddingRight: isRTL ? style.paddingLeft : style.paddingRight,
          };
        } else {
          acc[key] = style;
        }
        
        return acc;
      }, {})
    );
  };

  return { createRTLStyles, isRTL };
};