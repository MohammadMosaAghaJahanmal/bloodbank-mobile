// app/(drawer)/(tabs)/_layout.tsx
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useContext, useEffect, useRef } from 'react';
import { Animated, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AuthContext } from '../../../contexts/authContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import i18n from '../../../utils/i18n';

const COLORS = {
  primary: '#E73C3C', // header red
  text: '#FFFFFF',
  muted: 'rgba(255,255,255,0.7)',
  barBg: '#FFFFFF',
  shadow: '#000000',
};


export default function TabsLayout() {

  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        header: (props) => <RedHeader {...props} />,
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen 
        name="index" 
        options={{ 
          title: i18n.t('HOME'),
          headerShown: true,
        }} 
      />
      
      {/* Conditionally show profile or login based on auth status */}
      <Tabs.Screen 
        name="profile" 
        options={{ 
          title: i18n.t('PROFILE'),
          headerShown: true,
        }}
      />
      
      {/* Keep login and register as hidden tabs for navigation */}
      <Tabs.Screen 
        name="login" 
        options={{ 
          href: null, // Hide from tab bar
          headerShown: true,
        }} 
      />
      <Tabs.Screen 
        name="register" 
        options={{ 
          href: null, // Hide from tab bar
          headerShown: true,
        }} 
      />
      <Tabs.Screen 
        name="forgot-password" 
        options={{ 
          href: null, // Hide from tab bar
          headerShown: true,
        }} 
      />
    </Tabs>
  );
}

/* =========================
   Enhanced RED Header with Animations
   ========================= */
function RedHeader({ options, navigation, route }) {
  const insets = useSafeAreaInsets();
  const { isRTL } = useLanguage();
  const { login, user } = useContext(AuthContext);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-50)).current;
  const circleScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Staggered animations for header entrance
    Animated.sequence([
      // First animate circles
      Animated.timing(circleScale, {
        toValue: 1,
        duration: 0,
        useNativeDriver: true,
      }),
      // Then header content
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 0,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  // Determine title based on route and auth status
  const getTitle = () => {
    if (typeof options.title === 'string') return options.title;
    
    if (route?.name === 'index') return i18n.t('HOME');
    if (route?.name === 'profile') return i18n.t('PROFILE');
    if (route?.name === 'login') return i18n.t('LOGIN');
    
    return i18n.t('PROFILE');
  };

  const title = getTitle();

  const openDrawer = () => {
    // Add press animation
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    navigation?.openDrawer?.();
  };

  const onBell = () => {
    // TODO: navigate to notifications
  };

  return (
    <Animated.View 
      style={[
        styles.headerWrap, 
        { 
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }] 
        }
      ]}
    >
      <StatusBar style="light" />
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top + 8,
            flexDirection: isRTL ? 'row-reverse' : 'row',
            borderBottomLeftRadius: 24,
            borderBottomRightRadius: 24,
          },
        ]}
      >
        {/* Animated decorative translucent circles */}
        <Animated.View 
          style={[
            styles.decoCircleBig, 
            { 
              transform: [{ 
                scale: circleScale.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.5, 1]
                }) 
              }],
              opacity: circleScale
            }
          ]} 
        />
        <Animated.View 
          style={[
            styles.decoCircleSmall,
            { 
              transform: [{ 
                scale: circleScale.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.5, 1]
                }) 
              }],
              opacity: circleScale
            }
          ]} 
        />

        {/* Left: menu with press animation */}
        <Pressable 
          onPress={openDrawer} 
          style={({ pressed }) => [
            styles.iconBtn, 
            { marginHorizontal: 16 },
            pressed && styles.iconBtnPressed
          ]}
        >
          {({ pressed }) => (
            <Animated.View style={[
              styles.iconContainer,
              {
                transform: [{ scale: pressed ? 0.9 : 1 }]
              }
            ]}>
              <Ionicons name="menu" size={22} color="#fff" />
            </Animated.View>
          )}
        </Pressable>

        {/* Center title with fade animation */}
        <Animated.View 
          style={[
            styles.titleBox,
            {
              opacity: fadeAnim,
              transform: [{
                translateY: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [10, 0]
                })
              }]
            }
          ]}
        >
          <Text numberOfLines={1} style={styles.headerTitle}>
            {title}
          </Text>
          {/* Show user name if logged in and on profile page */}
          {login && user?.name && route?.name === 'profile' && (
            <Text numberOfLines={1} style={styles.userName}>
              {user.name}
            </Text>
          )}
        </Animated.View>

        {/* Right: bell with pulse animation */}
        <Pressable 
          onPress={onBell} 
          style={({ pressed }) => [
            styles.iconBtn, 
            { marginHorizontal: 16 },
            pressed && styles.iconBtnPressed
          ]}
        >
          {/* Bell icon can be added back if needed */}
        </Pressable>
      </View>
    </Animated.View>
  );
}

