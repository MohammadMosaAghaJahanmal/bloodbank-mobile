import { router, useNavigation } from 'expo-router';
import { useContext, useMemo, useState } from 'react';
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
import { AuthContext } from '../../../contexts/authContext';
import { useRTLStyles } from '../../../contexts/useRTLStyles';
import serverPath from '../../../utils/serverPath';

const PRIMARY = '#E73C3C';
const BG = '#FDF2F2';
const TEXT = '#1E1E1E';
const MUTED = '#7E7E7E';

export default function LoginScreen() {
  const { createRTLStyles } = useRTLStyles();
  const styles = createRTLStyles(baseStyles);
  const navigation = useNavigation()
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({});
    const { saveTokenAndLogin } = useContext(AuthContext);

  // Validation
  const errors = useMemo(() => {
    const e = {};
    
    if (touched.loginIdentifier && !loginIdentifier.trim()) {
      e.loginIdentifier = 'Please enter your email or phone number';
    } else if (touched.loginIdentifier && loginIdentifier.trim()) {
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginIdentifier);
      const isPhone = /^\+?\d{8,15}$/.test(loginIdentifier.replace(/\s/g, ''));
      
      if (!isEmail && !isPhone) {
        e.loginIdentifier = 'Please enter a valid email or phone number';
      }
    }
    
    if (touched.password && !password) {
      e.password = 'Please enter your password';
    } else if (touched.password && password.length < 6) {
      e.password = 'Password must be at least 6 characters';
    }
    
    return e;
  }, [loginIdentifier, password, touched]);

  const isValid = 
    loginIdentifier.trim() && 
    password.length >= 6 && 
    !errors.loginIdentifier;

  // Handle login
  const handleLogin = async () => {
    if (!isValid || loading) return;

    setLoading(true);
    setTouched({ loginIdentifier: true, password: true });

    try {
      const loginData = {
        identifier: loginIdentifier.trim(),
        password,
      };

      const res = await fetch(serverPath('/auth/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Login failed');

      if (data?.status === 'failure') {
        throw new Error(data?.message || 'Login failed');
      }

      // ✅ Update global auth state + persist token
      if (data?.token && data?.user) {
        await saveTokenAndLogin(data.token, data.user);
      } else if (data?.token) {
        await saveTokenAndLogin(data.token, null);
      } else {
        throw new Error('Server did not return a token.');
      }

      setLoading(false);

      Alert.alert(
        'Welcome Back! 🩸',
        'You have successfully logged in to Blood Donors Network.',
        [{ text: 'Continue', onPress: () => router.replace('/profile') }] // go straight to profile
      );
    } catch (err) {
      console.error('Login error:', err);
      setLoading(false);

      const msg = String(err?.message || '')
        .toLowerCase();

      let errorMessage = 'Login failed. Please try again.';
      if (msg.includes('network request failed')) errorMessage = 'Network error. Please check your internet connection.';
      else if (msg.includes('invalid credentials')) errorMessage = 'Invalid email/phone or password. Please try again.';
      else if (msg.includes('user not found')) errorMessage = 'No account found with this email or phone number.';

      Alert.alert('Login Failed', errorMessage);
    }
  };

  // Handle forgot password
  const handleForgotPassword = () => {
    navigation?.navigate?.('ForgotPasswordScreen');
  };

  // Handle sign up navigation
  const handleSignUp = () => {
    console.log("REGISTER")
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
          {/* Header with Blood Drop Logo */}
          <View style={styles.header}>
            {/* <View style={styles.logoContainer}>
              <View style={styles.bloodDropLogo}>
                <Text style={styles.bloodDropText}>🩸</Text>
              </View>
            </View> */}
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue saving lives</Text>
          </View>

          {/* Login Form */}
          <View style={styles.card}>
            <Input
              label="Email or Phone Number *"
              placeholder="Email or Phone"
              value={loginIdentifier}
              onChangeText={setLoginIdentifier}
              onBlur={() => setTouched(t => ({ ...t, loginIdentifier: true }))}
              error={errors.loginIdentifier}
              returnKeyType="next"
              keyboardType="email-address"
              icon="📱"
            />

            <Input
              label="Password *"
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              onBlur={() => setTouched(t => ({ ...t, password: true }))}
              error={errors.password}
              secureTextEntry={!showPassword}
              returnKeyType="done"
              icon="🔒"
              right={
                <TouchableOpacity 
                  onPress={() => setShowPassword(s => !s)}
                  style={styles.eyeButton}
                >
                  <Text style={styles.eyeText}>
                    {showPassword ? 'Hide' : 'Show'}
                  </Text>
                </TouchableOpacity>
              }
            />

            {/* Forgot Password */}
            <TouchableOpacity 
              style={styles.forgotPasswordButton}
              onPress={handleForgotPassword}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity
              style={[styles.loginButton, !isValid && styles.disabledButton]}
              onPress={handleLogin}
              activeOpacity={0.9}
              disabled={!isValid || loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.loginButtonText}>Sign In</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>


          {/* Sign Up Link */}
          <View style={styles.signUpContainer}>
            <Text style={styles.signUpText}>Don not have an account? </Text>
            <TouchableOpacity onPress={handleSignUp}>
              <Text style={styles.signUpLink}>Create Account</Text>
            </TouchableOpacity>
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
  logoContainer: {
    marginBottom: 20,
  },
  bloodDropLogo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFE6E6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: PRIMARY,
  },
  bloodDropText: { 
    fontSize: 36 
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
  label: { 
    color: TEXT, 
    marginBottom: 8, 
    fontWeight: '600', 
    fontSize: 14,
    textAlign: 'left'
  },
  inputWrap: {
    borderWidth: 1.5,
    borderColor: '#FFE6E6',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBFB',
  },
  inputError: { 
    borderColor: '#EF4444' 
  },
  inputIcon: { 
    paddingHorizontal: 16, 
    fontSize: 16 
  },
  input: {
    flex: 1,
    paddingHorizontal: 0,
    paddingVertical: 16,
    color: TEXT,
    fontSize: 16,
    fontWeight: '500',
  },
  inputRight: { 
    paddingHorizontal: 16 
  },
  error: { 
    color: '#EF4444', 
    marginTop: 6, 
    fontSize: 12, 
    fontWeight: '500',
    textAlign: 'left'
  },
  eyeButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  eyeText: { 
    fontWeight: '700', 
    color: PRIMARY, 
    fontSize: 14 
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginBottom: 24,
    marginTop: -8,
  },
  forgotPasswordText: {
    color: PRIMARY,
    fontWeight: '600',
    fontSize: 14,
  },
  loginButton: {
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
  loginButtonText: {
    color: 'white',
    fontWeight: '800',
    fontSize: 16,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
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
  socialContainer: {
    marginBottom: 32,
  },
  socialTitle: {
    color: MUTED,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFE6E6',
    gap: 8,
  },
  socialIcon: {
    fontSize: 16,
  },
  socialText: {
    color: TEXT,
    fontWeight: '600',
    fontSize: 14,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
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
  emergencyContainer: {
    backgroundColor: '#FFF0F0',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: PRIMARY,
  },
  emergencyText: {
    color: TEXT,
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 16,
  },
  emergencyNumber: {
    color: PRIMARY,
    fontWeight: '700',
  },
};