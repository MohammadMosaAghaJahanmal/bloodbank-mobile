// app/(drawer)/(tabs)/_layout.tsx
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { DrawerToggleButton } from '@react-navigation/drawer';
import { Tabs } from 'expo-router';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLanguage } from '../../../contexts/LanguageContext';
import i18n from '../../../utils/i18n';

const COLORS = {
  primary: '#E73C3C',
  text: '#1E1E1E',
  muted: '#9CA3AF',
  barBg: '#FFFFFF',
  shadow: '#000000',
};

export default function TabsLayout() {
  const { isRTL } = useLanguage();

  return (
    <Tabs
      // ⬇️ Use the prop, not screenOptions
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerLeft: isRTL ? undefined : () => <DrawerToggleButton />,
        headerRight: isRTL ? () => <DrawerToggleButton /> : undefined,
        headerTitleAlign: isRTL ? 'right' : 'left',
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen name="index"   options={{ title: i18n.t('HOME') }} />
      {/* ⬇️ Add the middle tab so the center button exists */}
      <Tabs.Screen name="profile" options={{ title: i18n.t('PROFILE') }} />
    </Tabs>
  );
}

function CustomTabBar({ state, navigation }) {
  const insets = useSafeAreaInsets();
  const { isRTL } = useLanguage();

  const getLabel = (name) =>
    name === 'index' ? i18n.t('HOME')
    : name === 'profile' ? i18n.t('PROFILE')
    : name;

  return (
    <View style={[styles.wrapper, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      <View style={[styles.bar, isRTL && { flexDirection: 'row-reverse' }]}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const onPress = () => {
            const e = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!isFocused && !e.defaultPrevented) navigation.navigate(route.name);
          };

          if (route.name === 'request') {
            return (
              <Pressable key={route.key} onPress={onPress} style={styles.centerBtn}>
                <View style={styles.centerIconWrap}>
                  <MaterialCommunityIcons name="blood-bag" size={22} color="#fff" />
                </View>
                <Text style={styles.centerLabel} numberOfLines={1}>{getLabel(route.name)}</Text>
              </Pressable>
            );
          }

          const icon = route.name === 'index' ? 'home' : 'person';
          return (
            <Pressable key={route.key} onPress={onPress} style={styles.sideItem}>
              <Ionicons name={icon} size={22} color={isFocused ? COLORS.primary : COLORS.muted} />
              <Text
                numberOfLines={1}
                style={[styles.sideLabel, { color: isFocused ? COLORS.primary : COLORS.muted }, isRTL && { textAlign: 'right' }]}
              >
                {getLabel(route.name)}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 0, right: 0, bottom: 0,
    backgroundColor: 'transparent',
  },
  bar: {
    marginHorizontal: 14,
    backgroundColor: COLORS.barBg,
    borderRadius: 5,
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 6,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    ...Platform.select({
      ios: { shadowColor: COLORS.shadow, shadowOpacity: 0.08, shadowRadius: 10, shadowOffset: { width: 0, height: 6 } },
      android: { elevation: 10 },
    }),
  },
  sideItem: { flex: 1, alignItems: 'center', justifyContent: 'flex-end', paddingVertical: 4 },
  sideLabel: { fontSize: 12, marginTop: 4, fontWeight: '600' },

  centerBtn: { width: 120, alignItems: 'center', justifyContent: 'flex-end' },
  centerIconWrap: {
    width: 52, height: 52, borderRadius: 26, backgroundColor: COLORS.primary,
    alignItems: 'center', justifyContent: 'center',
    transform: [{ translateY: -14 }],
    ...Platform.select({
      ios: { shadowColor: COLORS.shadow, shadowOpacity: 0.15, shadowRadius: 12, shadowOffset: { width: 0, height: 8 } },
      android: { elevation: 12 },
    }),
  },
  centerLabel: { fontSize: 12, marginTop: -6, fontWeight: '700', color: COLORS.text, textAlign: 'center' },
});
