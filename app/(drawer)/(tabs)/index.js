import { StyleSheet, Text, View } from 'react-native';
import { useLanguage } from '../../../contexts/LanguageContext';
import i18n from '../../../utils/i18n';

export default function HomeScreen() {
  const { isRTL } = useLanguage();

  return (
    <View style={[styles.container, { direction: isRTL ? 'rtl' : 'ltr' }]}>
      <Text style={[styles.title, { textAlign: isRTL ? 'right' : 'left' }]}>
        {i18n.t('HOME')}
      </Text>
      <Text style={[styles.info, { textAlign: isRTL ? 'right' : 'left' }]}>
        Current direction: {isRTL ? 'RTL' : 'LTR'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 10,
  },
  info: {
    fontSize: 14,
    color: 'blue',
  },
});