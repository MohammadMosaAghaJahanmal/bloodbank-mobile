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
import { globalStyle } from '../../../utils/styles';


export default function LoginScreen() {
  const { createRTLStyles, isRTL, writingDirection } = useRTLStyles();
  const styles = createRTLStyles(globalStyle.login);
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

      const res = await fetch(serverPath('/api/auth/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Login failed');

      if (data?.status === 'failure') {
        setLoading(false);
        Alert.alert('Login Failed', data.message);
        return
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

      // Alert.alert(
      //   'Welcome Back! 🩸',
      //   'You have successfully logged in to Blood Donors Network.',
      //   [{ text: 'Continue', onPress: () => {router.replace('/profile')} }] // go straight to profile
      // );
      setLoginIdentifier("");
      setPassword("");
      router.replace('/profile');
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
    navigation?.navigate?.('forgot-password');
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
              isRTL={isRTL}
              writingDirection={writingDirection}
              styles={styles}
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
              isRTL={isRTL}
              writingDirection={writingDirection}
              styles={styles}
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