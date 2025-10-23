// hooks/useRTLStyles.js
import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { useLanguage } from '../contexts/LanguageContext';

export const useRTLStyles = () => {
  const { isRTL, currentLocale, isReady } = useLanguage();
  const [forceUpdate, setForceUpdate] = useState(0);

  // Force re-render when RTL changes
  useEffect(() => {
    if (isReady) {
      setForceUpdate(prev => prev + 1);
    }
  }, [isRTL, currentLocale, isReady]);

  const createRTLStyles = (styles) => {
    if (!isReady) {
      return StyleSheet.create(styles); // Return original styles while loading
    }

    return StyleSheet.create(
      Object.keys(styles).reduce((acc, key) => {
        const style = styles[key];
        
        if (!style) {
          acc[key] = style;
          return acc;
        }

        const transformedStyle = { ...style };

        // Handle horizontal margins
        if (style.marginLeft !== undefined || style.marginRight !== undefined) {
          transformedStyle.marginLeft = isRTL ? style.marginRight : style.marginLeft;
          transformedStyle.marginRight = isRTL ? style.marginLeft : style.marginRight;
        }

        // Handle horizontal padding
        if (style.paddingLeft !== undefined || style.paddingRight !== undefined) {
          transformedStyle.paddingLeft = isRTL ? style.paddingRight : style.paddingLeft;
          transformedStyle.paddingRight = isRTL ? style.paddingLeft : style.paddingRight;
        }

        // Handle text alignment
        if (style.textAlign) {
          if (style.textAlign === 'left') {
            transformedStyle.textAlign = isRTL ? 'right' : 'left';
          } else if (style.textAlign === 'right') {
            transformedStyle.textAlign = isRTL ? 'left' : 'right';
          }
        }

        // Handle flex direction
        if (style.flexDirection) {
          if (style.flexDirection === 'row') {
            transformedStyle.flexDirection = isRTL ? 'row-reverse' : 'row';
          } else if (style.flexDirection === 'row-reverse') {
            transformedStyle.flexDirection = isRTL ? 'row' : 'row-reverse';
          }
        }

        // Handle absolute positioning
        if (style.position === 'absolute') {
          if (style.left !== undefined || style.right !== undefined) {
            transformedStyle.left = isRTL ? style.right : style.left;
            transformedStyle.right = isRTL ? style.left : style.right;
          }
        }

        // Handle alignSelf for RTL
        if (style.alignSelf === 'flex-start') {
          transformedStyle.alignSelf = isRTL ? 'flex-end' : 'flex-start';
        } else if (style.alignSelf === 'flex-end') {
          transformedStyle.alignSelf = isRTL ? 'flex-start' : 'flex-end';
        }

        // Handle alignItems for RTL
        if (style.alignItems === 'flex-start') {
          transformedStyle.alignItems = isRTL ? 'flex-end' : 'flex-start';
        } else if (style.alignItems === 'flex-end') {
          transformedStyle.alignItems = isRTL ? 'flex-start' : 'flex-end';
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
    writingDirection: isRTL ? 'rtl' : 'ltr',
    forceUpdate // This can be used to force re-renders
  };
};