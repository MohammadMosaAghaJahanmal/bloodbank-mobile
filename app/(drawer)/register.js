import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  PermissionsAndroid,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRTLStyles } from '../../contexts/useRTLStyles'; // Adjust path as needed
import { globalStyle } from '../../utils/styles';

const PRIMARY = '#E73C3C';
const PRIMARY_DARK = '#C42525';
const BG = '#FDF2F2';
const TEXT = '#1E1E1E';
const MUTED = '#7E7E7E';
const BORDER = '#E8E8E8';

export default function RegisterScreen({ navigation }) {
  const { createRTLStyles, isRTL } = useRTLStyles();
  const styles = createRTLStyles(globalStyle);
  
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
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'This app needs access to your location to help people find donors nearby.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
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
    return e;
  }, [bloodGroup, locationText, touched]);

  const isStep1Valid = 
    fullName.trim().length >= 3 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
    /^\+?\d{8,15}$/.test(phone) &&
    password.length >= 6;

  const isStep2Valid = 
    bloodGroup && 
    locationText.trim().length >= 3;

  // Get current location using device GPS
  const getCurrentLocation = () => {
    setLocationLoading(true);

    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude: lat, longitude: lng } = position.coords;
        setLatitude(lat.toString());
        setLongitude(lng.toString());
        setLocationLoading(false);
        
        // Reverse geocoding to get address from coordinates
        getAddressFromCoordinates(lat, lng);
      },
      (error) => {
        setLocationLoading(false);
        console.log('Location error:', error);
        Alert.alert(
          'Location Error',
          'Unable to get your current location. Please make sure location services are enabled and try again.',
          [{ text: 'OK' }]
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      }
    );
  };

  // Reverse geocoding to get address from coordinates
  const getAddressFromCoordinates = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      
      if (data && data.display_name) {
        setLocationText(data.display_name);
      }
    } catch (error) {
      console.log('Reverse geocoding error:', error);
      // If reverse geocoding fails, user can still manually enter location text
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
    formData.append('bloodGroup', bloodGroup);
    formData.append('locationText', locationText);
    formData.append('latitude', latitude);
    formData.append('longitude', longitude);
    formData.append('showAtSearch', showAtSearch.toString());

    console.log('Submitting data:', {
      fullName,
      email,
      phone,
      bloodGroup,
      locationText,
      latitude,
      longitude,
      showAtSearch,
      hasProfileImage: !!profileImage,
    });

    // Simulate API call - replace with your actual API endpoint
    try {
      setTimeout(() => {
        setLoading(false);
        Alert.alert(
          'Registration Successful! 🎉',
          'Thank you for joining our blood donor community. You can now save lives!',
          [
            {
              text: 'Get Started',
              onPress: () => navigation?.navigate?.('HomeScreen'),
            },
          ]
        );
      }, 2000);
    } catch (error) {
      setLoading(false);
      Alert.alert('Registration Failed', 'Please try again later.');
    }
  };

  // RTL-aware Input component
  const Input = ({
    label,
    value,
    onChangeText,
    placeholder,
    keyboardType = 'default',
    secureTextEntry,
    returnKeyType,
    onBlur,
    error,
    icon,
    right,
    autoCapitalize = 'sentences',
  }) => {
    return (
      <View style={{ marginBottom: 16 }}>
        <Text style={styles.label}>{label}</Text>
        <View style={[styles.inputWrap, !!error && styles.inputError]}>
          {icon && <Text style={styles.inputIcon}>{icon}</Text>}
          <TextInput
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={MUTED}
            style={[
              styles.input, 
              icon && styles.inputWithIcon,
              isRTL && styles.inputRTL
            ]}
            keyboardType={keyboardType}
            secureTextEntry={secureTextEntry}
            returnKeyType={returnKeyType}
            onBlur={onBlur}
            autoCapitalize={autoCapitalize}
            textAlign={isRTL ? 'right' : 'left'}
          />
          {right ? <View style={styles.inputRight}>{right}</View> : null}
        </View>
        {!!error && <Text style={styles.error}>{error}</Text>}
      </View>
    );
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
                <Input
                  label="Full Name *"
                  placeholder="e.g. John Smith"
                  value={fullName}
                  onChangeText={setFullName}
                  onBlur={() => setTouched(t => ({ ...t, fullName: true }))}
                  error={step1Errors.fullName}
                  returnKeyType="next"
                  icon="👤"
                />

                <Input
                  label="Email Address *"
                  placeholder="john@example.com"
                  value={email}
                  onChangeText={setEmail}
                  onBlur={() => setTouched(t => ({ ...t, email: true }))}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  error={step1Errors.email}
                  returnKeyType="next"
                  icon="📧"
                />

                <Input
                  label="Mobile Number *"
                  placeholder="+1 604 123 4567"
                  value={phone}
                  onChangeText={setPhone}
                  onBlur={() => setTouched(t => ({ ...t, phone: true }))}
                  keyboardType="phone-pad"
                  error={step1Errors.phone}
                  returnKeyType="next"
                  icon="📱"
                />

                <Input
                  label="Password *"
                  placeholder="••••••"
                  value={password}
                  onChangeText={setPassword}
                  onBlur={() => setTouched(t => ({ ...t, password: true }))}
                  error={step1Errors.password}
                  secureTextEntry={!showPass}
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
                <View style={styles.fieldContainer}>
                  <Text style={styles.label}>Blood Group *</Text>
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

                {/* Location Text */}
                <Input
                  label="Your Location *"
                  placeholder="e.g. Downtown Medical Center, New York"
                  value={locationText}
                  onChangeText={setLocationText}
                  onBlur={() => setTouched(t => ({ ...t, locationText: true }))}
                  error={step2Errors.locationText}
                  icon="📍"
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
                    <Text style={styles.primaryBtnText}>Complete Registration</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation?.navigate?.('LoginScreen')}>
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