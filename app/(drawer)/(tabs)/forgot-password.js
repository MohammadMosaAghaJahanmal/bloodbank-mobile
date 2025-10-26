import { useNavigation } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Input from '../../../components/GeneralInput';
import { useRTLStyles } from '../../../contexts/useRTLStyles';
import i18n from '../../../utils/i18n';
import serverPath from '../../../utils/serverPath';
import { globalStyle } from '../../../utils/styles';

export default function ForgotPasswordScreen() {
  const { createRTLStyles, isRTL, writingDirection } = useRTLStyles();
  const styles = createRTLStyles(globalStyle.forgot);
  const inputStyle = createRTLStyles(globalStyle);
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({});
  const [emailSent, setEmailSent] = useState(false);

  // Validation
  const errors = useMemo(() => {
    const e = {};
    
    if (touched.email && !email.trim()) {
      e.email = i18n.t('ENTER_EMAIL');
    } else if (touched.email && email.trim()) {
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      
      if (!isEmail) {
        e.email = i18n.t('INVALID_EMAIL');
      }
    }
    
    return e;
  }, [email, touched]);

  const isValid = 
    email.trim() && 
    !errors.email;

  // Handle forgot password submission
  const handleForgotPassword = async () => {
    if (!isValid || loading) return;

    setLoading(true);
    setTouched({ email: true });

    try {
      const forgotData = {
        email: email.trim(),
      };

      const res = await fetch(serverPath('/api/forgot'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(forgotData),
      });

      const data = await res.json();
      
      if (!res.ok) throw new Error(data?.message || i18n.t('FAILED_SEND_RESET_LINK'));

      if (data?.status === 'failure') {
        setLoading(false);
        Alert.alert(i18n.t('FAILED'), data.message);
        return;
      }

      setLoading(false);
      setEmailSent(true);
      
      Alert.alert(
        i18n.t('RESET_LINK_SENT'),
        i18n.t('CHECK_EMAIL_INSTRUCTIONS'),
        [{ text: i18n.t('OK') }]
      );

    } catch (err) {
      console.error('Forgot password error:', err);
      setLoading(false);

      const msg = String(err?.message || '')
        .toLowerCase();

      let errorMessage = i18n.t('FAILED_SEND_RESET_LINK_TRY_AGAIN');
      if (msg.includes('network request failed')) errorMessage = i18n.t('NETWORK_ERROR');
      else if (msg.includes('user not found')) errorMessage = i18n.t('NO_ACCOUNT_WITH_EMAIL');
      else if (msg.includes('email')) errorMessage = i18n.t('CHECK_EMAIL_TRY_AGAIN');

      Alert.alert(i18n.t('FAILED'), errorMessage);
    }
  };

  // Handle back to login
  const handleBackToLogin = () => {
    setEmail('');
    setEmailSent(false);
    navigation?.navigate?.('login');
  };

  // Handle create account navigation
  const handleCreateAccount = () => {
    setEmail('');
    setEmailSent(false);
    navigation?.navigate?.('register');
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
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>{i18n.t('RESET_PASSWORD')}</Text>
            <Text style={styles.subtitle}>
              {emailSent 
                ? i18n.t('CHECK_EMAIL_FOR_INSTRUCTIONS') 
                : i18n.t('ENTER_EMAIL_FOR_RESET_LINK')
              }
            </Text>
          </View>

          {/* Forgot Password Form */}
          <View style={styles.card}>
            {emailSent ? (
              <View style={styles.successContainer}>
                <Text style={styles.successIcon}>📧</Text>
                <Text style={styles.successTitle}>{i18n.t('CHECK_YOUR_EMAIL')}</Text>
                <Text style={styles.successText}>
                  {i18n.t('WE_SENT_INSTRUCTIONS_TO')}{'\n'}
                  <Text style={styles.emailText}>{email}</Text>
                </Text>
                
                <TouchableOpacity
                  style={styles.resendButton}
                  onPress={handleForgotPassword}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#FFFFFF" size="small" />
                  ) : (
                    <Text style={styles.resendButtonText}>{i18n.t('RESEND_EMAIL')}</Text>
                  )}
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <Input
                  label={i18n.t('EMAIL_ADDRESS')}
                  placeholder={i18n.t('ENTER_YOUR_EMAIL')}
                  value={email}
                  onChangeText={setEmail}
                  onBlur={() => setTouched(t => ({ ...t, email: true }))}
                  error={errors.email}
                  returnKeyType="send"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  icon="📧"
                  isRTL={isRTL}
                  writingDirection={writingDirection}
                  styles={inputStyle}
                />

                {/* Reset Button */}
                <TouchableOpacity
                  style={[styles.resetButton, !isValid && styles.disabledButton]}
                  onPress={handleForgotPassword}
                  activeOpacity={0.9}
                  disabled={!isValid || loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#FFFFFF" size="small" />
                  ) : (
                    <Text style={styles.resetButtonText}>{i18n.t('SEND_RESET_LINK')}</Text>
                  )}
                </TouchableOpacity>
              </>
            )}
          </View>

          {/* Links */}
          <View style={styles.linksContainer}>
            <TouchableOpacity 
              style={styles.linkButton}
              onPress={handleBackToLogin}
            >
              <Text style={styles.linkText}>← {i18n.t('BACK_TO_LOGIN')}</Text>
            </TouchableOpacity>

            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>{i18n.t('OR')}</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.signUpContainer}>
              <Text style={styles.signUpText}>{i18n.t('NO_ACCOUNT')} </Text>
              <TouchableOpacity onPress={handleCreateAccount}>
                <Text style={styles.signUpLink}>{i18n.t('CREATE_ACCOUNT')}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ height: 30 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}