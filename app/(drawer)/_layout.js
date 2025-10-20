// app/(drawer)/_layout.tsx
import { Feather, Ionicons } from '@expo/vector-icons';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import Constants from 'expo-constants';
import { Drawer } from 'expo-router/drawer';
import {
  Image, Linking,
  Pressable, StyleSheet, Text, View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLanguage } from '../../contexts/LanguageContext';
import I18n from '../../utils/i18n';

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
  const { isRTL, currentLocale } = useLanguage(); // <-- also read currentLocale

  return (
    <Drawer
      key={currentLocale} // <-- forces remount on language change
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
      <Drawer.Screen name="register" options={{ title: I18n.t('REGISTER') }} />
      <Drawer.Screen name="login" options={{ title: I18n.t('LOGIN') }} />
    </Drawer>
  );
}

function CustomDrawerContent(props) {
  const { navigation } = props;
  const { isRTL, currentLocale, toggleLanguage } = useLanguage();
  const insets = useSafeAreaInsets();
  const version = `${Constants.expoConfig?.version ?? ''} (${Constants.expoConfig?.android?.versionCode ?? Constants.expoConfig?.ios?.buildNumber ?? ''})`;

  // mock user data; swap with real user from your auth store
  const user = {
    name: 'Farjana Afrin',
    email: 'farjana622@gmail.com',
    avatar:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=256&auto=format&fit=crop',
  };

  const go = (name) => {
    navigation.closeDrawer();
    navigation.navigate(name);
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
            isRTL && { flexDirection: 'row-reverse' }  // ⟵ flip row for RTL
          ]}
        >
          <Image
            source={{ uri: user.avatar }}
            style={[
              styles.avatar,
              // Fallback spacing if gap isn't supported on your RN build:
              isRTL ? { marginLeft: 0, marginRight: 12 } : { marginLeft: 0, marginRight: 0 }
            ]}
          />
          <View style={{ flex: 1, alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
            <Text numberOfLines={1} style={[styles.name,  isRTL && { textAlign: 'right' }]}>{user.name}</Text>
            <Text numberOfLines={1} style={[styles.email, isRTL && { textAlign: 'right' }]}>{user.email}</Text>
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
                    // Toggle language (your context should also flip RTL based on code)
                    toggleLanguage(lng.code);
                    // Optional: close quickly for immediate feel
                    // navigation.closeDrawer();
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

        {/* Main menu */}
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

        <Section>
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

        {/* Logout */}
        <Pressable
          style={styles.logoutBtn}
          onPress={() => {
            // TODO: clear auth, then
            navigation.closeDrawer();
            navigation.navigate('login');
          }}
        >
          <Feather name="log-out" size={18} color={COLORS.primary} />
          <Text style={styles.logoutTxt}>{I18n.t('LOGOUT') || 'Logout'}</Text>
        </Pressable>

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

const styles = StyleSheet.create({
  sheet: { flex: 1, backgroundColor: COLORS.sheet },
  header: { marginBottom: 12 },
  headerBg: {
    height: 128,
    backgroundColor: COLORS.primary,
  },
  closeBtn: {
    position: 'absolute',
    right: 16,
    top: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileRow: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 5,
    flexDirection: 'row', 
    alignItems: 'center',
    gap: 12,              
  },
  avatar: { width: 72, height: 72, borderRadius: 36, borderWidth: 3, borderColor: '#fff', backgroundColor: '#fff' },
  name: { fontSize: 18, fontWeight: '700', color: '#fff' },
  email: { fontSize: 13, fontWeight: '500', color: '#ffe9e9', marginTop: 2 },

  section: { paddingHorizontal: 16, paddingTop: 24 },
  divider: { height: 1, backgroundColor: COLORS.divider, marginTop: 12 },

  // Language selector
  langTitle: { fontSize: 14, fontWeight: '700', color: COLORS.muted, marginBottom: 10 },
  langRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  langPill: {
    paddingHorizontal: 12,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#e6e6e6',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 62,
  },
  langPillActive: {
    backgroundColor: '#FFF0F0',
    borderColor: '#F5C8C8',
  },
  langPillText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
  },
  langPillTextActive: {
    color: COLORS.primary,
  },

  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  itemIcon: {
    width: 28, alignItems: 'center', marginRight: 12,
  },
  itemLabel: { flex: 1, fontSize: 15, color: COLORS.text, fontWeight: '600' },

  logoutBtn: {
    marginTop: 16,
    marginHorizontal: 16,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F5C8C8',
    backgroundColor: '#FFF6F6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  logoutTxt: { color: COLORS.primary, fontWeight: '700', fontSize: 15 },

  footer: {
    paddingHorizontal: 16,
    marginTop: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  version: { color: COLORS.muted, fontSize: 12, marginRight: 8 },
  link: { color: COLORS.primary, fontSize: 12, fontWeight: '700' },
});