/* =========================
   Enhanced Bottom Tab Bar with Auth Logic
   ========================= */
function CustomTabBar({ state, navigation }) {
  const insets = useSafeAreaInsets();
  const { isRTL } = useLanguage();
  const { login, logout } = useContext(AuthContext);
  
  // Animation refs for each tab
  const tabAnimations = useRef(
    state.routes.map(() => ({
      scale: new Animated.Value(1),
      opacity: new Animated.Value(0.7),
      dotScale: new Animated.Value(0),
    }))
  ).current;

  useEffect(() => {
    // Animate the active tab
    const currentIndex = state.index;
    
    tabAnimations.forEach((anim, index) => {
      const isActive = index === currentIndex;
      
      Animated.parallel([
        // Scale animation for active tab
        Animated.spring(anim.scale, {
          toValue: isActive ? 1.15 : 1,
          tension: 150,
          friction: 12,
          useNativeDriver: true,
        }),
        // Opacity animation for labels
        Animated.timing(anim.opacity, {
          toValue: isActive ? 1 : 0.7,
          duration: 200,
          useNativeDriver: true,
        }),
        // Active dot animation
        Animated.spring(anim.dotScale, {
          toValue: isActive ? 1 : 0,
          tension: 200,
          friction: 15,
          useNativeDriver: true,
        }),
      ]).start();
    });
  }, [state.index]);

  const getLabel = (name) => {
    if (name === 'index') return i18n.t('HOME');
    if (name === 'profile') return i18n.t('PROFILE');
    return name;
  };

const handleTabPress = (route, index, isFocused) => {
  // Ripple effect animation
  const rippleAnim = new Animated.Value(0);
  
  Animated.sequence([
    Animated.timing(rippleAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }),
    Animated.timing(rippleAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }),
  ]).start();

  if (!isFocused) {
    // Special handling for profile tab based on auth status
    if (route.name === 'profile' && !login) {
      // Navigate to login if not authenticated - use the correct path
      navigation.navigate('login'); // Just use 'login' without the full path
    } else {
      // Normal navigation for other tabs
      navigation.navigate(route.name);
    }
  }
};

  // Filter routes to only show index and profile in tab bar
  const visibleRoutes = state.routes.filter(route => 
    route.name === 'index' || route.name === 'profile'
  );

  return (
    <View style={[styles.wrapper, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      <View style={[styles.barRed, isRTL && { flexDirection: 'row-reverse' }]}>
        {/* Animated decorative translucent circles */}
        <Animated.View 
          style={[
            styles.tabDecoCircleBig,
            {
              transform: [{
                rotate: tabAnimations[state.index]?.scale.interpolate({
                  inputRange: [1, 1.15],
                  outputRange: ['0deg', '5deg']
                })
              }]
            }
          ]} 
        />
        <Animated.View 
          style={[
            styles.tabDecoCircleSmall,
            {
              transform: [{
                rotate: tabAnimations[state.index]?.scale.interpolate({
                  inputRange: [1, 1.15],
                  outputRange: ['0deg', '-3deg']
                })
              }]
            }
          ]} 
        />

        {visibleRoutes.map((route, index) => {
          // Map the filtered index to the original state index
          const originalIndex = state.routes.findIndex(r => r.key === route.key);
          const isFocused = state.index === originalIndex;
          const anim = tabAnimations[originalIndex];

          const onPress = () => handleTabPress(route, originalIndex, isFocused);

          const icon = route.name === 'index' ? 'home' : 'person';

          return (
            <Pressable 
              key={route.key} 
              onPress={onPress} 
              style={({ pressed }) => [
                styles.sideItem,
                pressed && styles.tabPressed
              ]}
            >
              <Animated.View
                style={[
                  styles.tabContent,
                  {
                    transform: [{ scale: anim.scale }],
                  },
                ]}
              >
                {/* Icon with animation */}
                <Animated.View style={{ opacity: anim.opacity }}>
                  <Ionicons
                    name={icon}
                    size={19}
                    color={isFocused ? '#fff' : 'rgba(255,255,255,0.75)'}
                  />
                </Animated.View>

                {/* Label with fade animation */}
                <Animated.Text
                  numberOfLines={1}
                  style={[
                    styles.sideLabelRed,
                    { 
                      color: isFocused ? '#fff' : 'rgba(255,255,255,0.8)',
                      opacity: anim.opacity,
                      transform: [{
                        translateY: anim.opacity.interpolate({
                          inputRange: [0.7, 1],
                          outputRange: [2, 0]
                        })
                      }]
                    },
                    isRTL && { textAlign: 'right' },
                  ]}
                >
                  {getLabel(route.name)}
                </Animated.Text>

                {/* Animated active indicator */}
                <Animated.View 
                  style={[
                    styles.activeDot,
                    {
                      transform: [{ scale: anim.dotScale }],
                      opacity: anim.dotScale,
                    }
                  ]} 
                />
              </Animated.View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

/* =========================
   Enhanced Styles with Animation Support
   ========================= */
const styles = StyleSheet.create({
  /* Header */
  headerWrap: {
    backgroundColor: 'transparent',
  },
  header: {
    backgroundColor: COLORS.primary,
    minHeight: 96,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 12,
    // soft shadow under curved header
    ...Platform.select({
      ios: {
        shadowColor: COLORS.shadow,
        shadowOpacity: 0.15,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 6 },
      },
      android: { elevation: 6 },
    }),
  },
  titleBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: COLORS.text,
    fontWeight: '700',
    fontSize: 18,
    textAlign: 'center',
  },
  userName: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  iconBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtnPressed: {
    opacity: 0.7,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // circles for the light shapes on the right side of the header
  decoCircleBig: {
    position: 'absolute',
    right: -30,
    top: -10,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  decoCircleSmall: {
    position: 'absolute',
    right: 8,
    top: 28,
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: 'rgba(255,255,255,0.16)',
  },

  /* Bottom bar */
  wrapper: {
    position: 'absolute',
    left: 0, 
    right: 0, 
    bottom: 0,
    backgroundColor: 'transparent',
  },

  // Red, rounded, with soft shadow and decorative circles
  barRed: {
    marginHorizontal: 14,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingHorizontal: 18,
    paddingTop: 7,
    paddingBottom: 5,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: COLORS.shadow,
        shadowOpacity: 0.12,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 8 },
      },
      android: { elevation: 12 },
    }),
  },

  // translucent shapes like header
  tabDecoCircleBig: {
    position: 'absolute',
    right: -24,
    top: -26,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  tabDecoCircleSmall: {
    position: 'absolute',
    right: 6,
    top: 18,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.16)',
  },

  sideItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingVertical: 4,
  },
  tabPressed: {
    opacity: 0.8,
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  sideLabelRed: {
    fontSize: 10,
    marginTop: 1,
    fontWeight: '700',
  },
  activeDot: {
    marginTop: 6,
    width: 24,
    height: 3,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
});