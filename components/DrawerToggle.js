// components/DrawerToggle.js
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import { TouchableOpacity } from 'react-native';

export default function DrawerToggle() {
  const navigation = useNavigation();
  
  return (
    <TouchableOpacity 
      onPress={() => navigation.toggleDrawer()}
      style={{ marginLeft: 15 }}
    >
      <Ionicons name="menu" size={24} color="black" />
    </TouchableOpacity>
  );
}