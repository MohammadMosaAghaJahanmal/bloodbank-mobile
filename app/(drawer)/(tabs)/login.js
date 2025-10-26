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
import i18n from '../../../utils/i18n';
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
      e.loginIdentifier = i18n.t('ENTER_EMAIL_OR_PHONE');
    } else if (touched.loginIdentifier && loginIdentifier.trim()) {
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginIdentifier);
      const isPhone = /^\+?\d{8,15}$/.test(loginIdentifier.replace(/\s/g, ''));
      
      if (!isEmail && !isPhone) {
        e.loginIdentifier = i18n.t('INVALID_EMAIL_OR_PHONE');
      }
    }
    
    if (touched.password && !password) {
      e.password = i18n.t('ENTER_PASSWORD');
    } else if (touched.password && password.length < 6) {
      e.password = i18n.t('PASSWORD_TOO_SHORT', { min: 6 });
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
      if (!res.ok) throw new Error(data?.message || i18n.t('LOGIN_FAILED'));

      if (data?.status === 'failure') {
        setLoading(false);
        Alert.alert(i18n.t('LOGIN_FAILED'), data.message);
        return
      }

      // ✅ Update global auth state + persist token
      if (data?.token && data?.user) {
        await saveTokenAndLogin(data.token, data.user);
      } else if (data?.token) {
        await saveTokenAndLogin(data.token, null);
      } else {
        throw new Error(i18n.t('NO_TOKEN_RECEIVED'));
      }

      setLoading(false);
      setLoginIdentifier("");
      setPassword("");
      router.replace('/profile');
    } catch (err) {
      console.error('Login error:', err);
      setLoading(false);

      const msg = String(err?.message || '')
        .toLowerCase();

      let errorMessage = i18n.t('LOGIN_FAILED_TRY_AGAIN');
      if (msg.includes('network request failed')) errorMessage = i18n.t('NETWORK_ERROR');
      else if (msg.includes('invalid credentials')) errorMessage = i18n.t('INVALID_CREDENTIALS');
      else if (msg.includes('user not found')) errorMessage = i18n.t('USER_NOT_FOUND');

      Alert.alert(i18n.t('LOGIN_FAILED'), errorMessage);
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
            <Text style={styles.title}>{i18n.t('WELCOME_BACK')}</Text>
            <Text style={styles.subtitle}>{i18n.t('SIGN_IN_TO_CONTINUE')}</Text>
          </View>

          {/* Login Form */}
          <View style={styles.card}>
            <Input
              label={i18n.t('EMAIL_OR_PHONE')}
              placeholder={i18n.t('EMAIL_OR_PHONE_PLACEHOLDER')}
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
              label={i18n.t('PASSWORD')}
              placeholder={i18n.t('PASSWORD_PLACEHOLDER')}
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
                    {showPassword ? i18n.t('HIDE') : i18n.t('SHOW')}
                  </Text>
                </TouchableOpacity>
              }
            />

            {/* Forgot Password */}
            <TouchableOpacity 
              style={styles.forgotPasswordButton}
              onPress={handleForgotPassword}
            >
              <Text style={styles.forgotPasswordText}>{i18n.t('FORGOT_PASSWORD')}</Text>
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
                <Text style={styles.loginButtonText}>{i18n.t('SIGN_IN')}</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>{i18n.t('OR')}</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Sign Up Link */}
          <View style={styles.signUpContainer}>
            <Text style={styles.signUpText}>{i18n.t('NO_ACCOUNT')} </Text>
            <TouchableOpacity onPress={handleSignUp}>
              <Text style={styles.signUpLink}>{i18n.t('CREATE_ACCOUNT')}</Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 30 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}