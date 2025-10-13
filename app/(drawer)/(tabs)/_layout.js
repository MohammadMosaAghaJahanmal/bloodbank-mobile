import { DrawerToggleButton } from '@react-navigation/drawer';
import { Tabs } from 'expo-router';
import { useLanguage } from '../../../contexts/LanguageContext';
import i18n from '../../../utils/i18n';

export default function TabsLayout() {
  const { isRTL } = useLanguage();

  return (
    <Tabs
      screenOptions={{
        headerLeft: isRTL ? undefined : () => <DrawerToggleButton />,
        headerRight: isRTL ? () => <DrawerToggleButton /> : undefined,
        headerTitleAlign: isRTL ? 'right' : 'left',
      }}
    >
      <Tabs.Screen 
        name="index" 
        options={{ 
          title: i18n.t('HOME'),
        }} 
      />
      <Tabs.Screen 
        name="settings" 
        options={{ 
          title: i18n.t('SETTINGS'),
        }} 
      />
      <Tabs.Screen 
        name="profile" 
        options={{ 
          title: i18n.t('PROFILE'),
        }} 
      />
    </Tabs>
  );
}