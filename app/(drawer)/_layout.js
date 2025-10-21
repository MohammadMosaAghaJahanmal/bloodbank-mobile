// app/(drawer)/_layout.tsx
import { Feather, Ionicons } from '@expo/vector-icons';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import Constants from 'expo-constants';
import { Drawer } from 'expo-router/drawer';
import { useContext } from 'react';
import {
  Alert,
  Image, Linking,
  Pressable,
  Text, View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AuthContext } from '../../contexts/authContext';
import { useLanguage } from '../../contexts/LanguageContext';
import I18n from '../../utils/i18n';
import serverPath from '../../utils/serverPath';
import { globalStyle } from '../../utils/styles';
const {drawer : styles} = globalStyle

const COLORS = {
  primary: '#E73C3C',
  primaryDark: '#C42525',
  text: '#1E1E1E',
  muted: '#7E7E7E',
  sheet: '#FFFFFF',
  divider: '#EFEFEF',
};

const LANGUAGES = [
  { code: 'en', label: 'English', rtl: false, short: 'EN' },
  { code: 'ps', label: 'پښتو',   rtl: true,  short: 'PS' },
  { code: 'pa', label: 'پارسی',  rtl: true,  short: 'PA' },
];

export default function DrawerLayout() {
  const { isRTL, currentLocale } = useLanguage();
  return (
    <Drawer
      key={currentLocale}
      screenOptions={{
        drawerPosition: isRTL ? 'right' : 'left',
        headerShown: false,
        swipeEdgeWidth: 50,
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="(tabs)" options={{ title: I18n.t('HOME') }} />
      <Drawer.Screen name="about" options={{ title: I18n.t('ABOUT') }} />
      <Drawer.Screen name="contact" options={{ title: I18n.t('CONTACT_US') }} />
      <Drawer.Screen name="language-settings" options={{ title: I18n.t('LANGUAGE') }} />
    </Drawer>
  );
}

function CustomDrawerContent(props) {
  const { navigation } = props;
  const { isRTL, currentLocale, toggleLanguage } = useLanguage();
  const { user, login, logout } = useContext(AuthContext); // Get auth context
  const insets = useSafeAreaInsets();
  const version = `${Constants.expoConfig?.version ?? ''} (${Constants.expoConfig?.android?.versionCode ?? Constants.expoConfig?.ios?.buildNumber ?? ''})`;

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
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: () => {
          logout()
          navigation.closeDrawer();
          navigation.navigate('(tabs)', {
            screen: "index"
          }); // Navigate to home after logout
        } },
      ]
    );
  };

  const handleLogin = () => {
    navigation.closeDrawer();
    navigation.navigate('(tabs)', { 
      screen: 'login' 
    });
  };

  // User data based on authentication status
  const userData = user ? {
    name: user.fullName || 'User',
    email: user.email || '',
    avatar: user.imageUrl ? serverPath(user.imageUrl) : 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=256&auto=format&fit=crop',
  } : {
    name: I18n.t('WELCOME') || 'Welcome',
    email: I18n.t('BLOOD_BANK') || 'Blood Bank',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=256&auto=format&fit=crop', // Will use default app logo
  };

  return (
    <View style={[styles.sheet]}>
      {/* Header */}
      <View style={[styles.header]}>
        <View style={[styles.headerBg, { paddingTop: insets.top }]} />
        <Pressable
          style={[{ ...styles.closeBtn, top: (insets.top + 3) }, isRTL && { left: 16, right: 'auto' }]}
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
              source={{ uri: userData.avatar }}
              style={[
                styles.avatar,
                isRTL ? { marginLeft: 0, marginRight: 12 } : { marginLeft: 0, marginRight: 0 }
              ]}
            />
          ) : (
            <View style={[
              styles.defaultAvatar,
              isRTL ? { marginLeft: 0, marginRight: 12 } : { marginLeft: 0, marginRight: 0 }
            ]}>
              <Text style={styles.defaultAvatarText}>🩸</Text>
            </View>
          )}
          <View style={{ flex: 1, alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
            <Text numberOfLines={1} style={[styles.name, isRTL && { textAlign: 'right' }]}>
              {userData.name}
            </Text>
            <Text numberOfLines={1} style={[styles.email, isRTL && { textAlign: 'right' }]}>
              {userData.email}
            </Text>
          </View>
        </View>
      </View>

      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{ paddingTop: 8, paddingBottom: 16 }}
      >
        {/* Language Section */}
        <Section>
          <Text
            style={[
              styles.langTitle,
              { textAlign: isRTL ? 'right' : 'left' }
            ]}
          >
            {I18n.t('LANGUAGE') || 'Language'}
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
                    {lng.short}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Section>

        {/* Main menu - Show profile only when logged in */}
        {user && (
          <Section>
            <MenuItem
              icon={<Feather name="user" size={18} color={COLORS.text} />}
              label={I18n.t('MY_PROFILE') || 'My Profile'}
              onPress={() => go('profile')}
              isRTL={isRTL}
            />
            <MenuItem
              icon={<Feather name="settings" size={18} color={COLORS.text} />}
              label={I18n.t('SETTINGS') || 'Settings'}
              onPress={() => go('settings')}
              isRTL={isRTL}
            />
          </Section>
        )}

        <Section>
          <MenuItem
            icon={<Feather name="home" size={18} color={COLORS.text} />}
            label={I18n.t('HOME') || 'Home'}
            onPress={() => go('(tabs)', 'index')}
            isRTL={isRTL}
          />
          <MenuItem
            icon={<Feather name="message-circle" size={18} color={COLORS.text} />}
            label={I18n.t('CONTACT_US') || 'Contact US'}
            onPress={() => go('contact')}
            isRTL={isRTL}
          />
          <MenuItem
            icon={<Feather name="globe" size={18} color={COLORS.text} />}
            label={I18n.t('NEWS_FEED') || 'News Feed'}
            onPress={() => go('news')}
            isRTL={isRTL}
          />
          <MenuItem
            icon={<Feather name="info" size={18} color={COLORS.text} />}
            label={I18n.t('ABOUT') || 'About Us'}
            onPress={() => go('about')}
            isRTL={isRTL}
          />
          <MenuItem
            icon={<Ionicons name="shield-checkmark-outline" size={18} color={COLORS.text} />}
            label={I18n.t('PRIVACY_POLICY') || 'Privacy Policy'}
            onPress={() => Linking.openURL('https://your-site.com/privacy')}
            isRTL={isRTL}
          />

          <MenuItem
            icon={<Ionicons name="shield-checkmark-outline" size={18} color={COLORS.text} />}
            label={I18n.t('LANGUAGE') || 'LANGUAGE'}
            onPress={() => go('language-settings')}
            isRTL={isRTL}
          />
        </Section>

        <View style={{ height: 12 }} />

        {/* Logout/Login Button */}
        {user ? (
          <Pressable
            style={styles.logoutBtn}
            onPress={handleLogout}
          >
            <Feather name="log-out" size={18} color={COLORS.primary} />
            <Text style={styles.logoutTxt}>{I18n.t('LOGOUT') || 'Logout'}</Text>
          </Pressable>
        ) : (
          <Pressable
            style={styles.logoutBtn}
            onPress={handleLogin}
          >
            <Feather name="log-in" size={18} color={COLORS.primary} />
            <Text style={styles.loginTxt}>{I18n.t('LOGIN') || 'Login'}</Text>
          </Pressable>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.version}>App Version: {version}</Text>
          <Pressable onPress={() => Linking.openURL('https://your-site.com/privacy')}>
            <Text style={styles.link}>Privacy Policy</Text>
          </Pressable>
          <Text style={{ color: COLORS.muted, marginHorizontal: 4 }}> & </Text>
          <Pressable onPress={() => Linking.openURL('https://your-site.com/terms')}>
            <Text style={styles.link}>Terms of Service</Text>
          </Pressable>
        </View>
      </DrawerContentScrollView>
    </View>
  );
}

function Section({ children }) {
  return (
    <View style={styles.section}>
      {children}
      <View style={styles.divider} />
    </View>
  );
}

function MenuItem({
  icon, label, onPress, isRTL,
}) {
  return (
    <Pressable onPress={onPress} style={[styles.item, isRTL && { flexDirection: 'row-reverse' }]}>
      <View style={[styles.itemIcon, isRTL && { marginRight: 0, marginLeft: 12 }]}>{icon}</View>
      <Text style={[styles.itemLabel, isRTL && { textAlign: 'right' }]} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}