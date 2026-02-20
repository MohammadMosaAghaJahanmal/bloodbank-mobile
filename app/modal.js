import { Link } from 'expo-router';
import { Text, View } from 'react-native';
export default function ModalScreen() {
  return (
    <View style={{ flex: 1, gap: 10, alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <Text style={{ fontSize: 20 }}>This is a modal</Text>
      <Link href="/(tabs)" style={{ color: '#3b82f6', fontSize: 16 }}>
        Go Back To Home
      </Link>
    </View>
  );
}
