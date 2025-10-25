// app/screens/ContactUsScreen.tsx
import { Ionicons } from '@expo/vector-icons';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Input from '../../components/GeneralInput';
import { useLanguage } from '../../contexts/LanguageContext';
import { useRTLStyles } from '../../contexts/useRTLStyles';
import serverPath from '../../utils/serverPath';
import { globalStyle } from '../../utils/styles';
const COLORS = {
  primary: '#E73C3C',
  primaryDark: '#C42525',
  primaryLight: '#FEF2F2',
  text: '#1E1E1E',
  textLight: '#4A4A4A',
  muted: '#7E7E7E',
  bg: '#FFFFFF',
  border: '#E8E8E8',
  borderLight: '#F0F0F0',
  success: '#16a34a',
  error: '#dc2626',
  errorLight: '#FEF2F2',
};

const MIN_NAME = 2;
const MAX_NAME = 120;
const MAX_EMAIL = 180;
const MIN_SUBJECT = 3;
const MIN_MESSAGE = 3;

const ContactUsScreen = () => {
  const navigation = useNavigation();
  const { createRTLStyles, isRTL, writingDirection } = useRTLStyles();
  const { t } = useLanguage();
  
  const styles = createRTLStyles(globalStyle);
  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({});

  // Validation with localized error messages
  const errors = useMemo(() => {
    const e = {};
    
    if (!fullName.trim() || fullName.trim().length < MIN_NAME) {
      e.fullName = t?.('NAME_TOO_SHORT', `Must be at least ${MIN_NAME} characters`) || `Must be at least ${MIN_NAME} characters`;
    } else if (fullName.trim().length > MAX_NAME) {
      e.fullName = t?.('NAME_TOO_LONG', `Must be ≤ ${MAX_NAME} characters`) || `Must be ≤ ${MAX_NAME} characters`;
    }

    if (!email.trim()) {
      e.email = t?.('EMAIL_REQUIRED', 'Email is required') || 'Email is required';
    } else if (email.trim().length > MAX_EMAIL) {
      e.email = t?.('EMAIL_TOO_LONG', `Must be ≤ ${MAX_EMAIL} characters`) || `Must be ≤ ${MAX_EMAIL} characters`;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      e.email = t?.('EMAIL_INVALID', 'Invalid email') || 'Invalid email';
    }

    if (!subject.trim() || subject.trim().length < MIN_SUBJECT) {
      e.subject = t?.('SUBJECT_TOO_SHORT', `Must be at least ${MIN_SUBJECT} characters`) || `Must be at least ${MIN_SUBJECT} characters`;
    }

    if (!message.trim() || message.trim().length < MIN_MESSAGE) {
      e.message = t?.('MESSAGE_TOO_SHORT', `Must be at least ${MIN_MESSAGE} characters`) || `Must be at least ${MIN_MESSAGE} characters`;
    }
    
    return e;
  }, [fullName, email, subject, message, t]);

  const isValid = Object.keys(errors).length === 0;

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const onSubmit = async () => {
    setTouched({ fullName: true, email: true, subject: true, message: true });
    if (!isValid) return;

    try {
      setLoading(true);
      const payload = {
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        subject: subject.trim(),
        message: message.trim(),
      };

      const res = await fetch(serverPath('/api/contact'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || data?.status === 'failure') {
        throw new Error(data?.message || t?.('SOMETHING_WENT_WRONG', 'Something went wrong') || 'Something went wrong');
      }

      Alert.alert(
        t?.('THANK_YOU', 'Thank you!') || 'Thank you!',
        t?.('CONTACT_SENT', 'Your message has been sent.') || 'Your message has been sent.'
      );
      setFullName('');
      setEmail('');
      setSubject('');
      setMessage('');
      setTouched({});
    } catch (err) {
      Alert.alert(
        t?.('ERROR', 'Error') || 'Error', 
        err?.message || (t?.('TRY_AGAIN', 'Please try again.') || 'Please try again.')
      );
    } finally {
      setLoading(false);
    }
  };


  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      {/* Enhanced Header matching your tabs layout style */}
      <View style={styles.headerWrap}>
        <LinearGradient
          colors={[COLORS.primary, COLORS.primaryDark]}
          style={[
            {
              paddingTop: Platform.OS === 'ios' ? 50 : 40,
              paddingBottom: 16,
              alignItems: 'center',
              position: 'relative',
              overflow: 'hidden',
            },,
            {
              flexDirection: isRTL ? 'row-reverse' : 'row',
              borderBottomLeftRadius: 24,
              borderBottomRightRadius: 24,
            },
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          {/* Decorative circles like in your tabs layout */}
          <View style={styles.decoCircleBig} />
          <View style={styles.decoCircleSmall} />

          {/* Menu button */}
          <Pressable 
            onPress={openDrawer} 
            style={({ pressed }) => [
              styles.iconBtn, 
              { marginHorizontal: 16 },
              pressed && styles.iconBtnPressed
            ]}
          >
            {({ pressed }) => (
              <View style={[
                styles.iconContainer,
                {
                  transform: [{ scale: pressed ? 0.9 : 1 }]
                }
              ]}>
                <Ionicons name="menu" size={22} color="#fff" />
              </View>
            )}
          </Pressable>

          {/* Center title */}
          <View style={styles.titleBox}>
            <Text numberOfLines={1} style={styles.headerTitle}>
              {t?.('CONTACT_US', 'Contact Us') || 'Contact Us'}
            </Text>
            <Text numberOfLines={1} style={styles.headerSubtitle}>
              {t?.('GET_IN_TOUCH', 'Get in touch with us') || 'Get in touch with us'}
            </Text>
          </View>

          {/* Right placeholder for balance */}
          <View style={styles.iconBtn} />
          <View style={styles.iconBtn} />
        </LinearGradient>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.select({ ios: 'padding', android: undefined })}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.select({ ios: 0, android: 0 })}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Contact Illustration/Icon */}
          <View style={styles.contactIconContainer}>
            <LinearGradient
              colors={[COLORS.primaryLight, '#FFF5F5']}
              style={styles.contactIconBackground}
            >
              <Ionicons name="mail-outline" size={32} color={COLORS.primary} />
            </LinearGradient>
          </View>

          {/* Form Container with Card-like Design */}
          <View style={styles.formContainer}>
            {/* Full Name */}
            <Input
              label={t?.('FULL_NAME', 'Full Name') || 'Full Name'}
              placeholder={t?.('ENTER_NAME', 'Enter your full name') || 'Enter your full name'}
              value={fullName}
              onChangeText={setFullName}
              onBlur={() => setTouched(t => ({ ...t, fullName: true }))}
              error={touched.fullName ? errors.fullName : undefined}
              returnKeyType="next"
              icon="👤"
              isRTL={isRTL}
              writingDirection={writingDirection}
              styles={styles}
            />

            {/* Email */}
            <Input
              label={t?.('EMAIL', 'Email') || 'Email'}
              placeholder={t?.('ENTER_EMAIL', 'Enter your email') || 'Enter your email'}
              value={email}
              onChangeText={setEmail}
              onBlur={() => setTouched(t => ({ ...t, email: true }))}
              error={touched.email ? errors.email : undefined}
              keyboardType="email-address"
              autoCapitalize="none"
              returnKeyType="next"
              icon="📧"
              isRTL={isRTL}
              writingDirection={writingDirection}
              styles={styles}
            />

            {/* Subject */}
            <Input
              label={t?.('SUBJECT', 'Subject') || 'Subject'}
              placeholder={t?.('ENTER_SUBJECT', 'What is your message about?') || 'What is your message about?'}
              value={subject}
              onChangeText={setSubject}
              onBlur={() => setTouched(t => ({ ...t, subject: true }))}
              error={touched.subject ? errors.subject : undefined}
              returnKeyType="next"
              icon="📝"
              isRTL={isRTL}
              writingDirection={writingDirection}
              styles={styles}
            />

            {/* Message - Using custom textarea style since GeneralInput might not support multiline by default */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                {t?.('MESSAGE', 'Message') || 'Message'} *
              </Text>
              <Input
                placeholder={t?.('ENTER_MESSAGE', 'Write your message...') || 'Write your message...'}
                value={message}
                onChangeText={setMessage}
                onBlur={() => setTouched(t => ({ ...t, message: true }))}
                error={touched.message ? errors.message : undefined}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
                style={styles.textarea}
                icon="💬"
                isRTL={isRTL}
                writingDirection={writingDirection}
                styles={styles}
              />
            </View>

            {/* Submit Button */}
            <Pressable
              onPress={onSubmit}
              disabled={loading || !isValid}
              style={({ pressed }) => [
                styles.button,
                pressed && styles.buttonPressed,
                (!isValid || loading) && styles.buttonDisabled,
              ]}
            >
              <LinearGradient
                colors={[COLORS.primary, COLORS.primaryDark]}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <>
                    <Ionicons name="send-outline" size={18} color="#fff" style={styles.buttonIcon} />
                    <Text style={styles.buttonText}>
                      {t?.('SEND_MESSAGE', 'Send Message') || 'Send Message'}
                    </Text>
                  </>
                )}
              </LinearGradient>
            </Pressable>

            {/* Helper Text */}
            <View style={styles.helperContainer}>
              <Ionicons name="time-outline" size={14} color={COLORS.muted} />
              <Text style={styles.helperText}>
                {t?.('WE_REPLY_SOON', 'We typically reply within 24 hours') || 'We typically reply within 24 hours'}
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ContactUsScreen;
