import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { AFGHANISTAN_PROVINCES } from "../constants/theme";
import { useRTLStyles } from "../contexts/useRTLStyles";
import { globalStyle } from "../utils/styles";



const ProvinceDropdown = ({setTouched, setProvince, touched, province}) => {
    const { createRTLStyles, isRTL, language } = useRTLStyles();
    const [showProvinceDropdown, setShowProvinceDropdown] = useState(false);
    const styles = createRTLStyles(globalStyle);

    // Get province name based on current language
    const getProvinceName = (provinceData) => {
      switch (language) {
        case 'ps': return provinceData.ps;
        case 'prs': return provinceData.prs;
        default: return provinceData.en;
      }
    };
  
    // Get selected province display name
    const getSelectedProvinceName = () => {
      if (!province) return '';
      const selectedProvince = AFGHANISTAN_PROVINCES.find(p => p.id === province);
      return selectedProvince ? getProvinceName(selectedProvince) : '';
    };
  
  
  return (
  <View style={{marginBottom: 16}}>
    <Text style={styles.label}>Province *</Text>
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
        !province && styles.dropdownPlaceholder
      ]}>
        {province ? getSelectedProvinceName() : 'Select your province'}
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
                province === provinceItem.id && styles.dropdownItemTextSelected
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