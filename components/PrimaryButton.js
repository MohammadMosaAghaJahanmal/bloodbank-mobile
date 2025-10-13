import { Pressable, Text } from 'react-native';

export default function PrimaryButton({ label, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        backgroundColor: pressed ? '#2563eb' : '#3b82f6',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 10,
      })}
    >
      <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>{label}</Text>
    </Pressable>
  );
}
