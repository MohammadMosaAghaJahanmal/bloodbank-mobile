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
import { useRTLStyles } from '../../../contexts/useRTLStyles';
import serverPath from '../../../utils/serverPath';
import { globalStyle } from '../../../utils/styles';

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

  // Validation for step 1
  const step1Errors = useMemo(() => {
    const e = {};
    if (touched.fullName && fullName.trim().length < 3) e.fullName = 'Enter your full name';
    if (touched.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Enter a valid email';
    if (touched.phone && !/^\+?\d{8,15}$/.test(phone)) e.phone = 'Enter a valid mobile number';
    if (touched.password && password.length < 6) e.password = 'Minimum 6 characters required';
    return e;
  }, [fullName, email, phone, password, touched]);

  // Validation for step 2
  const step2Errors = useMemo(() => {
    const e = {};
    if (touched.bloodGroup && !bloodGroup) e.bloodGroup = 'Please select your blood group';
    if (touched.locationText && locationText.trim().length < 3) e.locationText = 'Enter your location';
    if (touched.province && !province) e.province = 'Please select your province';

    return e;
  }, [bloodGroup, locationText, touched, province]);

  const isStep1Valid = 
    fullName.trim().length >= 3 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
    /^\+?\d{8,15}$/.test(phone) &&
    password.length >= 6 

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
          'Permission Denied',
          'Location permission is required to get your current location. Please enable it in your device settings.',
          [{ text: 'OK' }]
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
          'Location Found', 
          'Coordinates saved successfully, but could not get exact address. You can manually enter your location.',
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert(
          'Location Error', 
          'Unable to get your current location. Please make sure location services are enabled and try again.',
          [{ text: 'OK' }]
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
      
      // setLocationText(`Location at ${lat.toFixed(6)}, ${lng.toFixed(6)}`);
      
    } catch (error) {
      console.log('Reverse geocoding error:', error);
      // setLocationText(`Location at ${lat.toFixed(6)}, ${lng.toFixed(6)}`);
    }
  };

  // Handle image selection from camera or gallery
  const handleImageUpload = () => {
    Alert.alert(
      'Upload Profile Photo',
      'Choose an option',
      [
        {
          text: 'Take Photo',
          onPress: () => takePhotoFromCamera(),
        },
        {
          text: 'Choose from Gallery',
          onPress: () => selectPhotoFromGallery(),
        },
        {
          text: 'Cancel',
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
        Alert.alert('Error', 'Failed to take photo: ' + response.error);
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
        Alert.alert('Error', 'Failed to select image: ' + response.error);
      } else if (response.assets && response.assets[0]) {
        const imageUri = response.assets[0].uri;
        setProfileImage(imageUri);
      }
    });
  };

  const handleNextStep = () => {
    if (step === 1 && isStep1Valid) {
      setStep(2);
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
    formData.append('province', province); // Add province to form data
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
      // Replace with your actual API endpoint
      const response = await fetch(serverPath('/api/user'), {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const result = await response.json();

      if(!response.ok)
        Alert.alert('Registration Failed', result.message || 'Please try again later.');
      else if(result.status === "failure")
        Alert.alert('Registration Failed', result.message || 'Please try again later.');
      else if (response.ok) {
        Alert.alert(
          'Registration Successful! 🎉',
          'Thank you for joining our blood donor community. You can now save lives!',
          [
            {
              text: 'Get Started',
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
      Alert.alert('Registration Failed', 'Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  // Custom Province Dropdown Component
// Custom Province Dropdown Component

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
            <Text style={styles.title}>Join Blood Donors</Text>
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
                      <Text style={styles.avatarPlaceholder}>🩸</Text>
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
                  {profileImage ? 'Change Photo' : 'Add Profile Photo'}
                </Text>
              </View>

              {/* Form */}
              <View style={styles.card}>
                <GeneralInput
                  label="Full Name *"
                  placeholder="e.g. Khan"
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
                  label="Email Address *"
                  placeholder="example@email.com"
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
                  label="Mobile Number *"
                  placeholder="0712345678"
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
                  label="Password *"
                  placeholder="••••••"
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
                      <Text style={styles.eye}>{showPass ? 'Hide' : 'Show'}</Text>
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
                <Text style={styles.primaryBtnText}>Continue to Blood Details</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Step 2: Blood & Location Information */}
          {step === 2 && (
            <View style={styles.stepContainer}>
              <View style={styles.card}>
                {/* Blood Group Selection */}
                <Text style={styles.label}>Blood Group *</Text>
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
                  label="Your Location *"
                  placeholder="Kandahar District #3"
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
                  <Text style={styles.permissionTitle}>Enable Location Services</Text>
                  <Text style={styles.permissionText}>
                    Get your exact coordinates automatically to help people find donors nearby accurately.
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
                          {latitude ? 'Update My Location' : 'Get My Location'}
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
                      <Text style={styles.coordinatesTitle}>📍 Current Coordinates:</Text>
                      <Text style={styles.coordinatesText}>
                        Latitude: {Number(latitude).toFixed(6)}
                      </Text>
                      <Text style={styles.coordinatesText}>
                        Longitude: {Number(longitude).toFixed(6)}
                      </Text>
                      <Text style={styles.coordinatesHelp}>
                        These coordinates will help people find you accurately
                      </Text>
                    </View>
                  )}
                </View>

                {/* Search Visibility Toggle */}
                <View style={styles.toggleContainer}>
                  <View style={styles.toggleTextContainer}>
                    <Text style={styles.toggleLabel}>Show in donor search</Text>
                    <Text style={styles.toggleDescription}>
                      Make your profile visible to people searching for blood donors in your area
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
                  <Text style={styles.secondaryBtnText}>Back</Text>
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
                    <Text style={styles.primaryBtnText}>Register</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation?.navigate?.('login')}>
              <Text style={[styles.footerText, styles.footerLink]}>
                Sign In
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 16 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}