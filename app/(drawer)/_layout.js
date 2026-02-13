import { Feather, Ionicons } from '@expo/vector-icons';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import Constants from 'expo-constants';
import { Drawer } from 'expo-router/drawer';
import { useContext, useState } from 'react';
import {
  Alert,
  Image, Linking,
  Pressable,
  Text, View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import IMAGE from '../../assets/images/icon.png';
import DeleteAccountModal from '../../components/DeleteAccountModal';
import { AuthContext } from '../../contexts/authContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { t } from '../../utils/i18n';
import serverPath from '../../utils/serverPath';
import { COLORS, globalStyle } from '../../utils/styles';

const {drawer : styles} = globalStyle

const LANGUAGES = [
  { code: 'en', label: 'English', rtl: false, short: 'EN' },
  { code: 'ps', label: 'پښتو',   rtl: true,  short: 'PS' },
  { code: 'pa', label: 'فارسی',  rtl: true,  short: 'PA' },
];

export default function DrawerLayout() {
  const { isRTL, currentLocale } = useLanguage();

  return (
    <Drawer
      key={`drawer_${currentLocale}`}
      screenOptions={{
        drawerPosition: isRTL ? 'right' : 'left',
        headerShown: false,
        swipeEdgeWidth: 50,
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen 
        name="(tabs)" 
        options={{ 
          title: t('HOME'),
          drawerLabel: t('HOME')
        }} 
      />
      <Drawer.Screen 
        name="about" 
        options={{ 
          title: t('ABOUT'),
          drawerLabel: t('ABOUT')
        }} 
      />
      <Drawer.Screen 
        name="contact" 
        options={{ 
          title: t('CONTACT_US'),
          drawerLabel: t('CONTACT_US')
        }} 
      />
    </Drawer>
  );
}

function CustomDrawerContent(props) {
  const { navigation } = props;
  const { isRTL, currentLocale, toggleLanguage, isReady } = useLanguage();
  const { user, logout, token, setAuth } = useContext(AuthContext);
  const insets = useSafeAreaInsets();
  const version = `${Constants.expoConfig?.version ?? ''} (${Constants.expoConfig?.android?.versionCode ?? Constants.expoConfig?.ios?.buildNumber ?? ''})`;
  
  // Add state for delete account modal
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Don't render until language is ready
  if (!isReady) {
    return (
      <View style={[styles.sheet, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const go = (name, screen) => {
    navigation.closeDrawer();
    if(!screen)
      navigation.navigate(name);
    if(screen)
      navigation.navigate(name, {
        screen: screen
      });
  };

  const handleLogout = () => {
    Alert.alert(
      t('LOGOUT_CONFIRMATION_TITLE') || 'Logout',
      t('LOGOUT_CONFIRMATION_MESSAGE') || 'Are you sure you want to logout?',
      [
        { 
          text: t('CANCEL') || 'Cancel', 
          style: 'cancel' 
        },
        { 
          text: t('LOGOUT') || 'Logout', 
          style: 'destructive', 
          onPress: () => {
            logout()
            navigation.closeDrawer();
            navigation.navigate('(tabs)', {
              screen: "index"
            });
          } 
        },
      ]
    );
  };

  const handleLogin = () => {
    navigation.closeDrawer();
    navigation.navigate('(tabs)', { 
      screen: 'login' 
    });
  };
  

  // Add delete account handler
  const handleDeleteAccount = async (reason) => {
    try {
      setIsLoading(true);
      const response = await fetch(serverPath(`/api/delete-account`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          reason: reason,
          nameSnapshot: user?.fullName
        })
      });

      const result = await response.json();

      if (result.status === 'success') {
        // Update user context with deletion request status
          setAuth(prev => ({
            ...prev,
            user: {...prev.user, deletionRequest: true }
          }))
        
        Alert.alert(
          t('DELETE_REQUEST_SUBMITTED') || 'Request Submitted',
          t('DELETE_REQUEST_SUCCESS_MESSAGE') || 'Your account deletion request has been submitted. An admin will review it shortly.',
          [{ text: t('OK') || 'OK' }]
        );
      } else {
        Alert.alert(
          t('ERROR') || 'Error',
          result.message || t('DELETE_REQUEST_FAILED') || 'Failed to submit deletion request.'
        );
      }
    } catch (error) {
      console.error('Delete account error:', error);
      Alert.alert(
        t('ERROR') || 'Error',
        t('DELETE_REQUEST_FAILED') || 'Failed to submit deletion request. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Add cancel deletion request handler
  const handleCancelDeletionRequest = async () => {
    Alert.alert(
      t('CANCEL_DELETION_REQUEST') || 'Cancel Deletion Request',
      t('CANCEL_DELETION_CONFIRMATION') || 'Are you sure you want to cancel your account deletion request?',
      [
        { 
          text: t('NO') || 'No', 
          style: 'cancel' 
        },
        { 
          text: t('YES_CANCEL') || 'Yes, Cancel', 
          style: 'destructive',
          onPress: async () => {
            try {
              setIsLoading(true);
              const response = await fetch(serverPath(`/api/delete-account/cancel`), {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
                }
              });

              const result = await response.json();

              if (result.status === 'success') {
                // Update user context with deletion request status
                setAuth(prev => ({
                  ...prev,
                  user: {...prev.user, deletionRequest: false }
                }));
                
                Alert.alert(
                  t('DELETION_REQUEST_CANCELLED') || 'Request Cancelled',
                  t('DELETION_REQUEST_CANCELLED_MESSAGE') || 'Your account deletion request has been cancelled.',
                  [{ text: t('OK') || 'OK' }]
                );
              } else {
                Alert.alert(
                  t('ERROR') || 'Error',
                  result.message || t('CANCEL_DELETION_FAILED') || 'Failed to cancel deletion request.'
                );
              }
            } catch (error) {
              console.error('Cancel deletion error:', error);
              Alert.alert(
                t('ERROR') || 'Error',
                t('CANCEL_DELETION_FAILED') || 'Failed to cancel deletion request. Please try again.'
              );
            } finally {
              setIsLoading(false);
            }
          }
        },
      ]
    );
  };

  const showDeleteAccountConfirmation = () => {
    Alert.alert(
      t('DELETE_ACCOUNT') || 'Delete Account',
      t('DELETE_ACCOUNT_WARNING') || 'This will submit a request to delete your account. An administrator will review your request. This action cannot be undone.',
      [
        { 
          text: t('CANCEL') || 'Cancel', 
          style: 'cancel' 
        },
        { 
          text: t('CONTINUE') || 'Continue', 
          style: 'destructive',
          onPress: () => setDeleteModalVisible(true)
        },
      ]
    );
  };

  // Check if user has pending deletion request
  const hasPendingDeletionRequest = user?.deletionRequest === true;

  // User data based on authentication status
  const userData = user ? {
    name: user.fullName || t('USER') || 'User',
    email: user.email || '',
    avatar: user.imageUrl ? serverPath(user.imageUrl) : IMAGE,
  } : {
    name: t('WELCOME') || 'Welcome',
    email: t('BLOOD_BANK') || 'Blood Bank',
    avatar: IMAGE,
  };

  const avatarSource =
  typeof userData.avatar === 'string'
    ? { uri: userData.avatar }
    : userData.avatar;

  return (
    <View style={[styles.sheet]}>
      {/* Header */}
      <View style={[styles.header]}>
        <View style={[styles.headerBg, { paddingTop: insets.top }]} />
        <Pressable
          style={[
            styles.closeBtn, 
            { top: (insets.top + 3) },
            isRTL ? { left: 16, right: 'auto' } : { right: 16, left: 'auto' }
          ]}
          onPress={() => navigation.closeDrawer()}
        >
          <Feather name="x" size={20} color="#fff" />
        </Pressable>

        <View
          style={[
            styles.profileRow,
            isRTL && { flexDirection: 'row-reverse' }
          ]}
        >
          {userData.avatar ? (
            <Image
              source={avatarSource}
              style={[
                styles.avatar,
                isRTL ? { marginLeft: 12, marginRight: 0 } : { marginLeft: 0, marginRight: 12 }
              ]}
            />
          ) : (
            <View style={[
              styles.defaultAvatar,
              isRTL ? { marginLeft: 12, marginRight: 0 } : { marginLeft: 0, marginRight: 12 }
            ]}>
              <Text style={styles.defaultAvatarText}>🩸</Text>
            </View>
          )}
          <View style={{ 
            flex: 1, 
            alignItems: isRTL ? 'flex-end' : 'flex-start' 
          }}>
            <Text 
              numberOfLines={1} 
              style={[
                styles.name, 
                { textAlign: isRTL ? 'right' : 'left' }
              ]}
            >
              {userData.name}
            </Text>
            <Text 
              numberOfLines={1} 
              style={[
                styles.email, 
                { textAlign: isRTL ? 'right' : 'left' }
              ]}
            >
              {userData.email}
            </Text>
            {/* Show deletion request status */}
            {hasPendingDeletionRequest && (
              <Text 
                style={[
                  styles.deletionWarning,
                  { textAlign: isRTL ? 'right' : 'left' }
                ]}
              >
                {t('PENDING_DELETION_WARNING') || '⏳ Account deletion pending'}
              </Text>
            )}
          </View>
        </View>
      </View>

      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{ 
          paddingTop: 8, 
          paddingBottom: 16,
          flexGrow: 1 
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Language Section */}
        <Section isRTL={isRTL}>
          <Text
            style={[
              styles.langTitle,
              { textAlign: isRTL ? 'right' : 'left' }
            ]}
          >
            {t('LANGUAGE')}
          </Text>

          <View
            style={[
              styles.langRow,
              isRTL && { flexDirection: 'row-reverse', justifyContent: 'flex-start' }
            ]}
          >
            {LANGUAGES.map((lng) => {
              const selected = currentLocale?.startsWith(lng.code);
              return (
                <Pressable
                  key={lng.code}
                  onPress={() => {
                    toggleLanguage(lng.code);
                  }}
                  style={[
                    styles.langPill,
                    selected && styles.langPillActive,
                    isRTL && { flexDirection: 'row-reverse' }
                  ]}
                >
                  <Text
                    style={[
                      styles.langPillText,
                      selected && styles.langPillTextActive
                    ]}
                  >
                    {lng.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Section>

        {/* Main menu - Show profile only when logged in */}
        {user && (
          <Section isRTL={isRTL}>
            <MenuItem
              icon={<Feather name="user" size={18} color={COLORS.text} />}
              label={t('MY_PROFILE')}
              onPress={() => go('(tabs)', 'profile')}
              isRTL={isRTL}
            />
            
            {/* Conditional Delete Account / Cancel Deletion Request Button */}
            {!hasPendingDeletionRequest ? (
              <MenuItem
                icon={<Feather name="trash-2" size={18} color={COLORS.danger} />}
                label={t('DELETE_MY_ACCOUNT') || 'Delete My Account'}
                onPress={showDeleteAccountConfirmation}
                isRTL={isRTL}
                isDanger={true}
                disabled={isLoading}
              />
            ) : (
              <MenuItem
                icon={<Feather name="x-circle" size={18} color={COLORS.warning} />}
                label={t('CANCEL_DELETION_REQUEST') || 'Cancel Deletion Request'}
                onPress={handleCancelDeletionRequest}
                isRTL={isRTL}
                isWarning={true}
                disabled={isLoading}
              />
            )}
          </Section>
        )}

        <Section isRTL={isRTL}>
          <MenuItem
            icon={<Feather name="home" size={18} color={COLORS.text} />}
            label={t('HOME')}
            onPress={() => go('(tabs)', 'index')}
            isRTL={isRTL}
          />
          <MenuItem
            icon={<Feather name="message-circle" size={18} color={COLORS.text} />}
            label={t('CONTACT_US')}
            onPress={() => go('contact')}
            isRTL={isRTL}
          />
          <MenuItem
            icon={<Feather name="globe" size={18} color={COLORS.text} />}
            label={t('NEWS_FEED')}
            onPress={() => go('news')}
            isRTL={isRTL}
          />
          <MenuItem
            icon={<Feather name="info" size={18} color={COLORS.text} />}
            label={t('ABOUT')}
            onPress={() => go('about')}
            isRTL={isRTL}
          />
          <MenuItem
            icon={<Ionicons name="shield-checkmark-outline" size={18} color={COLORS.text} />}
            label={t('PRIVACY_POLICY')}
            onPress={() => Linking.openURL('https://sites.google.com/view/save-blood-bank-privacy-policy')}
            isRTL={isRTL}
          />
        </Section>

        <View style={{ flex: 1 }} />

        {/* Logout/Login Button */}
        {user ? (
          <Pressable
            style={[
              styles.logoutBtn,
              isRTL && { flexDirection: 'row-reverse' }
            ]}
            onPress={handleLogout}
            disabled={isLoading}
          >
            <Feather name="log-out" size={18} color={COLORS.primary} />
            <Text style={styles.logoutTxt}>{t('LOGOUT')}</Text>
          </Pressable>
        ) : (
          <Pressable
            style={[
              styles.logoutBtn,
              isRTL && { flexDirection: 'row-reverse' }
            ]}
            onPress={handleLogin}
          >
            <Feather name="log-in" size={18} color={COLORS.primary} />
            <Text style={styles.loginTxt}>{t('LOGIN')}</Text>
          </Pressable>
        )}

        {/* Footer */}
        <View style={[
          styles.footer,
          isRTL && { flexDirection: 'row-reverse' }
        ]}>
          <Text style={styles.version}>
            {t('APP_VERSION') || 'App Version'}: {version}
          </Text>
          <View style={[
            styles.footerLinks,
            isRTL && { flexDirection: 'row-reverse' }
          ]}>
            <Pressable onPress={() => Linking.openURL('https://sites.google.com/view/save-blood-bank-privacy-policy')}>
              <Text style={styles.link}>
                {t('PRIVACY_POLICY')}
              </Text>
            </Pressable>
          </View>
        </View>
      </DrawerContentScrollView>

      {/* Delete Account Modal */}
      <DeleteAccountModal
        visible={deleteModalVisible}
        onClose={() => setDeleteModalVisible(false)}
        onSubmit={handleDeleteAccount}
        isLoading={isLoading}
      />
    </View>
  );
}

function Section({ children, isRTL }) {
  return (
    <View style={styles.section}>
      {children}
      <View style={styles.divider} />
    </View>
  );
}

function MenuItem({
  icon, label, onPress, isRTL, isDanger = false, isWarning = false, disabled = false
}) {
  const getTextColor = () => {
    if (isDanger) return COLORS.danger;
    if (isWarning) return COLORS.warning;
    return COLORS.text;
  };

  return (
    <Pressable 
      onPress={onPress} 
      style={[
        styles.item, 
        isRTL && { flexDirection: 'row-reverse' },
        disabled && styles.itemDisabled
      ]}
      disabled={disabled}
    >
      <View style={[
        styles.itemIcon, 
        isRTL ? { marginRight: 0, marginLeft: 12 } : { marginRight: 12, marginLeft: 0 }
      ]}>
        {icon}
      </View>
      <Text 
        style={[
          styles.itemLabel, 
          { textAlign: isRTL ? 'right' : 'left' },
          { color: getTextColor() },
          disabled && styles.itemLabelDisabled
        ]} 
        numberOfLines={1}
      >
        {label}
      </Text>
    </Pressable>
  );
}