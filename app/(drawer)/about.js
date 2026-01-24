// app/screens/AboutUsScreen.js
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { memo } from 'react';
import {
  Image,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import CS_LOGO from '../../assets/images/cs-logo.png';
import APP_LOGO from '../../assets/images/logo-drop.png';
import UNIVERSITY_LOGO from '../../assets/images/university-logo.png';
import Header from '../../components/Header';
import { useRTLStyles } from '../../contexts/useRTLStyles';
import { t } from '../../utils/i18n';
import { COLORS, globalStyle } from '../../utils/styles';
// Reusable Card
// eslint-disable-next-line react/display-name
const Card = memo(({ style, children, testID }) => (
  <View testID={testID} style={[styles.card, style]} accessibilityRole="summary" accessibilityHint="Card">
    {children}
  </View>
));

const AboutUsScreen = () => {
  const { createRTLStyles, isRTL, writingDirection } = useRTLStyles();
  const rstyles = createRTLStyles(globalStyle.about(writingDirection));


  const teamMembers = [
    { name: t('MOSA_AGHA'), role: t('PROJECT_MEMBER') },
    { name: t('BILAL_TOKHI'), role: t('PROJECT_MEMBER') },
    { name: t('NAJIB_SULIMAN'), role: t('PROJECT_MEMBER') },
    { name: t('NASRAT_KHAWRIN'), role: t('PROJECT_MEMBER') },
    { name: t('SANA_SAMIM'), role: t('PROJECT_MEMBER') },
  ];

  const openWebsite = (url) => {
    Linking.openURL(url).catch((err) => console.error('Failed to open URL:', err));
  };
  const openEmail = (email) => {
    Linking.openURL(`mailto:${email}`).catch((err) => console.error('Failed to open email:', err));
  };
  const openTel = (email) => {
    Linking.openURL(`tel:${email}`).catch((err) => console.error('Failed to open email:', err));
  };

  const renderTeamMember = (member, index) => {
    const initials = member.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 3)
      .toUpperCase();

    return (
      <Card key={`${member.name}-${index}`} style={rstyles.memberCard}>
        <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={rstyles.memberAvatar}>
          <Text style={rstyles.memberInitial}>{initials}</Text>
        </LinearGradient>
        <View style={rstyles.memberInfo}>
          <Text style={[rstyles.memberName, isRTL && { direction: writingDirection, marginRight: 5 }]} accessibilityRole="header">
            {member.name}
          </Text>
          <Text style={[rstyles.memberRole, isRTL && { direction: writingDirection, marginRight: 5 }]}>{member.role}</Text>
        </View>
      </Card>
    );
  };

  return (
    <SafeAreaView style={rstyles.safe} edges={['bottom']}>
      <Header title={t('ABOUT_US')} subTitle={t('OUR_STORY')} />

      <ScrollView
        contentContainerStyle={rstyles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Hero Banner */}
        <LinearGradient
          colors={[COLORS.primary, COLORS.primaryDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={rstyles.hero}
        >
          <View style={rstyles.heroLeft}>
            <Text style={[rstyles.heroTitle, isRTL && { direction: writingDirection}]} accessibilityRole="header">
              {t('BLOOD_BANK_APP')}
            </Text>
            <Text style={[rstyles.heroSubtitle, isRTL && { direction: writingDirection}]}>{t('SAVING_LIVES_TOGETHER')}</Text>

            <View style={rstyles.heroChips}>
              <View style={rstyles.chip}>
                <Ionicons name="shield-checkmark-outline" size={16} style={rstyles.chipIcon} />
                <Text style={[rstyles.chipText, isRTL && { direction: writingDirection, marginRight: 3 }]}>{t('LIFE_SAVER')}</Text>
              </View>
              <View style={rstyles.chip}>
                <Ionicons name="medkit-outline" size={16} style={rstyles.chipIcon} />
                <Text style={[rstyles.chipText, isRTL && { direction: writingDirection, marginRight: 3 }]}>{t('SAFE_TIMELY')}</Text>
              </View>
              <View style={rstyles.chip}>
                <Ionicons name="people-outline" size={16} style={rstyles.chipIcon} />
                <Text style={[rstyles.chipText, isRTL && { direction: writingDirection, marginRight: 3 }]}>{t('COMMUNITY')}</Text>
              </View>
            </View>
          </View>

          <View style={rstyles.heroLogoWrap} accessible accessibilityLabel="App Logo">
            <Image
              source={APP_LOGO}
              style={rstyles.heroLogo}
              resizeMode="contain"
            />
          </View>
        </LinearGradient>

        {/* Brands */}
        <View style={rstyles.brandRow}>
          <Card style={rstyles.brandCard}>
            <View style={rstyles.brandLogoWrap}>
              <Image
                source={APP_LOGO}
                style={rstyles.brandLogo}
                resizeMode="contain"
              />
            </View>
            <Text style={[rstyles.brandTitle, isRTL && { direction: writingDirection }]}>{t('BLOOD_BANK_APP')}</Text>
            <Text style={[rstyles.brandSubtitle, isRTL && { direction: writingDirection }]}>{t('LIFE_SAVER')}</Text>
          </Card>

          <Card style={rstyles.brandCard}>
            <View style={rstyles.brandLogoWrap}>
              <Image
                source={UNIVERSITY_LOGO}
                style={rstyles.brandLogo}
                resizeMode="contain"
              />
            </View>
            <Text style={[rstyles.brandTitle, isRTL && { direction: writingDirection }]}>{t('SABA_UNIVERSITY')}</Text>
            <Text style={[rstyles.brandSubtitle, isRTL && { direction: writingDirection }]}>{t('EXCELLENCE_IN_EDUCATION')}</Text>
          </Card>
        </View>

        {/* Project */}
        <Card>
          <View style={rstyles.sectionHeader}>
            <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={rstyles.sectionIcon}>
              <Ionicons name="rocket-outline" size={22} color="#fff" />
            </LinearGradient>
            <View>
              <Text style={[rstyles.sectionTitle, isRTL && { direction: writingDirection, marginRight: 10 }]}>{t('OUR_PROJECT')}</Text>
              <Text style={[rstyles.sectionSubtitleMuted, isRTL && { direction: writingDirection, marginRight: 10 }]}>{t('COMPUTER_SCIENCE')}</Text>
            </View>
          </View>

          <Text style={[rstyles.body, isRTL && { direction: writingDirection }]}>{t('PROJECT_DESCRIPTION')}</Text>

          <View style={rstyles.statsRow}>
            <View style={rstyles.statItem}>
              <Text style={rstyles.statNumber}>5</Text>
              <Text style={[rstyles.statLabel, isRTL && { direction: writingDirection, textAlign: "center" }]}>{t('DEVELOPERS')}</Text>
            </View>
            <View style={rstyles.statDivider} />
            <View style={rstyles.statItem}>
              <Text style={rstyles.statNumber}>1</Text>
              <Text style={[rstyles.statLabel, isRTL && { direction: writingDirection, textAlign: "center" }]}>{t('YEAR')}</Text>
            </View>
            <View style={rstyles.statDivider} />
            <View style={rstyles.statItem}>
              <Text style={rstyles.statNumber}>∞</Text>
              <Text style={[rstyles.statLabel, isRTL && { direction: writingDirection, textAlign: "center" }]}>{t('LIVES_IMPACTED')}</Text>
            </View>
          </View>
        </Card>

        {/* Team */}
        <Card>
          <View style={rstyles.sectionHeader}>
            <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={rstyles.sectionIcon}>
              <Ionicons name="people-outline" size={22} color="#fff" />
            </LinearGradient>
            <View>
              <Text style={[rstyles.sectionTitle, isRTL && { direction: writingDirection, marginRight: 5 }]}>{t('DEVELOPMENT_TEAM')}</Text>
              <Text style={[rstyles.sectionSubtitleMuted, isRTL && { direction: writingDirection, marginRight: 5 }]}>{t('COMPUTER_SCIENCE_STUDENTS')}</Text>
            </View>
          </View>

          <View style={rstyles.teamGrid}>
            {teamMembers.map((m, i) => renderTeamMember(m, i))}
          </View>
        </Card>

        {/* Guidance Teacher */}
        <Card>
          <View style={rstyles.sectionHeader}>
            <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={rstyles.sectionIcon}>
              <Ionicons name="school-outline" size={22} color="#fff" />
            </LinearGradient>
            <Text style={[rstyles.sectionTitle, isRTL && { direction: writingDirection, marginRight: 5 }]}>{t('PROJECT_SUPERVISOR')}</Text>
          </View>

          <View style={rstyles.teacherRow}>
            <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={rstyles.teacherAvatar}>
              <Ionicons name="person" size={28} color="#fff" />
            </LinearGradient>
            <View style={rstyles.teacherInfo}>
              <Text style={[rstyles.teacherName, isRTL && { direction: writingDirection, marginRight: 5 }]}>{t('AHMADI_SAHIB')}</Text>
              <Text style={[rstyles.teacherRole, isRTL && { direction: writingDirection, marginRight: 5 }]}>{t('PROJECT_SUPERVISOR')}</Text>
              <Text style={[rstyles.teacherBio, isRTL && { direction: writingDirection, marginRight: 5 }]}>
                {t('TEACHER_BIO')}
              </Text>
            </View>
          </View>
          <View style={[rstyles.divider, {marginTop: 10}]} />

          <Pressable
            onPress={() => openEmail('eng.rohullahahmadi01@gmail.com')}
            android_ripple={{ color: COLORS.primaryLight }}
            style={rstyles.contactItem}
            accessibilityRole="button"
            accessibilityHint="Compose email"
          >
            <View style={rstyles.contactIcon}>
              <Ionicons name="mail-outline" size={18} color={COLORS.primary} />
            </View>
            <View style={rstyles.contactTextWrap}>
              <Text style={[rstyles.contactLabel, isRTL && { direction: writingDirection, marginRight: 5 }]}>{t('EMAIL_ADDRESS')}</Text>
              <Text style={[rstyles.contactValue, isRTL && { direction: writingDirection, marginRight: 5 }]} numberOfLines={1}>
                eng.rohullahahmadi01@gmail.com
              </Text>
            </View>
            <Ionicons name={isRTL ? 'chevron-back' : 'chevron-forward'} size={18} color={COLORS.muted} />
          </Pressable>
        </Card>

        {/* Contact */}
        <Card>
          <View style={rstyles.sectionHeader}>
            <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={rstyles.sectionIcon}>
              <Ionicons name="call-outline" size={22} color="#fff" />
            </LinearGradient>
            <Text style={[rstyles.sectionTitle, isRTL && { direction: writingDirection, marginRight: 5 }]}>{t('CONTACT_INFO')}</Text>
          </View>

          {/* <Pressable
            onPress={() => openWebsite('https://saba.edu.af')}
            android_ripple={{ color: COLORS.primaryLight }}
            style={rstyles.contactItem}
            accessibilityRole="link"
            accessibilityHint="Open university website"
          >
            <View style={rstyles.contactIcon}>
              <Ionicons name="globe-outline" size={18} color={COLORS.primary} />
            </View>
            <View style={rstyles.contactTextWrap}>
              <Text style={[rstyles.contactLabel, isRTL && { direction: writingDirection, marginRight: 5 }]}>{t('UNIVERSITY_WEBSITE')}</Text>
              <Text style={[rstyles.contactValue, isRTL && { direction: writingDirection, marginRight: 5 }]} numberOfLines={1}>
                https://saba.edu.af
              </Text>
            </View>
            <Ionicons name={isRTL ? 'chevron-back' : 'chevron-forward'} size={18} color={COLORS.muted} />
          </Pressable> */}
          

          <View style={rstyles.divider} />

          <Pressable
            onPress={() => openEmail('info@saba.edu.af')}
            android_ripple={{ color: COLORS.primaryLight }}
            style={rstyles.contactItem}
            accessibilityRole="button"
            accessibilityHint="Compose email"
          >
            <View style={rstyles.contactIcon}>
              <Ionicons name="mail-outline" size={18} color={COLORS.primary} />
            </View>
            <View style={rstyles.contactTextWrap}>
              <Text style={[rstyles.contactLabel, isRTL && { direction: writingDirection, marginRight: 5 }]}>{t('EMAIL_ADDRESS')}</Text>
              <Text style={[rstyles.contactValue, isRTL && { direction: writingDirection, marginRight: 5 }]} numberOfLines={1}>
                info@saba.edu.af
              </Text>
            </View>
            <Ionicons name={isRTL ? 'chevron-back' : 'chevron-forward'} size={18} color={COLORS.muted} />
          </Pressable>
          <Pressable
            onPress={() => openTel('+93708092814')}
            android_ripple={{ color: COLORS.primaryLight }}
            style={rstyles.contactItem}
            accessibilityRole="button"
            accessibilityHint="Compose Phone Call"
          >
            <View style={rstyles.contactIcon}>
              <Ionicons name="call-outline" size={18} color={COLORS.primary} />
            </View>
            <View style={rstyles.contactTextWrap}>
              <Text style={[rstyles.contactLabel, isRTL && { direction: writingDirection, marginRight: 5 }]}>{t('MOBILE_NUMBER')}</Text>
              <Text style={[rstyles.contactValue, isRTL && { direction: writingDirection, marginRight: 5 }]} numberOfLines={1}>
                +93708092814
              </Text>
            </View>
            <Ionicons name={isRTL ? 'chevron-back' : 'chevron-forward'} size={18} color={COLORS.muted} />
          </Pressable>
        </Card>

        {/* Mission */}
        <LinearGradient
          colors={[COLORS.primary, COLORS.primaryDark]}
          style={rstyles.mission}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={rstyles.missionIconWrap}>
            {/* <Ionicons name="heart" size={28} color="#fff" /> */}
            <Image
              source={CS_LOGO}
              style={rstyles.brandLogo}
              resizeMode="contain"
            />
          </View>
          <Text style={[rstyles.missionTitle, isRTL && { direction: writingDirection, marginRight: 5 }]}> {t('OUR_MISSION')}</Text>
          <Text style={[rstyles.missionText, isRTL && { direction: writingDirection, marginRight: 5 }]}>{t('MISSION_STATEMENT')}</Text>
          <View style={rstyles.missionDivider} />
          <Text style={[rstyles.missionQuote, isRTL && { direction: writingDirection, marginRight: 5 }]}>
            {t('MISSION_QUOTE')}
          </Text>
        </LinearGradient>

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default AboutUsScreen;


const baseRadius = 14;
const gap = 14;
const side = 18;

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.sheet,
    borderRadius: baseRadius,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.border,
    padding: side,
    marginBottom: gap,
    ...(Platform.OS === 'ios'
      ? { shadowColor: '#00000022', shadowOpacity: 1, shadowRadius: 10, shadowOffset: { width: 0, height: 5 } }
      : { elevation: 1 }),
  },
});