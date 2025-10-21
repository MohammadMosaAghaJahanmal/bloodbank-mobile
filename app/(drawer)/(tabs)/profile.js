// app/profile.js
import DateTimePicker from '@react-native-community/datetimepicker';
import { router, useNavigation } from 'expo-router';
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
import serverPath from '../../../utils/serverPath';
import { globalStyle } from '../../../utils/styles';

export default function ProfileScreen() {
  const { createRTLStyles, isRTL } = useRTLStyles();
  const styles = createRTLStyles(globalStyle);
  
  const navigation = useNavigation();
  const { user, token, logout, saveTokenAndLogin } = useContext(AuthContext);
  
  const [loading, setLoading] = useState(false);
  const [updatingDonation, setUpdatingDonation] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

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

  // Validation
  const errors = useMemo(() => {
    const e = {};
    if (touched.fullName && fullName.trim().length < 3) e.fullName = 'Enter your full name';
    if (touched.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Enter a valid email';
    if (touched.phone && !/^\+?\d{8,15}$/.test(phone)) e.phone = 'Enter a valid mobile number';
    if (touched.password && password && password.length < 6) e.password = 'Minimum 6 characters required';
    if (touched.bloodGroup && !bloodGroup) e.bloodGroup = 'Please select your blood group';
    if (touched.locationText && locationText.trim().length < 3) e.locationText = 'Enter your location';
    if (touched.province && !province) e.province = 'Please select your province';
    if (touched.amountMl) {
      const amount = parseInt(amountMl);
      if (!amountMl || isNaN(amount)) {
        e.amountMl = 'Please enter blood amount';
      } else if (amount < 1 || amount > 1000) {
        e.amountMl = 'Blood amount must be between 1-1000 ml';
      }
    }
      
    if (touched.lastDonationDate && !lastDonationDate) {
      e.lastDonationDate = 'Please select donation date';
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
      'Update Profile Photo',
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
          text: 'Remove Photo',
          onPress: () => setProfileImage(null),
          style: 'destructive',
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
        Alert.alert('Update Failed', result.message || 'Please try again later.');
      } else if (result.status === "failure") {
        Alert.alert('Update Failed', result.message || 'Please try again later.');
      } else 
      {
        Alert.alert('Success', 'Profile updated successfully!');
        if (result.user) {
          saveTokenAndLogin(token, result.user);
        }
      }
    } catch (e) {
      console.log('Update error:', e);
      Alert.alert('Update Failed', 'Please check your connection and try again.');
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
        Alert.alert('Verification Failed', result.message || 'Failed to send verification email. Please try again.');
      } else if (result.status === "failure") {
        Alert.alert('Verification Failed', result.message || 'Failed to send verification email. Please try again.');
      } else 
      {
        Alert.alert(
          'Verification Sent', 
          'A verification email has been sent to your email address. Please check your inbox and follow the instructions to verify your account.',
          [{ text: 'OK' }]
        );
      }

  } catch (e) {
    console.log('Verification error:', e);
    Alert.alert('Verification Failed', 'Please check your connection and try again.');
  } finally {
    setSendingVerification(false);
  }
};
  // Record blood donation
const handleRecordDonation = async () => {
  if (!lastDonationDate || !amountMl) {
    Alert.alert('Error', 'Please fill all required donation fields.');
    return;
  }

  const amount = parseInt(amountMl);
  if (isNaN(amount) || amount < 1 || amount > 1000) {
    Alert.alert('Error', 'Blood amount must be between 1-1000 ml');
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
        Alert.alert('Failed', result.message || 'Failed to record donation.');
      } else if (result.status === "failure") {
        Alert.alert('Failed', result.message || 'Failed to record donation.');
      } else 
      {
        Alert.alert('Success', 'Blood donation recorded successfully!');
        setAmountMl('450')
        setNotes('')
        setDonationLocation("")
        setLastDonationDate("")
      }
  } catch (e) {
    console.log('Donation record error:', e);
    Alert.alert('Failed', 'Please check your connection and try again.');
  } finally {
    setUpdatingDonation(false);
  }
};

  // Handle logout
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: () => {
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
      return `You can donate blood again in ${diffDays} day${diffDays !== 1 ? 's' : ''}`;
    }
    
    return 'You are eligible to donate blood now!';
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
            <Text style={styles.title}>My Profile</Text>
            <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
              <Text style={styles.logoutText}>Logout</Text>
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
              {profileImage ? 'Change Photo' : 'Add Profile Photo'}
            </Text>
          </View>

          {/* Blood Donation Status */}
          {cooldownStatus && (
            <View style={styles.cooldownCard}>
              <Text style={styles.cooldownTitle}>Donation Status</Text>
              <Text style={[
                styles.cooldownText,
                cooldownStatus.includes('eligible') && styles.cooldownEligible
              ]}>
                {cooldownStatus}
              </Text>
              {user?.lastDonationDate && (
                <Text style={styles.lastDonationText}>
                  Last donation: {new Date(user.lastDonationDate).toLocaleDateString()}
                </Text>
              )}
            </View>
          )}

          {/* Personal Information Card */}
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
                    {user?.isVerified ? 'Account Verified' : 'Verify Your Account'}
                  </Text>
                  <Text style={styles.verificationSubtitle}>
                    {user?.isVerified ? 'Trusted donor' : 'Increase your credibility'}
                  </Text>
                </View>
              </View>
              
              {user?.isVerified ? (
                <View style={styles.verifiedBadge}>
                  <Text style={styles.verifiedText}>Verified</Text>
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
                      <Text style={styles.verifyButtonText}>Verify Now</Text>
                      <Text style={styles.verifyButtonIcon}>→</Text>
                    </>
                  )}
                </TouchableOpacity>
              )}
            </View>
          </View>
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Personal Information</Text>

            <GeneralInput
              label="Full Name *"
              placeholder="e.g. Khan"
              value={fullName}
              onChangeText={setFullName}
              onBlur={() => setTouched(t => ({ ...t, fullName: true }))}
              error={errors.fullName}
              returnKeyType="next"
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
              error={errors.email}
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
              error={errors.phone}
              returnKeyType="next"
              icon="📱"
            />

            <GeneralInput
              label="New Password (leave empty to keep current)"
              placeholder="••••••"
              value={password}
              onChangeText={setPassword}
              onBlur={() => setTouched(t => ({ ...t, password: true }))}
              error={errors.password}
              secureTextEntry={!showPass}
              icon="🔒"
              right={
                <TouchableOpacity onPress={() => setShowPass(s => !s)}>
                  <Text style={styles.eye}>{showPass ? 'Hide' : 'Show'}</Text>
                </TouchableOpacity>
              }
            />
          </View>

          {/* Blood & Location Information Card */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Blood & Location Information</Text>

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
              label="Your Location *"
              placeholder="Kandahar District #3"
              value={locationText}
              onChangeText={setLocationText}
              onBlur={() => setTouched(t => ({ ...t, locationText: true }))}
              error={errors.locationText}
              icon="📍"
            />

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

          {/* Blood Donation Record Card */}
          {(!user?.cooldownEndsAt || new Date() >= new Date(user.cooldownEndsAt)) && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Record Blood Donation</Text>
            
            {/* Donation Date with Date Picker */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Donation Date *</Text>
              <TouchableOpacity 
                style={styles.dateInput}
                onPress={showDatepicker}
              >
                <Text style={[
                  styles.dateInputText,
                  !lastDonationDate && styles.dateInputPlaceholder
                ]}>
                  {lastDonationDate || 'Select donation date'}
                </Text>
                <Text style={styles.datePickerIcon}>📅</Text>
              </TouchableOpacity>
              {touched.lastDonationDate && !lastDonationDate && (
                <Text style={styles.error}>Please select donation date</Text>
              )}
            </View>

            {/* Blood Amount */}
            <GeneralInput
              label="Blood Amount (ml) *"
              placeholder="e.g., 450"
              value={amountMl}
              onChangeText={setAmountMl}
              onBlur={() => setTouched(t => ({ ...t, amountMl: true }))}
              keyboardType="numeric"
              error={errors.amountMl}
              icon="💉"
            />

            {/* Donation Location */}
            <GeneralInput
              label="Donation Location"
              placeholder="e.g., Red Cross Center, City Hospital"
              value={donationLocation}
              onChangeText={setDonationLocation}
              multiline={true}
              numberOfLines={2}
              icon="🏥"
            />

            {/* Notes */}
            <GeneralInput
              label="Notes (Optional)"
              placeholder="Any additional notes about your donation..."
              value={notes}
              onChangeText={setNotes}
              multiline={true}
              numberOfLines={3}
              icon="📝"
            />

            {/* Fixed Cooldown Period Info */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Cooldown Period</Text>
              <View style={styles.fixedCooldownContainer}>
                <Text style={styles.fixedCooldownText}>3 months (fixed)</Text>
                <Text style={styles.fixedCooldownHelp}>
                  Standard waiting period between blood donations. You will be automatically available for donation search after this period.
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
                <Text style={styles.donationBtnText}>Record Donation</Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* Show message when user is in cooldown period */}
        {user?.cooldownEndsAt && new Date() < new Date(user.cooldownEndsAt) && (
          <View style={styles.cooldownMessageCard}>
            <Text style={styles.cooldownMessageTitle}>Donation Record Unavailable</Text>
            <Text style={styles.cooldownMessageText}>
              You can record your next blood donation after {new Date(user.cooldownEndsAt).toLocaleDateString()}. 
              Thank you for your recent donation! 🩸
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
              <Text style={styles.primaryBtnText}>Update Profile</Text>
            )}
          </TouchableOpacity>

          <View style={{ height: 16 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}