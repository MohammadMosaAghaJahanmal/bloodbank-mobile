import * as Location from 'expo-location';
import { useNavigation } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import GeneralInput from '../../../components/GeneralInput';
import ProvinceDropdown from '../../../components/ProvinceDropdown';
import ToggleSwitch from '../../../components/ToggleSwitch';
import { useRTLStyles } from '../../../contexts/useRTLStyles';
import { t } from '../../../utils/i18n';
import serverPath from '../../../utils/serverPath';
import { globalStyle } from '../../../utils/styles';
// import IMAGE from '../../../assets/images/icon.png';

export default function RegisterScreen() {
  const { createRTLStyles, isRTL, writingDirection } = useRTLStyles();
  const styles = createRTLStyles(globalStyle);
  
  const navigation = useNavigation();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  // Step 1 fields
  const [profileImage, setProfileImage] = useState(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [province, setProvince] = useState('');

  // Step 2 fields
  const [bloodGroup, setBloodGroup] = useState('');
  const [locationText, setLocationText] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [showAtSearch, setShowAtSearch] = useState(true);

  const [touched, setTouched] = useState({});

  // Blood group options
  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  // Check location permission on component mount
  useEffect(() => {
    checkLocationPermission();
  }, []);

  const checkLocationPermission = async () => {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.log('Permission check error:', error);
      return false;
    }
  };

  // Phone number validation - must start with 07 and be exactly 10 digits
  const validatePhoneNumber = (phoneNumber) => {
    const cleaned = phoneNumber.replace(/\s/g, '');
    
    // Must start with 07
    if (!cleaned.startsWith('07')) {
      return t('PHONE_START_WITH_07');
    }
    
    // Must be exactly 10 digits
    if (!/^07\d{8}$/.test(cleaned)) {
      return t('PHONE_10_DIGITS');
    }
    
    return null;
  };

  // Validation for step 1
  const step1Errors = useMemo(() => {
    const e = {};
    if (touched.fullName && fullName.trim().length < 3) {
      e.fullName = t('FULL_NAME_TOO_SHORT');
    }
    if (touched.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      e.email = t('INVALID_EMAIL');
    }
    if (touched.phone && phone.trim()) {
      const phoneError = validatePhoneNumber(phone);
      if (phoneError) {
        e.phone = phoneError;
      }
    } else if (touched.phone && !phone.trim()) {
      e.phone = t('PHONE_REQUIRED');
    }
    if (touched.password && password.length < 6) {
      e.password = t('PASSWORD_TOO_SHORT', { min: 6 });
    }
    return e;
  }, [fullName, email, phone, password, touched]);

  // Validation for step 2
  const step2Errors = useMemo(() => {
    const e = {};
    if (touched.bloodGroup && !bloodGroup) {
      e.bloodGroup = t('SELECT_BLOOD_GROUP');
    }
    if (touched.locationText && locationText.trim().length < 3) {
      e.locationText = t('LOCATION_TOO_SHORT');
    }
    if (touched.province && !province) {
      e.province = t('SELECT_PROVINCE');
    }
    return e;
  }, [bloodGroup, locationText, touched, province]);

  const isStep1Valid = 
    fullName.trim().length >= 3 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
    /^07\d{8}$/.test(phone.replace(/\s/g, '')) &&
    password.length >= 6;

  const isStep2Valid = 
    bloodGroup && 
    locationText.trim().length >= 3 &&
    province;

  // Get current location using Expo Location
  const getCurrentLocation = async () => {
    setLocationLoading(true);

    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        setLocationLoading(false);
        Alert.alert(
          t('PERMISSION_DENIED'),
          t('LOCATION_PERMISSION_REQUIRED'),
          [{ text: t('OK') }]
        );
        return;
      }

      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        timeout: 20000,
      });

      const { latitude: lat, longitude: lng } = location.coords;
      setLatitude(lat.toString());
      setLongitude(lng.toString());
      
      console.log('Location found:', { lat, lng });

      await getAddressFromCoordinates(lat, lng);
      
      setLocationLoading(false);
      
    } catch (error) {
      setLocationLoading(false);
      console.log('Location error:', error);
      
      if (latitude && longitude) {
        Alert.alert(
          t('LOCATION_FOUND'), 
          t('COORDINATES_SAVED_MANUAL_LOCATION'),
          [{ text: t('OK') }]
        );
      } else {
        Alert.alert(
          t('LOCATION_ERROR'), 
          t('UNABLE_GET_LOCATION'),
          [{ text: t('OK') }]
        );
      }
    }
  };

  // Reverse geocoding to get address from coordinates using Expo Location
  const getAddressFromCoordinates = async (lat, lng) => {
    try {
      let address = await Location.reverseGeocodeAsync({
        latitude: lat,
        longitude: lng,
      });

      if (address.length > 0) {
        const firstAddress = address[0];
        const addressParts = [
          firstAddress.street,
          firstAddress.city,
          firstAddress.region,
          firstAddress.country
        ].filter(part => part).join(', ');
        
        if (addressParts) {
          setLocationText(addressParts);
          return;
        }
      }
      
    } catch (error) {
      console.log('Reverse geocoding error:', error);
    }
  };

  // Handle image selection from camera or gallery
  const handleImageUpload = () => {
    Alert.alert(
      t('UPLOAD_PROFILE_PHOTO'),
      t('CHOOSE_OPTION'),
      [
        {
          text: t('TAKE_PHOTO'),
          onPress: () => takePhotoFromCamera(),
        },
        {
          text: t('CHOOSE_FROM_GALLERY'),
          onPress: () => selectPhotoFromGallery(),
        },
        {
          text: t('CANCEL'),
          style: 'cancel',
        },
      ]
    );
  };

  const takePhotoFromCamera = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
      quality: 0.8,
      cameraType: 'front',
      saveToPhotos: true,
    };

    launchCamera(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled camera');
      } else if (response.error) {
        Alert.alert(t('ERROR'), t('FAILED_TAKE_PHOTO') + response.error);
      } else if (response.assets && response.assets[0]) {
        const imageUri = response.assets[0].uri;
        setProfileImage(imageUri);
      }
    });
  };

  const selectPhotoFromGallery = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
      quality: 0.8,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        Alert.alert(t('ERROR'), t('FAILED_SELECT_IMAGE') + response.error);
      } else if (response.assets && response.assets[0]) {
        const imageUri = response.assets[0].uri;
        setProfileImage(imageUri);
      }
    });
  };

  const handleNextStep = () => {
    if (step === 1 && isStep1Valid) {
      setStep(2);
      if(Platform.OS === "android")
        getCurrentLocation()
    }
  };

  const handlePreviousStep = () => {
    setStep(1);
  };

  const handleSubmit = async () => {
    if (!isStep2Valid) return;

    setLoading(true);
    
    // Prepare data for submission
    const formData = new FormData();
    
    // Append profile image if selected
    if (profileImage) {
      formData.append('profileImage', {
        uri: profileImage,
        type: 'image/jpeg',
        name: 'profile.jpg',
      });
    }
    
    formData.append('fullName', fullName);
    formData.append('email', email);
    formData.append('phone', phone);
    formData.append('password', password);
    formData.append('province', province);
    formData.append('bloodGroup', bloodGroup);
    formData.append('locationText', locationText);
    formData.append('latitude', latitude);
    formData.append('longitude', longitude);
    formData.append('showAtSearch', showAtSearch.toString());

    console.log('Submitting data:', {
      fullName,
      email,
      phone,
      province,
      bloodGroup,
      locationText,
      latitude,
      longitude,
      showAtSearch,
      hasProfileImage: !!profileImage,
    });

    try {
      const response = await fetch(serverPath('/api/user'), {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const result = await response.json();

      if(!response.ok)
        Alert.alert(t('REGISTRATION_FAILED'), result.message || t('TRY_AGAIN_LATER'));
      else if(result.status === "failure")
        Alert.alert(t('REGISTRATION_FAILED'), result.message || t('TRY_AGAIN_LATER'));
      else if (response.ok) {
        Alert.alert(
          t('REGISTRATION_SUCCESSFUL'),
          t('THANK_YOU_JOINING'),
          [
            {
              text: t('GET_STARTED'),
              onPress: () => {
                navigation?.navigate?.('login')
                setProfileImage(null)
                setStep(1)
                setFullName('')
                setEmail('')
                setPhone('')
                setPassword('')
                setProvince('')
                setBloodGroup('')
                setLocationText('')
                setLatitude('')
                setLongitude('')
              },
            },
          ]
        );
      }
    } catch (e) {
      console.log('Registration error:', e);
      Alert.alert(t('REGISTRATION_FAILED'), t('CHECK_CONNECTION_TRY_AGAIN'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView 
          contentContainerStyle={styles.container} 
          keyboardShouldPersistTaps="handled"
        >
          {/* Header with Blood Drop Logo */}
          <View style={styles.header}>
            <Text style={styles.title}>{t('JOIN_BLOOD_DONORS')}</Text>
            <Text style={styles.step}>{step}/2</Text>

            {/* Progress bar */}
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: step === 1 ? '50%' : '100%' }]} />
            </View>
          </View>

          {/* Step 1: Personal Information */}
          {step === 1 && (
            <View style={styles.stepContainer}>
              {/* Profile Image Upload */}
              <View style={styles.avatarWrap}>
                <TouchableOpacity onPress={handleImageUpload} style={styles.avatarTouchable}>
                  <View style={styles.avatar}>
                    {profileImage ? (
                      <Image source={{ uri: profileImage }} style={styles.avatarImage} />
                    ) : (
                      // <Text style={styles.avatarPlaceholder}>🩸</Text>
                      <Image source={require("../../../assets/images/profile.jpg")} style={styles.avatarImage} />
                    )}

                    <View style={[
                      styles.avatarOverlay,
                      isRTL ? styles.avatarOverlayRTL : styles.avatarOverlayLTR
                    ]}>
                      <Text style={styles.avatarOverlayText}>+</Text>
                    </View>
                  </View>
                </TouchableOpacity>
                <Text style={styles.avatarLabel}>
                  {profileImage ? t('CHANGE_PHOTO') : t('ADD_PROFILE_PHOTO')}
                </Text>
              </View>

              {/* Form */}
              <View style={styles.card}>
                <GeneralInput
                  label={t('FULL_NAME')}
                  placeholder={t('FULL_NAME_PLACEHOLDER')}
                  value={fullName}
                  onChangeText={setFullName}
                  onBlur={() => setTouched(t => ({ ...t, fullName: true }))}
                  error={step1Errors.fullName}
                  returnKeyType="next"
                  isRTL={isRTL}
                  writingDirection={writingDirection}
                  styles={styles}
                  icon="👤"
                />

                <GeneralInput
                  label={t('EMAIL_ADDRESS')}
                  placeholder={t('EMAIL_PLACEHOLDER')}
                  value={email}
                  onChangeText={setEmail}
                  onBlur={() => setTouched(t => ({ ...t, email: true }))}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  isRTL={isRTL}
                  writingDirection={writingDirection}
                  styles={styles}
                  error={step1Errors.email}
                  returnKeyType="next"
                  icon="📧"
                />

                <GeneralInput
                  label={t('MOBILE_NUMBER')}
                  placeholder={t('PHONE_PLACEHOLDER')}
                  value={phone}
                  onChangeText={setPhone}
                  onBlur={() => setTouched(t => ({ ...t, phone: true }))}
                  keyboardType="phone-pad"
                  error={step1Errors.phone}
                  isRTL={isRTL}
                  writingDirection={writingDirection}
                  styles={styles}
                  returnKeyType="next"
                  icon="📱"
                />

                <GeneralInput
                  label={t('PASSWORD')}
                  placeholder={t('PASSWORD_PLACEHOLDER')}
                  value={password}
                  onChangeText={setPassword}
                  onBlur={() => setTouched(t => ({ ...t, password: true }))}
                  error={step1Errors.password}
                  secureTextEntry={!showPass}
                  isRTL={isRTL}
                  writingDirection={writingDirection}
                  styles={styles}
                  icon="🔒"
                  right={
                    <TouchableOpacity onPress={() => setShowPass(s => !s)}>
                      <Text style={styles.eye}>{showPass ? t('HIDE') : t('SHOW')}</Text>
                    </TouchableOpacity>
                  }
                />
              </View>

              {/* Next Button */}
              <TouchableOpacity
                style={[styles.primaryBtn, !isStep1Valid && styles.disabledBtn]}
                onPress={handleNextStep}
                activeOpacity={0.9}
                disabled={!isStep1Valid}
              >
                <Text style={styles.primaryBtnText}>{t('CONTINUE_TO_BLOOD_DETAILS')}</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Step 2: Blood & Location Information */}
          {step === 2 && (
            <View style={styles.stepContainer}>
              <View style={styles.card}>
                {/* Blood Group Selection */}
                <Text style={styles.label}>{t('BLOOD_GROUP')}</Text>
                <View style={styles.fieldContainer}>
                  <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false} 
                    style={styles.bloodGroupScroll}
                    contentContainerStyle={[
                      styles.bloodGroupContent,
                      isRTL && styles.bloodGroupContentRTL
                    ]}
                  >
                    {bloodGroups.map(group => (
                      <TouchableOpacity
                        key={group}
                        style={[
                          styles.bloodGroupBtn,
                          bloodGroup === group && styles.bloodGroupBtnSelected,
                        ]}
                        onPress={() => setBloodGroup(group)}
                      >
                        <Text style={[
                          styles.bloodGroupText,
                          bloodGroup === group && styles.bloodGroupTextSelected,
                        ]}>
                          {group}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                  {step2Errors.bloodGroup && <Text style={styles.error}>{step2Errors.bloodGroup}</Text>}
                </View>

                {/* Province Dropdown */}
                {step1Errors.province && <Text style={styles.error}>{step1Errors.province}</Text>}
                <ProvinceDropdown
                  setTouched={setTouched}
                  setProvince={setProvince}
                  touched={touched}
                  province={province}
                />

                {/* Location Text */}
                <GeneralInput
                  label={t('YOUR_LOCATION')}
                  placeholder={t('LOCATION_PLACEHOLDER')}
                  value={locationText}
                  onChangeText={setLocationText}
                  onBlur={() => setTouched(t => ({ ...t, locationText: true }))}
                  error={step2Errors.locationText}
                  icon="📍"
                  isRTL={isRTL}
                  writingDirection={writingDirection}
                  styles={styles}
                />

                {/* Location Permission Section */}
                <View style={styles.locationPermissionCard}>
                  <Text style={styles.permissionTitle}>{t('ENABLE_LOCATION_SERVICES')}</Text>
                  <Text style={styles.permissionText}>
                    {t('LOCATION_SERVICES_DESCRIPTION')}
                  </Text>
                  
                  <TouchableOpacity
                    style={styles.locationBtn}
                    onPress={getCurrentLocation}
                    disabled={locationLoading}
                  >
                    {locationLoading ? (
                      <ActivityIndicator color="#FFFFFF" size="small" />
                    ) : (
                      <View style={styles.locationBtnContent}>
                        <Text style={styles.locationBtnText}>
                          {latitude ? t('UPDATE_MY_LOCATION') : t('GET_MY_LOCATION')}
                        </Text>
                        <Text style={styles.locationBtnIcon}>📍</Text>
                      </View>
                    )}
                  </TouchableOpacity>

                  {/* Coordinates Display */}
                  {(latitude || longitude) && (
                    <View style={[
                      styles.coordinatesContainer,
                      isRTL && styles.coordinatesContainerRTL
                    ]}>
                      <Text style={styles.coordinatesTitle}>📍 {t('CURRENT_COORDINATES')}:</Text>
                      <Text style={styles.coordinatesText}>
                        {t('LATITUDE')}: {Number(latitude).toFixed(6)}
                      </Text>
                      <Text style={styles.coordinatesText}>
                        {t('LONGITUDE')}: {Number(longitude).toFixed(6)}
                      </Text>
                      <Text style={styles.coordinatesHelp}>
                        {t('COORDINATES_HELP')}
                      </Text>
                    </View>
                  )}
                </View>

                {/* Search Visibility Toggle */}
                <ToggleSwitch
                  value={showAtSearch}
                  onToggle={() => setShowAtSearch(!showAtSearch)}
                  label={t('SHOW_IN_DONOR_SEARCH')}
                  description={t('SEARCH_VISIBILITY_DESCRIPTION')}
                />
              </View>

              {/* Action Buttons */}
              <View style={[
                styles.actionButtons,
                isRTL && styles.actionButtonsRTL
              ]}>
                <TouchableOpacity
                  style={[
                    styles.secondaryBtn,
                    isRTL ? styles.secondaryBtnRTL : styles.secondaryBtnLTR
                  ]}
                  onPress={handlePreviousStep}
                  activeOpacity={0.8}
                >
                  <Text style={styles.secondaryBtnText}>{t('BACK')}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.primaryBtn, !isStep2Valid && styles.disabledBtn]}
                  onPress={handleSubmit}
                  activeOpacity={0.9}
                  disabled={!isStep2Valid || loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#FFFFFF" size="small" />
                  ) : (
                    <Text style={styles.primaryBtnText}>{t('REGISTER')}</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>{t('ALREADY_HAVE_ACCOUNT')} </Text>
            <TouchableOpacity onPress={() => navigation?.navigate?.('login')}>
              <Text style={[styles.footerText, styles.footerLink]}>
                {t('SIGN_IN')}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 16 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}