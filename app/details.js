import { useLocalSearchParams, useRouter } from 'expo-router';
import { Button, Text, View } from 'react-native';

export default function DetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  return (
    <View style={{ flex: 1, gap: 12, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 20 }}>Details Screen</Text>
      <Text>id: {id ?? 'none'}</Text>
      <Button title="Go back" onPress={() => router.back()} />
    </View>
  );
}
