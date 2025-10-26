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
import { useRTLStyles } from '../../contexts/useRTLStyles';
import i18n from '../../utils/i18n';
import serverPath from '../../utils/serverPath';
import { COLORS, globalStyle } from '../../utils/styles';

const MIN_NAME = 2;
const MAX_NAME = 120;
const MAX_EMAIL = 180;
const MIN_SUBJECT = 3;
const MIN_MESSAGE = 3;

const ContactUsScreen = () => {
  const navigation = useNavigation();
  const { createRTLStyles, isRTL, writingDirection } = useRTLStyles();
  
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
      e.fullName = i18n.t('NAME_TOO_SHORT', { min: MIN_NAME });
    } else if (fullName.trim().length > MAX_NAME) {
      e.fullName = i18n.t('NAME_TOO_LONG', { max: MAX_NAME });
    }

    if (!email.trim()) {
      e.email = i18n.t('EMAIL_REQUIRED');
    } else if (email.trim().length > MAX_EMAIL) {
      e.email = i18n.t('EMAIL_TOO_LONG', { max: MAX_EMAIL });
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      e.email = i18n.t('EMAIL_INVALID');
    }

    if (!subject.trim() || subject.trim().length < MIN_SUBJECT) {
      e.subject = i18n.t('SUBJECT_TOO_SHORT', { min: MIN_SUBJECT });
    }

    if (!message.trim() || message.trim().length < MIN_MESSAGE) {
      e.message = i18n.t('MESSAGE_TOO_SHORT', { min: MIN_MESSAGE });
    }
    
    return e;
  }, [fullName, email, subject, message]);

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
        throw new Error(data?.message || i18n.t('SOMETHING_WENT_WRONG'));
      }

      Alert.alert(
        i18n.t('THANK_YOU'),
        i18n.t('CONTACT_SENT')
      );
      setFullName('');
      setEmail('');
      setSubject('');
      setMessage('');
      setTouched({});
    } catch (err) {
      Alert.alert(
        i18n.t('ERROR'), 
        err?.message || i18n.t('TRY_AGAIN')
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
            },
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
              {i18n.t('CONTACT_US')}
            </Text>
            <Text numberOfLines={1} style={styles.headerSubtitle}>
              {i18n.t('GET_IN_TOUCH')}
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
              label={i18n.t('FULL_NAME')}
              placeholder={i18n.t('ENTER_NAME')}
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
              label={i18n.t('EMAIL')}
              placeholder={i18n.t('ENTER_EMAIL')}
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
              label={i18n.t('SUBJECT')}
              placeholder={i18n.t('ENTER_SUBJECT')}
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

            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                {i18n.t('MESSAGE')} *
              </Text>
              <Input
                placeholder={i18n.t('ENTER_MESSAGE')}
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
                      {i18n.t('SEND_MESSAGE')}
                    </Text>
                  </>
                )}
              </LinearGradient>
            </Pressable>

            {/* Helper Text */}
            <View style={styles.helperContainer}>
              <Ionicons name="time-outline" size={14} color={COLORS.muted} />
              <Text style={styles.helperText}>
                {i18n.t('WE_REPLY_SOON')}
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ContactUsScreen;