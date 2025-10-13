// components/HeaderMenuButton.js
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';

export default function HeaderMenuButton() {
  const navigation = useNavigation();
  
  return (
    <TouchableOpacity 
      onPress={() => navigation.toggleDrawer()}
      style={{ paddingHorizontal: 15 }}
    >
      <Ionicons name="menu" size={24} color="black" />
    </TouchableOpacity>
  );
}