// hooks/useRTLStyles.js
import { StyleSheet } from 'react-native';
import { useLanguage } from '../contexts/LanguageContext';

export const useRTLStyles = () => {
  const { isRTL, currentLocale } = useLanguage();

  const createRTLStyles = (styles) => {
    return StyleSheet.create(
      Object.keys(styles).reduce((acc, key) => {
        const style = styles[key];
        
        if (!style) {
          acc[key] = style;
          return acc;
        }

        // Handle RTL transformations
        const transformedStyle = { ...style };

        // Transform margin
        if (style.marginLeft || style.marginRight) {
          transformedStyle.marginLeft = isRTL ? style.marginRight : style.marginLeft;
          transformedStyle.marginRight = isRTL ? style.marginLeft : style.marginRight;
        }

        // Transform padding
        if (style.paddingLeft || style.paddingRight) {
          transformedStyle.paddingLeft = isRTL ? style.paddingRight : style.paddingLeft;
          transformedStyle.paddingRight = isRTL ? style.paddingLeft : style.paddingRight;
        }

        // Transform text alignment
        if (style.textAlign) {
          if (style.textAlign === 'left') {
            transformedStyle.textAlign = isRTL ? 'right' : 'left';
          } else if (style.textAlign === 'right') {
            transformedStyle.textAlign = isRTL ? 'left' : 'right';
          }
        }

        // Transform flex direction for row layouts
        if (style.flexDirection) {
          if (style.flexDirection === 'row') {
            transformedStyle.flexDirection = isRTL ? 'row-reverse' : 'row';
          } else if (style.flexDirection === 'row-reverse') {
            transformedStyle.flexDirection = isRTL ? 'row' : 'row-reverse';
          }
        }

        // Transform position for absolute positioning
        if (style.position === 'absolute') {
          if (style.left !== undefined || style.right !== undefined) {
            transformedStyle.left = isRTL ? style.right : style.left;
            transformedStyle.right = isRTL ? style.left : style.right;
          }
        }

        acc[key] = transformedStyle;
        return acc;
      }, {})
    );
  };

  return { 
    createRTLStyles, 
    isRTL, 
    currentLocale,
    writingDirection: isRTL ? 'rtl' : 'ltr'
  };
};