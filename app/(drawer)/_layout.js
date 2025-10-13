import { Drawer } from 'expo-router/drawer';
import { useLanguage } from '../../contexts/LanguageContext';
import I18n from '../../utils/i18n';

export default function DrawerLayout() {
  const { isRTL } = useLanguage();

  return (
    <Drawer
      screenOptions={{
        drawerPosition: isRTL ? 'right' : 'left',
        headerTitleAlign: isRTL ? 'right' : 'left',
        drawerStyle: {
          width: 240,
        },
      }}
    >
      <Drawer.Screen 
        name="(tabs)" 
        options={{ 
          title: I18n.t('HOME'),
          headerShown: false,
        }} 
      />
      <Drawer.Screen 
        name="about" 
        options={{ 
          title: I18n.t('ABOUT'),
        }} 
      />
      <Drawer.Screen 
        name="welcome" 
        options={{ 
          title: I18n.t('WELCOME'),
        }} 
      />
      <Drawer.Screen 
        name="language-settings" 
        options={{ 
          title: I18n.t('LANGUAGE'),
        }} 
      />
    </Drawer>
  );
}