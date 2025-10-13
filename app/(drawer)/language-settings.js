import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useLanguage } from '../../contexts/LanguageContext';
import i18n, { getSystemLocales } from '../../utils/i18n';

const languages = [
  { code: 'en', name: 'English', dir: 'LTR' },
  { code: 'ar', name: 'العربية', dir: 'RTL' },
  { code: 'he', name: 'עברית', dir: 'RTL' },
];

export default function LanguageSettings() {
  const { isRTL, currentLocale, toggleLanguage } = useLanguage();
  const systemLocales = getSystemLocales();

  return (
    <View style={[styles.container, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
      <Text style={[styles.title, { textAlign: isRTL ? 'right' : 'left' }]}>
        {i18n.t('LANGUAGE')}
      </Text>
      
      <Text style={[styles.subtitle, { textAlign: isRTL ? 'right' : 'left' }]}>
        System Language: {systemLocales[0]?.languageCode} - {systemLocales[0]?.languageTag}
      </Text>
      
      {languages.map((lang) => (
        <TouchableOpacity
          key={lang.code}
          style={[
            styles.languageButton,
            { 
              flexDirection: isRTL ? 'row-reverse' : 'row',
              backgroundColor: currentLocale.startsWith(lang.code) ? '#e3f2fd' : 'white'
            }
          ]}
          onPress={() => toggleLanguage(lang.code)}
        >
          <Text style={styles.languageText}>{lang.name}</Text>
          <Text style={styles.directionText}>({lang.dir})</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 20,
  },
  languageButton: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  languageText: {
    fontSize: 18,
    marginHorizontal: 10,
  },
  directionText: {
    fontSize: 14,
    color: 'gray',
  },
});