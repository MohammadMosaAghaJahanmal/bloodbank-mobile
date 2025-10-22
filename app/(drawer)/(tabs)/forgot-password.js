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
import serverPath from '../../../utils/serverPath';

const PRIMARY = '#E73C3C';
const BG = '#FDF2F2';
const TEXT = '#1E1E1E';
const MUTED = '#7E7E7E';

export default function ForgotPasswordScreen() {
  const { createRTLStyles } = useRTLStyles();
  const styles = createRTLStyles(baseStyles);
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({});
  const [emailSent, setEmailSent] = useState(false);

  // Validation
  const errors = useMemo(() => {
    const e = {};
    
    if (touched.email && !email.trim()) {
      e.email = 'Please enter your email address';
    } else if (touched.email && email.trim()) {
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      
      if (!isEmail) {
        e.email = 'Please enter a valid email address';
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
      
      if (!res.ok) throw new Error(data?.message || 'Failed to send reset link');

      if (data?.status === 'failure') {
        setLoading(false);
        Alert.alert('Failed', data.message);
        return;
      }

      setLoading(false);
      setEmailSent(true);
      
      Alert.alert(
        'Reset Link Sent!',
        'Please check your email for password reset instructions.',
        [{ text: 'OK' }]
      );


    } catch (err) {
      console.error('Forgot password error:', err);
      setLoading(false);

      const msg = String(err?.message || '')
        .toLowerCase();

      let errorMessage = 'Failed to send reset link. Please try again.';
      if (msg.includes('network request failed')) errorMessage = 'Network error. Please check your internet connection.';
      else if (msg.includes('user not found')) errorMessage = 'No account found with this email address.';
      else if (msg.includes('email')) errorMessage = 'Please check your email address and try again.';

      Alert.alert('Failed', errorMessage);
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
            <Text style={styles.title}>Reset Password</Text>
            <Text style={styles.subtitle}>
              {emailSent 
                ? 'Check your email for reset instructions' 
                : 'Enter your email to receive a reset link'
              }
            </Text>
          </View>

          {/* Forgot Password Form */}
          <View style={styles.card}>
            {emailSent ? (
              <View style={styles.successContainer}>
                <Text style={styles.successIcon}>📧</Text>
                <Text style={styles.successTitle}>Check Your Email</Text>
                <Text style={styles.successText}>
                  We've sent password reset instructions to {'\n'}
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
                    <Text style={styles.resendButtonText}>Resend Email</Text>
                  )}
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <Input
                  label="Email Address *"
                  placeholder="Enter your email"
                  value={email}
                  onChangeText={setEmail}
                  onBlur={() => setTouched(t => ({ ...t, email: true }))}
                  error={errors.email}
                  returnKeyType="send"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  icon="📧"
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
                    <Text style={styles.resetButtonText}>Send Reset Link</Text>
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
              <Text style={styles.linkText}>← Back to Login</Text>
            </TouchableOpacity>

            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.signUpContainer}>
              <Text style={styles.signUpText}>Don't have an account? </Text>
              <TouchableOpacity onPress={handleCreateAccount}>
                <Text style={styles.signUpLink}>Create Account</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ height: 30 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Base styles for RTL transformation
const baseStyles = {
  safe: { 
    flex: 1, 
    backgroundColor: BG 
  },
  container: { 
    flexGrow: 1,
    padding: 20,
    paddingTop: 0,
    justifyContent: 'center',
  },
  header: { 
    alignItems: 'center', 
    marginBottom: 40 
  },
  title: { 
    fontSize: 28, 
    fontWeight: '800', 
    color: TEXT, 
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: { 
    fontSize: 16, 
    color: MUTED, 
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 22,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#FFE6E6',
    shadowColor: PRIMARY,
    shadowOpacity: 0.1,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  resetButton: {
    backgroundColor: PRIMARY,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: PRIMARY,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  disabledButton: {
    opacity: 0.5,
    shadowOpacity: 0.1,
  },
  resetButtonText: {
    color: 'white',
    fontWeight: '800',
    fontSize: 16,
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  successIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: TEXT,
    marginBottom: 12,
    textAlign: 'center',
  },
  successText: {
    fontSize: 14,
    color: MUTED,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  emailText: {
    color: PRIMARY,
    fontWeight: '600',
  },
  resendButton: {
    backgroundColor: PRIMARY,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 140,
  },
  resendButtonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 14,
  },
  linksContainer: {
    alignItems: 'center',
  },
  linkButton: {
    marginBottom: 16,
  },
  linkText: {
    color: PRIMARY,
    fontWeight: '600',
    fontSize: 14,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    width: '100%',
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#FFE6E6',
  },
  dividerText: {
    color: MUTED,
    fontWeight: '600',
    fontSize: 14,
    marginHorizontal: 16,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  signUpText: {
    color: MUTED,
    fontSize: 14,
  },
  signUpLink: {
    color: PRIMARY,
    fontWeight: '700',
    fontSize: 14,
  },
};