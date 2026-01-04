import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { AFGHANISTAN_PROVINCES } from "../constants/theme";
import { useRTLStyles } from "../contexts/useRTLStyles";
import i18n from "../utils/i18n";
import { globalStyle } from "../utils/styles";

const ProvinceDropdown = ({setTouched, setProvince, touched, province}) => {
    const { createRTLStyles, isRTL, currentLocale } = useRTLStyles();
    const [showProvinceDropdown, setShowProvinceDropdown] = useState(false);
    const styles = createRTLStyles(globalStyle);

    // Get province name based on current language
    const getProvinceName = (provinceData) => {
      switch (currentLocale) {
        case 'ps': return provinceData.ps;
        case 'pa': return provinceData.prs || provinceData.pa;
        default: return provinceData.en;
      }
    };
  
    const getSelectedProvinceName = () => {
      if (!province) return '';
      const selectedProvince = AFGHANISTAN_PROVINCES.find(p => p.id === province);
      return selectedProvince ? getProvinceName(selectedProvince) : '';
    };
  
  return (
  <View style={{marginBottom: 16}}>
    <Text style={styles.label}>{i18n.t('PROVINCE')} *</Text>
    <TouchableOpacity
      style={[
        styles.dropdownButton,
        touched.province && !province && styles.dropdownError,
        isRTL && styles.dropdownButtonRTL
      ]}
      onPress={() => setShowProvinceDropdown(!showProvinceDropdown)}
    >
      <Text style={[
        styles.dropdownButtonText,
        !province && styles.dropdownPlaceholder,
        { textAlign: isRTL ? 'right' : 'left' }
      ]}>
        {province ? getSelectedProvinceName() : i18n.t('SELECT_PROVINCE')}
      </Text>
      <Text style={[
        styles.dropdownArrow,
        isRTL && styles.dropdownArrowRTL
      ]}>
        {showProvinceDropdown ? '▲' : '▼'}
      </Text>
    </TouchableOpacity>
    

    {showProvinceDropdown && (
      <View style={[
        styles.dropdownList,
        isRTL && styles.dropdownListRTL
      ]}>
        <ScrollView
          style={styles.dropdownScroll}
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={false}
        >
          {AFGHANISTAN_PROVINCES.map((provinceItem) => (
            <TouchableOpacity
              key={provinceItem.id}
              style={[
                styles.dropdownItem,
                province === provinceItem.id && styles.dropdownItemSelected,
                isRTL && styles.dropdownItemRTL,
                province === provinceItem.id && isRTL && styles.dropdownItemSelectedRTL
              ]}
              onPress={() => {
                setProvince(provinceItem.id);
                setShowProvinceDropdown(false);
                setTouched(t => ({ ...t, province: true }));
              }}
            >
              <Text style={[
                styles.dropdownItemText,
                province === provinceItem.id && styles.dropdownItemTextSelected,
                { textAlign: isRTL ? 'right' : 'left' }
              ]}>
                {getProvinceName(provinceItem)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    )}
  </View>
  )
};

export default ProvinceDropdown;