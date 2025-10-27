// app/profile.js
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
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
import { AuthContext } from '../../../contexts/authContext';
import { useRTLStyles } from '../../../contexts/useRTLStyles';
import { t } from '../../../utils/i18n';
import serverPath from '../../../utils/serverPath';
import { globalStyle } from '../../../utils/styles';

export default function ProfileScreen() {
  const { createRTLStyles, isRTL, writingDirection } = useRTLStyles();
  const styles = createRTLStyles(globalStyle);
  
  const { user, token, logout, saveTokenAndLogin } = useContext(AuthContext);
  
  const [loading, setLoading] = useState(false);
  const [updatingDonation, setUpdatingDonation] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  // Form fields - initialized with user data
  const [profileImage, setProfileImage] = useState(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [province, setProvince] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [locationText, setLocationText] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [showAtSearch, setShowAtSearch] = useState(true);
  const [amountMl, setAmountMl] = useState(user?.lastDonationAmount?.toString() || '450');
  const [donationLocation, setDonationLocation] = useState(user?.lastDonationLocation || '');
  const [notes, setNotes] = useState(user?.lastDonationNotes || '');
  const [sendingVerification, setSendingVerification] = useState(false);
  // Blood donation fields
  const [lastDonationDate, setLastDonationDate] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [touched, setTouched] = useState({});

  // Blood group options
  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  // Load user data on mount
  useEffect(() => {
    if (user) {
      // Set profile image - handle both server URL and local URI
      setProfileImage(serverPath(user.imageUrl) || null);
      
      // Set personal information
      setFullName(user.fullName || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setProvince(user.province || '');
      setBloodGroup(user.bloodGroup || '');
      setLocationText(user.locationText || '');
      setLatitude(user.latitude?.toString() || '');
      setLongitude(user.longitude?.toString() || '');
      setShowAtSearch(user.showAtSearch ?? true);
      
      // Set donation information
      if (user.lastDonationDate) {
        const donationDate = new Date(user.lastDonationDate);
        setLastDonationDate(formatDate(donationDate));
        setSelectedDate(donationDate);
      } else {
        setLastDonationDate('');
      }
    }
  }, [user]);

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

  // Format date for display
  const formatDate = (date) => {
    return date.toISOString().split('T')[0]; // YYYY-MM-DD format
  };

  // Handle date change from date picker
  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setSelectedDate(selectedDate);
      setLastDonationDate(formatDate(selectedDate));
    }
  };

  // Show date picker
  const showDatepicker = () => {
    setShowDatePicker(true);
  };

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
      
      setLocationText(t('LOCATION_AT_COORDINATES', { lat: lat.toFixed(6), lng: lng.toFixed(6) }));
      
    } catch (error) {
      console.log('Reverse geocoding error:', error);
      setLocationText(t('LOCATION_AT_COORDINATES', { lat: lat.toFixed(6), lng: lng.toFixed(6) }));
    }
  };

  // Validation
  const errors = useMemo(() => {
    const e = {};
    if (touched.fullName && fullName.trim().length < 3) e.fullName = t('FULL_NAME_TOO_SHORT');
    if (touched.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = t('INVALID_EMAIL');
    if (touched.phone && !/^\+?\d{8,15}$/.test(phone)) e.phone = t('PHONE_REQUIRED');
    if (touched.password && password && password.length < 6) e.password = t('PASSWORD_TOO_SHORT', { min: 6 });
    if (touched.bloodGroup && !bloodGroup) e.bloodGroup = t('SELECT_BLOOD_GROUP');
    if (touched.locationText && locationText.trim().length < 3) e.locationText = t('LOCATION_TOO_SHORT');
    if (touched.province && !province) e.province = t('SELECT_PROVINCE');
    if (touched.amountMl) {
      const amount = parseInt(amountMl);
      if (!amountMl || isNaN(amount)) {
        e.amountMl = t('ENTER_BLOOD_AMOUNT');
      } else if (amount < 1 || amount > 1000) {
        e.amountMl = t('BLOOD_AMOUNT_RANGE');
      }
    }
      
    if (touched.lastDonationDate && !lastDonationDate) {
      e.lastDonationDate = t('SELECT_DONATION_DATE');
    }
    return e;
  }, [fullName, email, phone, password, bloodGroup, locationText, province, touched, amountMl, lastDonationDate]);

  const isFormValid = 
    fullName.trim().length >= 3 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
    /^\+?\d{8,15}$/.test(phone) &&
    (!password || password.length >= 6) &&
    bloodGroup && 
    locationText.trim().length >= 3 &&
    province;

  // Handle image selection with react-native-image-picker
  const handleImageUpload = () => {
    Alert.alert(
      t('UPDATE_PROFILE_PHOTO'),
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
          text: t('REMOVE_PHOTO'),
          onPress: () => setProfileImage(null),
          style: 'destructive',
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

  // Get image source - handles both server URLs and local URIs
  const getImageSource = () => {
    if (!profileImage) return null;
    
    // If it's a server URL (starts with http) or a local file URI
    return { uri: (profileImage) };
  };

  // Update profile
  const handleUpdateProfile = async () => {
    if (!isFormValid) return;

    setLoading(true);
    
    const formData = new FormData();
    
    // Append profile image if selected (and it's a new image - not a URL from server)
    if (profileImage && !profileImage.startsWith('http')) {
      formData.append('profileImage', {
        uri: profileImage,
        type: 'image/jpeg',
        name: 'profile.jpg',
      });
    } else if (profileImage === null && user?.imageUrl) {
      // If profile image is explicitly set to null and user had an image before, send a flag to remove it
      formData.append('removeProfileImage', 'true');
    }
    
    formData.append('fullName', fullName);
    formData.append('email', email);
    formData.append('phone', phone);
    if (password) {
      formData.append('password', password);
    }
    formData.append('province', province);
    formData.append('bloodGroup', bloodGroup);
    formData.append('locationText', locationText);
    formData.append('latitude', latitude);
    formData.append('longitude', longitude);
    formData.append('showAtSearch', showAtSearch.toString());
    formData.append('id', user.id);

    console.log('Updating profile data:', {
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
      isNewImage: profileImage && !profileImage.startsWith('http'),
    });

    try {
      const response = await fetch(serverPath(`/api/user`), {
        method: 'PUT',
        headers: {
          'Authorization': `bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        Alert.alert(t('UPDATE_FAILED'), result.message || t('TRY_AGAIN_LATER'));
      } else if (result.status === "failure") {
        Alert.alert(t('UPDATE_FAILED'), result.message || t('TRY_AGAIN_LATER'));
      } else 
      {
        Alert.alert(t('SUCCESS'), t('PROFILE_UPDATED_SUCCESS'));
        if (result.user) {
          saveTokenAndLogin(token, result.user);
        }
      }
    } catch (e) {
      console.log('Update error:', e);
      Alert.alert(t('UPDATE_FAILED'), t('CHECK_CONNECTION_TRY_AGAIN'));
    } finally {
      setLoading(false);
    }
  };

  // Handle send verification email
const handleSendVerification = async () => {
  setSendingVerification(true);

  try {
    const response = await fetch(serverPath('/api/send-verification'), {
      method: 'POST',
      headers: {
        'Authorization': `bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();

      if (!response.ok) {
        Alert.alert(t('VERIFICATION_FAILED'), result.message || t('FAILED_SEND_VERIFICATION'));
      } else if (result.status === "failure") {
        Alert.alert(t('VERIFICATION_FAILED'), result.message || t('FAILED_SEND_VERIFICATION'));
      } else 
      {
        Alert.alert(
          t('VERIFICATION_SENT'), 
          t('VERIFICATION_EMAIL_SENT'),
          [{ text: t('OK') }]
        );
      }

  } catch (e) {
    console.log('Verification error:', e);
    Alert.alert(t('VERIFICATION_FAILED'), t('CHECK_CONNECTION_TRY_AGAIN'));
  } finally {
    setSendingVerification(false);
  }
};

  // Record blood donation
const handleRecordDonation = async () => {
  if (!lastDonationDate || !amountMl) {
    Alert.alert(t('ERROR'), t('FILL_ALL_DONATION_FIELDS'));
    return;
  }

  const amount = parseInt(amountMl);
  if (isNaN(amount) || amount < 1 || amount > 1000) {
    Alert.alert(t('ERROR'), t('BLOOD_AMOUNT_RANGE'));
    return;
  }

  setUpdatingDonation(true);

  try {
    const response = await fetch(serverPath(`/api/donation`), {
      method: 'POST',
      headers: {
        'Authorization': `bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        donatedAt: lastDonationDate, // Will be formatted as YYYY-MM-DD
        amountMl: amount,
        locationText: donationLocation || null,
        notes: notes || null,
        // donationCooldownMonths is fixed to 3 in backend
      }),
    });

    const result = await response.json();

      if (!response.ok) {
        Alert.alert(t('FAILED'), result.message || t('FAILED_RECORD_DONATION'));
      } else if (result.status === "failure") {
        Alert.alert(t('FAILED'), result.message || t('FAILED_RECORD_DONATION'));
      } else 
      {
        Alert.alert(t('SUCCESS'), t('DONATION_RECORDED_SUCCESS'));
        setAmountMl('450')
        setNotes('')
        setDonationLocation("")
        setLastDonationDate("")
      }
  } catch (e) {
    console.log('Donation record error:', e);
    Alert.alert(t('FAILED'), t('CHECK_CONNECTION_TRY_AGAIN'));
  } finally {
    setUpdatingDonation(false);
  }
};

  // Handle logout
  const handleLogout = () => {
    Alert.alert(
      t('LOGOUT_CONFIRMATION_TITLE'),
      t('LOGOUT_CONFIRMATION_MESSAGE'),
      [
        { text: t('CANCEL'), style: 'cancel' },
        { text: t('LOGOUT'), style: 'destructive', onPress: () => {
          logout()
          router.replace("login");
        } },
      ]
    );
  };

  // Calculate cooldown status
  const getCooldownStatus = useCallback(() => {
    if (!user?.cooldownEndsAt) return null;
    
    const now = new Date();
    const cooldownEnd = new Date(user.cooldownEndsAt);
    
    if (now < cooldownEnd) {
      const diffTime = cooldownEnd - now;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      let a = t('CAN_DONATE_IN_DAYS', { days: diffDays + (isRTL ? "" : ` day${(diffDays !== 1 ? 's' : '')}`) })
      console.log(a)
      return a;
    }
    
    return t('ELIGIBLE_TO_DONATE');
  }, [user?.cooldownEndsAt]);

  const cooldownStatus = getCooldownStatus();

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
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>{t('MY_PROFILE')}</Text>
            <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
              <Text style={styles.logoutText}>{t('LOGOUT')}</Text>
            </TouchableOpacity>
          </View>

          {/* Profile Image */}
          <View style={styles.avatarWrap}>
            <TouchableOpacity onPress={handleImageUpload} style={styles.avatarTouchable}>
              <View style={styles.avatar}>
                {profileImage ? (
                  <Image source={getImageSource()} style={styles.avatarImage} />
                ) : (
                  <Text style={styles.avatarPlaceholder}>🩸</Text>
                )}
                <View style={[
                  styles.avatarOverlay,
                  isRTL ? styles.avatarOverlayRTL : styles.avatarOverlayLTR
                ]}>
                  <Text style={styles.avatarOverlayText}>✎</Text>
                </View>
              </View>
            </TouchableOpacity>
            <Text style={styles.avatarLabel}>
              {profileImage ? t('CHANGE_PHOTO') : t('ADD_PROFILE_PHOTO')}
            </Text>
          </View>

          {/* Blood Donation Status */}
          {cooldownStatus && (
            <View style={[styles.cooldownCard, isRTL && {direction: "rtl"}]}>
              <Text style={styles.cooldownTitle}>{t('DONATION_STATUS')}</Text>
              <Text style={[
                styles.cooldownText,
                cooldownStatus.includes('eligible') && styles.cooldownEligible
              ]}>
                {cooldownStatus}
              </Text>
              {user?.lastDonationDate && (
                <Text style={styles.lastDonationText}>
                  {t('LAST_DONATION')}: {(new Date(user.lastDonationDate)).toLocaleDateString()}
                </Text>
              )}
            </View>
          )}

          {/* Verification Status */}
          <View style={[
            styles.verificationCard,
            user?.isVerified ? styles.verifiedCard : styles.unverifiedCard
          ]}>
            <View style={styles.verificationHeader}>
              <View style={styles.verificationTitleContainer}>
                <Text style={styles.verificationIcon}>
                  {user?.isVerified ? '✅' : '📧'}
                </Text>
                <View>
                  <Text style={styles.verificationTitle}>
                    {user?.isVerified ? t('ACCOUNT_VERIFIED') : t('VERIFY_YOUR_ACCOUNT')}
                  </Text>
                  <Text style={styles.verificationSubtitle}>
                    {user?.isVerified ? t('TRUSTED_DONOR') : t('INCREASE_CREDIBILITY')}
                  </Text>
                </View>
              </View>
              
              {user?.isVerified ? (
                <View style={styles.verifiedBadge}>
                  <Text style={styles.verifiedText}>{t('VERIFIED')}</Text>
                </View>
              ) : (
                <TouchableOpacity 
                  style={[
                    styles.verifyButton,
                    sendingVerification && styles.verifyButtonDisabled
                  ]}
                  onPress={handleSendVerification}
                  disabled={sendingVerification}
                >
                  {sendingVerification ? (
                    <ActivityIndicator color="#FFFFFF" size="small" />
                  ) : (
                    <>
                      <Text style={styles.verifyButtonText}>{t('VERIFY_NOW')}</Text>
                      <Text style={styles.verifyButtonIcon}>→</Text>
                    </>
                  )}
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Personal Information Card */}
          <View style={styles.card}>
            <Text style={[styles.sectionTitle, isRTL && {direction: "rtl"}]}>{t('PERSONAL_INFORMATION')}</Text>

            <GeneralInput
              label={t('FULL_NAME') + " *"}
              placeholder={t('FULL_NAME_PLACEHOLDER')}
              value={fullName}
              onChangeText={setFullName}
              onBlur={() => setTouched(t => ({ ...t, fullName: true }))}
              error={errors.fullName}
              returnKeyType="next"
              isRTL={isRTL}
              writingDirection={writingDirection}
              styles={styles}
              icon="👤"
            />

            <GeneralInput
              label={t('EMAIL_ADDRESS') + " *"}
              placeholder={t('EMAIL_PLACEHOLDER')}
              value={email}
              onChangeText={setEmail}
              onBlur={() => setTouched(t => ({ ...t, email: true }))}
              keyboardType="email-address"
              autoCapitalize="none"
              isRTL={isRTL}
              writingDirection={writingDirection}
              styles={styles}
              error={errors.email}
              returnKeyType="next"
              icon="📧"
            />

            <GeneralInput
              label={t('MOBILE_NUMBER') + " *"}
              placeholder={t('PHONE_PLACEHOLDER')}
              value={phone}
              onChangeText={setPhone}
              onBlur={() => setTouched(t => ({ ...t, phone: true }))}
              keyboardType="phone-pad"
              error={errors.phone}
              isRTL={isRTL}
              writingDirection={writingDirection}
              styles={styles}
              returnKeyType="next"
              icon="📱"
            />

            <GeneralInput
              label={t('NEW_PASSWORD_OPTIONAL')}
              placeholder="••••••"
              value={password}
              onChangeText={setPassword}
              onBlur={() => setTouched(t => ({ ...t, password: true }))}
              error={errors.password}
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

          {/* Blood & Location Information Card */}
          <View style={styles.card}>
            <Text style={[styles.sectionTitle, isRTL && {direction: "rtl"}]}>{t('BLOOD_LOCATION_INFORMATION')}</Text>

            {/* Blood Group Selection */}
            <Text style={styles.label}>{t('BLOOD_GROUP')} *</Text>
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
              {errors.bloodGroup && <Text style={styles.error}>{errors.bloodGroup}</Text>}
            </View>

            {/* Province Dropdown */}
            <ProvinceDropdown
              setTouched={setTouched}
              setProvince={setProvince}
              touched={touched}
              province={province}
            />

            {/* Location Text */}
            <GeneralInput
              label={t('YOUR_LOCATION') + " *"}
              placeholder={t('LOCATION_PLACEHOLDER')}
              value={locationText}
              onChangeText={setLocationText}
              onBlur={() => setTouched(t => ({ ...t, locationText: true }))}
              error={errors.locationText}
              icon="📍"
              isRTL={isRTL}
              writingDirection={writingDirection}
              styles={styles}
            />

            {/* Location Permission Section */}
            <View style={styles.locationPermissionCard}>
              <Text style={styles.permissionTitle}>{t('UPDATE_LOCATION_COORDINATES')}</Text>
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
            <View style={styles.toggleContainer}>
              <View style={styles.toggleTextContainer}>
                <Text style={styles.toggleLabel}>{t('SHOW_IN_DONOR_SEARCH')}</Text>
                <Text style={styles.toggleDescription}>
                  {t('SEARCH_VISIBILITY_DESCRIPTION')}
                </Text>
              </View>
              <TouchableOpacity
                style={[
                  styles.toggleBtn,
                  showAtSearch && styles.toggleBtnActive,
                ]}
                onPress={() => setShowAtSearch(!showAtSearch)}
              >
                <View style={[
                  styles.toggleKnob,
                  showAtSearch && (isRTL ? styles.toggleKnobActiveRTL : styles.toggleKnobActiveLTR),
                ]} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Blood Donation Record Card */}
          {(!user?.cooldownEndsAt || new Date() >= new Date(user.cooldownEndsAt)) && (
          <View style={styles.card}>
            <Text style={[styles.sectionTitle, isRTL && {direction: "rtl"}]}>{t('RECORD_BLOOD_DONATION')}</Text>
            
            {/* Donation Date with Date Picker */}
            <View style={{marginBottom: 16}}>
              <Text style={styles.label}>{t('DONATION_DATE')} *</Text>
              <TouchableOpacity 
                style={styles.dateInput}
                onPress={showDatepicker}
              >
                <Text style={[
                  styles.dateInputText,
                  !lastDonationDate && styles.dateInputPlaceholder
                ]}>
                  {lastDonationDate || t('SELECT_DONATION_DATE')}
                </Text>
                <Text style={styles.datePickerIcon}>📅</Text>
              </TouchableOpacity>
              {touched.lastDonationDate && !lastDonationDate && (
                <Text style={styles.error}>{t('SELECT_DONATION_DATE')}</Text>
              )}
            </View>

            {/* Blood Amount */}
            <GeneralInput
              label={t('BLOOD_AMOUNT_ML') + " *"}
              placeholder="e.g., 450"
              value={amountMl}
              onChangeText={setAmountMl}
              onBlur={() => setTouched(t => ({ ...t, amountMl: true }))}
              keyboardType="numeric"
              error={errors.amountMl}
              isRTL={isRTL}
              writingDirection={writingDirection}
              styles={styles}
              icon="💉"
            />

            {/* Donation Location */}
            <GeneralInput
              label={t('DONATION_LOCATION')}
              placeholder={t('DONATION_LOCATION_PLACEHOLDER')}
              value={donationLocation}
              onChangeText={setDonationLocation}
              multiline={true}
              numberOfLines={2}
              icon="🏥"
              isRTL={isRTL}
              writingDirection={writingDirection}
              styles={styles}
            />

            {/* Notes */}
            <GeneralInput
              label={t('NOTES_OPTIONAL')}
              placeholder={t('NOTES_PLACEHOLDER')}
              value={notes}
              onChangeText={setNotes}
              multiline={true}
              numberOfLines={3}
              icon="📝"
              isRTL={isRTL}
              writingDirection={writingDirection}
              styles={styles}
            />

            {/* Fixed Cooldown Period Info */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>{t('COOLDOWN_PERIOD')}</Text>
              <View style={styles.fixedCooldownContainer}>
                <Text style={styles.fixedCooldownText}>3 {t('MONTHS')} ({t('FIXED')})</Text>
                <Text style={styles.fixedCooldownHelp}>
                  {t('COOLDOWN_PERIOD_DESCRIPTION')}
                </Text>
              </View>
            </View>

            {showDatePicker && (
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={onDateChange}
                maximumDate={new Date()} // Prevent future dates
              />
            )}

            <TouchableOpacity
              style={[styles.donationBtn, (!lastDonationDate || !amountMl) && styles.disabledBtn]}
              onPress={handleRecordDonation}
              disabled={!lastDonationDate || !amountMl || updatingDonation}
            >
              {updatingDonation ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.donationBtnText}>{t('RECORD_DONATION')}</Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* Show message when user is in cooldown period */}
        {user?.cooldownEndsAt && new Date() < new Date(user.cooldownEndsAt) && (
          <View style={[styles.cooldownMessageCard, isRTL && {direction: "rtl"}]}>
            <Text style={styles.cooldownMessageTitle}>{t('DONATION_RECORD_UNAVAILABLE')}</Text>
            <Text style={styles.cooldownMessageText}>
              {t('CAN_RECORD_NEXT_DONATION_AFTER')} {new Date(user.cooldownEndsAt).toLocaleDateString()}. 
              {t('THANK_YOU_RECENT_DONATION')} 🩸
            </Text>
          </View>
        )}

          {/* Update Profile Button */}
          <TouchableOpacity
            style={[styles.primaryBtn, !isFormValid && styles.disabledBtn, {marginBottom: 35}]}
            onPress={handleUpdateProfile}
            disabled={!isFormValid || loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.primaryBtnText}>{t('UPDATE_PROFILE')}</Text>
            )}
          </TouchableOpacity>

          <View style={{ height: 16 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}