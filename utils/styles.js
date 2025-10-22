import { Platform, StyleSheet } from 'react-native';
import { useLanguage } from '../contexts/LanguageContext';

const PRIMARY = '#E73C3C';
const PRIMARY_DARK = '#C42525';
const BG = '#FDF2F2';
const TEXT = '#1E1E1E';
const MUTED = '#7E7E7E';
const BORDER = '#E8E8E8';

const PRIMARY_LIGHT = "#FF6B6B";
const SUCCESS = "#27AE60";
const WARNING = "#F39C12";
const STAR = "#FFD700";
const CARD_BG = "#FFFFFF";
const TEXT_SECONDARY = "#5A5A5A";


const COLORS = {
  primary: '#E73C3C',
  primaryDark: '#C42525',
  text: '#1E1E1E',
  muted: '#7E7E7E',
  sheet: '#FFFFFF',
  divider: '#EFEFEF',
};

export const useRTLStyles = () => {
  const { isRTL } = useLanguage();

  const createRTLStyles = (styles) => {
    return StyleSheet.create(
      Object.keys(styles).reduce((acc, key) => {
        const style = styles[key];
        
        // Handle margin and padding for RTL
        if (style.marginLeft || style.marginRight) {
          acc[key] = {
            ...style,
            marginLeft: isRTL ? style.marginRight : style.marginLeft,
            marginRight: isRTL ? style.marginLeft : style.marginRight,
          };
        } else if (style.paddingLeft || style.paddingRight) {
          acc[key] = {
            ...style,
            paddingLeft: isRTL ? style.paddingRight : style.paddingLeft,
            paddingRight: isRTL ? style.paddingLeft : style.paddingRight,
          };
        } else {
          acc[key] = style;
        }
        
        return acc;
      }, {})
    );
  };

  return { createRTLStyles, isRTL };
};



export const globalStyle = StyleSheet.create(
  {
  capitalize: {textTransform: "capitalize"},
  safe: { flex: 1, backgroundColor: BG },
  container: { padding: 20, minHeight: '100%' },
  stepContainer: { flex: 1 },
  header: { alignItems: 'center', marginBottom: 16 },
  title: { fontSize: 24, fontWeight: '800', color: TEXT, textAlign: 'center' },
  step: { marginTop: 6, color: MUTED, fontWeight: '600', fontSize: 14 },
  progressTrack: {
    marginTop: 16,
    height: 6,
    width: '100%',
    backgroundColor: '#F3D0D0',
    borderRadius: 99,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: PRIMARY,
    borderRadius: 99,
  },
  avatarWrap: { alignItems: 'center', marginVertical: 16 },
  avatarTouchable: { alignItems: 'center' },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFE6E6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: PRIMARY,
    position: 'relative',
    overflow: 'hidden',
  },
    defaultAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FDF2F2',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E73C3C',
  },
  
  defaultAvatarText: {
    fontSize: 20,
  },
  
  verificationBadge: {
    backgroundColor: '#F0F8F0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  
  verificationBadgeText: {
    fontSize: 12,
    color: '#27ae60',
    fontWeight: '600',
  },
  
  loginBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E73C3C',
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  
  loginTxt: {
    color: '#E73C3C',
    fontWeight: '600',
    marginLeft: 8,
  },
  avatarImage: { width: '100%', height: '100%', borderRadius: 50 },
  avatarPlaceholder: { fontSize: 36 },
  avatarOverlay: {
    position: 'absolute',
    bottom: -4,
    backgroundColor: PRIMARY,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: BG,
  },
  avatarOverlayLTR: {
    right: -4,
  },
  avatarOverlayRTL: {
    left: -4,
  },
  avatarOverlayText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  avatarLabel: { marginTop: 8, color: MUTED, fontSize: 14 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#FFE6E6',
    shadowColor: PRIMARY,
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  label: { color: TEXT, marginBottom: 8, fontWeight: '600', fontSize: 14, textAlign: 'left' },
  inputWrap: {
    borderWidth: 1.5,
    borderColor: '#FFE6E6',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBFB',
  },
  inputError: { borderColor: '#EF4444' },
  inputIcon: { paddingHorizontal: 14, fontSize: 16 },
  input: {
    flex: 1,
    paddingHorizontal: 0,
    paddingVertical: 16,
    color: TEXT,
    fontSize: 16,
    fontWeight: '500',
  },
  inputWithIcon: {
    paddingLeft: 8,
  },
  inputRTL: {
    textAlign: 'right',
  },
  inputRight: { paddingHorizontal: 12 },
  error: { color: '#EF4444', marginTop: 6, fontSize: 12, fontWeight: '500', textAlign: 'left' },
  eye: { fontWeight: '700', color: PRIMARY, fontSize: 14 },
  fieldContainer: { marginBottom: 16, paddingHorizontal: 20 },
  bloodGroupScroll: { marginHorizontal: -20 },
  bloodGroupContent: {
    flexDirection: 'row',
    paddingVertical: 8,
    gap: 8,
  },
  bloodGroupContentRTL: {
    flexDirection: 'row-reverse',
  },
  bloodGroupBtn: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FFFBFB',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFE6E6',
    minWidth: 70,
    alignItems: 'center',
  },
  bloodGroupBtnSelected: {
    backgroundColor: PRIMARY,
    borderColor: PRIMARY,
  },
  bloodGroupText: {
    fontSize: 16,
    fontWeight: '700',
    color: TEXT,
  },
  bloodGroupTextSelected: {
    color: 'white',
  },
  locationPermissionCard: {
    backgroundColor: '#FFFBFB',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#FFE6E6',
    marginVertical: 8,
  },
  permissionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: TEXT,
    marginBottom: 6,
    textAlign: 'left',
  },
  permissionText: {
    fontSize: 13,
    color: MUTED,
    lineHeight: 18,
    marginBottom: 16,
    textAlign: 'left',
  },
  locationBtn: {
    backgroundColor: PRIMARY,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
  },
  locationBtnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  locationBtnText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 15,
  },
  locationBtnIcon: { fontSize: 16 },
  coordinatesContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: PRIMARY,
  },
  coordinatesContainerRTL: {
    borderLeftWidth: 0,
    borderRightWidth: 4,
    borderRightColor: PRIMARY,
  },
  coordinatesTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: MUTED,
    marginBottom: 4,
    textAlign: 'left',
  },
  coordinatesText: {
    fontSize: 11,
    color: TEXT,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    marginBottom: 2,
    textAlign: 'left',
  },
  coordinatesHelp: {
    fontSize: 10,
    color: MUTED,
    fontStyle: 'italic',
    marginTop: 4,
    textAlign: 'left',
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#FFE6E6',
    marginTop: 8,
  },
  toggleTextContainer: { flex: 1 },
  toggleTextContainerLTR: {
    paddingRight: 16,
  },
  toggleTextContainerRTL: {
    paddingLeft: 16,
  },
  toggleLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: TEXT,
    marginBottom: 4,
    textAlign: 'left',
  },
  toggleDescription: {
    fontSize: 12,
    color: MUTED,
    lineHeight: 16,
    textAlign: 'left',
  },
  toggleBtn: {
    width: 52,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E5E5E5',
    padding: 2,
    justifyContent: 'center',
  },
  toggleBtnActive: {
    backgroundColor: PRIMARY,
  },
  toggleKnob: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  toggleKnobActiveLTR: {
    transform: [{ translateX: 24 }],
  },
  toggleKnobActiveRTL: {
    transform: [{ translateX: -24 }],
  },
  primaryBtn: {
    backgroundColor: PRIMARY,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginVertical: 8,
    shadowColor: PRIMARY,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    flex: 1,
  },
  disabledBtn: {
    opacity: 0.5,
    shadowOpacity: 0.1,
  },
  primaryBtnText: {
    color: 'white',
    fontWeight: '800',
    fontSize: 16,
  },
  secondaryBtn: {
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginVertical: 8,
    borderWidth: 2,
    borderColor: PRIMARY,
    backgroundColor: 'transparent',
    flex: 1,
  },
  secondaryBtnLTR: {
    marginRight: 8,
  },
  secondaryBtnRTL: {
    marginLeft: 8,
  },
  secondaryBtnText: {
    color: PRIMARY,
    fontWeight: '700',
    fontSize: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButtonsRTL: {
    flexDirection: 'row-reverse',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#FFE6E6',
  },
  footerText: {
    color: MUTED,
    fontSize: 14,
  },
  footerLink: {
    color: PRIMARY,
    fontWeight: '700',
  },

  dropdownButton: {
    borderWidth: 1.5,
    borderColor: '#FFE6E6',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBFB',
    paddingVertical: 16,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  dropdownButtonRTL: {
    flexDirection: 'row-reverse',
  },
  dropdownButtonText: {
    fontSize: 16,
    color: TEXT,
    fontWeight: '500',
    flex: 1,
  },
  dropdownPlaceholder: {
    color: MUTED,
  },
  dropdownArrow: {
    fontSize: 12,
    color: MUTED,
    marginLeft: 8,
  },
  dropdownArrowRTL: {
    marginLeft: 0,
    marginRight: 8,
  },
  dropdownError: {
    borderColor: '#EF4444',
  },
  dropdownList: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#FFE6E6',
    borderRadius: 14,
    maxHeight: 200,
    zIndex: 1000,
    marginTop: 8,
    elevation: 8,
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  dropdownListRTL: {
    left: 0,
    right: 0,
  },
  dropdownScroll: {
    maxHeight: 200,
  },
  dropdownItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#FFE6E6',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBFB',
  },
  dropdownItemRTL: {
    flexDirection: 'row-reverse',
  },
  dropdownItemSelected: {
    backgroundColor: '#FEF2F2',
    borderLeftWidth: 4,
    borderLeftColor: PRIMARY,
  },
  dropdownItemSelectedRTL: {
    borderLeftWidth: 0,
    borderRightWidth: 4,
    borderRightColor: PRIMARY,
  },
  dropdownItemText: {
    fontSize: 16,
    color: TEXT,
    fontWeight: '500',
    flex: 1,
  },
  dropdownItemTextSelected: {
    color: PRIMARY,
    fontWeight: '700',
  },
    logoutBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#ff4757',
    borderRadius: 8,
  },
  
  logoutText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 16,
  },
  
  cooldownCard: {
    backgroundColor: '#e8f4fd',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#3498db',
  },
  
  cooldownTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 4,
  },
  
  cooldownText: {
    fontSize: 14,
    color: '#e74c3c',
    fontWeight: '600',
  },
  
  cooldownEligible: {
    color: '#27ae60',
  },
  
  lastDonationText: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 4,
  },
  
  donationBtn: {
    backgroundColor: '#e74c3c',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  
  donationBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },

  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 14,
    backgroundColor: '#fff',
    marginTop: 4,
  },
  
  dateInputText: {
    fontSize: 16,
    color: '#333',
  },
  
  dateInputPlaceholder: {
    color: '#999',
  },
  
  datePickerIcon: {
    fontSize: 18,
  },
  
  fixedCooldownContainer: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#f8f9fa',
    marginTop: 4,
  },
  
  fixedCooldownText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  
  fixedCooldownHelp: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
    lineHeight: 16,
  },

  
  verificationCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  
  verifiedCard: {
    backgroundColor: '#F0F8F0',
    borderColor: '#27ae60',
  },
  
  unverifiedCard: {
    backgroundColor: '#FFF5F5',
    borderColor: '#E73C3C',
  },
  
  verificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  
  verificationTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  
  verificationIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  
  verificationTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E1E1E',
    marginBottom: 2,
  },
  
  verificationSubtitle: {
    fontSize: 14,
    color: '#7E7E7E',
    fontWeight: '500',
  },
  
  verifiedBadge: {
    backgroundColor: '#27ae60',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginLeft: 12,
  },
  
  verifiedText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  
  verifyButton: {
    backgroundColor: '#E73C3C',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
    shadowColor: '#E73C3C',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  
  verifyButtonDisabled: {
    backgroundColor: '#7E7E7E',
    shadowOpacity: 0,
  },
  
  verifyButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    marginRight: 8,
  },
  
  verifyButtonIcon: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  
  verificationBody: {
    marginTop: 8,
  },
  
  verificationDescription: {
    fontSize: 14,
    color: '#1E1E1E',
    lineHeight: 20,
    marginBottom: 12,
  },
  
  verificationBenefits: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  
  benefitsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E1E1E',
    marginBottom: 8,
  },
  
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  
  benefitIcon: {
    color: '#27ae60',
    fontSize: 14,
    fontWeight: '700',
    marginRight: 8,
    width: 16,
  },
  
  benefitText: {
    fontSize: 13,
    color: '#7E7E7E',
    flex: 1,
  },


  drawer: {
  sheet: { flex: 1, backgroundColor: COLORS.sheet },
  header: { marginBottom: 12 },
  headerBg: {
    height: 128,
    backgroundColor: COLORS.primary,
  },
  closeBtn: {
    position: 'absolute',
    right: 16,
    top: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileRow: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 5,
    flexDirection: 'row', 
    alignItems: 'center',
    gap: 12,              
  },
  avatar: { width: 72, height: 72, borderRadius: 36, borderWidth: 3, borderColor: '#fff', backgroundColor: '#fff' },
  name: { fontSize: 18, fontWeight: '700', color: '#fff' },
  email: { fontSize: 13, fontWeight: '500', color: '#ffe9e9', marginTop: 2 },

  section: { paddingHorizontal: 16, paddingTop: 24 },
  divider: { height: 1, backgroundColor: COLORS.divider, marginTop: 12 },

  // Language selector
  langTitle: { fontSize: 14, fontWeight: '700', color: COLORS.muted, marginBottom: 10 },
  langRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  langPill: {
    paddingHorizontal: 12,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#e6e6e6',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 62,
  },
  langPillActive: {
    backgroundColor: '#FFF0F0',
    borderColor: '#F5C8C8',
  },
  langPillText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
  },
  langPillTextActive: {
    color: COLORS.primary,
  },

  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  itemIcon: {
    width: 28, alignItems: 'center', marginRight: 12,
  },
  itemLabel: { flex: 1, fontSize: 15, color: COLORS.text, fontWeight: '600' },

  logoutBtn: {
    marginTop: 16,
    marginHorizontal: 16,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F5C8C8',
    backgroundColor: '#FFF6F6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  logoutTxt: { color: COLORS.primary, fontWeight: '700', fontSize: 15 },

  footer: {
    paddingHorizontal: 16,
    marginTop: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  version: { color: COLORS.muted, fontSize: 12, marginRight: 8 },
  link: { color: COLORS.primary, fontSize: 12, fontWeight: '700' },
},
  home: (writingDirection) => ({
    root: { 
      flex: 1, 
      backgroundColor: BG,
    },
    headerBackground: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 185,
      backgroundColor: PRIMARY,
      borderBottomLeftRadius: 24,
      borderBottomRightRadius: 24,
    },
    topPad: { 
      paddingHorizontal: 20, 
      paddingTop: 15,
      paddingBottom: 16,
      zIndex: 10,
    },
    row: { 
      flexDirection: "row", 
      alignItems: "center" 
    },
    searchWrap: {
      backgroundColor: CARD_BG,
      borderRadius: 16,
      height: 52,
      alignItems: "center",
      shadowColor: PRIMARY_DARK,
      shadowOpacity: 0.1,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 6 },
      elevation: 4,
      borderWidth: 1,
      borderColor: "#FFE5E5",
    },
    searchIcon: { 
      marginLeft: 18, 
      marginRight: 12,
    },
    searchInput: {
      flex: 1,
      paddingVertical: 14,
      paddingRight: 16,
      fontSize: 16,
      color: TEXT,
      textAlign: "left",
      fontWeight: '500',
    },
    chipRow: { 
      marginTop: 16, 
      marginBottom: 8,
    },
    chip: {
      backgroundColor: CARD_BG,
      paddingHorizontal: 16,
      height: 40,
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 2,
      borderColor: "#FFE5E5",
      marginRight: 10,
      shadowColor: "#000",
      shadowOpacity: 0.06,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 3 },
      elevation: 2,
    },
    chipActive: {
      backgroundColor: PRIMARY,
      borderColor: PRIMARY_DARK,
      shadowColor: PRIMARY_DARK,
      shadowOpacity: 0.2,
    },
    chipText: { 
      color: TEXT, 
      fontSize: 14, 
      fontWeight: "600", 
      marginLeft: 6,
    },
    chipTextActive: {
      color: CARD_BG,
    },
    listPad: { 
      padding: 20, 
      paddingTop: 10,
      paddingBottom: 100,
    },
    card: {
      backgroundColor: CARD_BG,
      borderRadius: 20,
      padding: 18,
      marginVertical: 6,
      shadowColor: "#000",
      shadowOpacity: 0.08,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 8 },
      elevation: 4,
      borderWidth: 1,
      borderColor: "#FFF5F5",
    },
    avatarContainer: {
      position: 'relative',
    },
    avatar: { 
      width: 64, 
      height: 64, 
      borderRadius: 16, 
      marginRight: 16,
      borderWidth: 3,
      borderColor: "#FFE5E5",
    },
    onlineIndicator: {
      position: 'absolute',
      top: 2,
      right: 2,
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: SUCCESS,
      borderWidth: 2,
      borderColor: CARD_BG,
    },
    name: { 
      fontSize: 18, 
      fontWeight: "700", 
      color: TEXT, 
      writingDirection,
      marginBottom: 2,
    },
    location: {
      fontSize: 14,
      color: TEXT_SECONDARY,
      lineHeight: 20,
      writingDirection,
      fontWeight: '500',
    },
    infoRow: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 10,
      flexWrap: 'wrap',
    },
    infoTag: {
      backgroundColor: BG,
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 10,
      marginRight: 8,
      marginBottom: 4,
      borderWidth: 1,
      borderColor: "#FFE5E5",
    },
    infoText: {
      fontSize: 12,
      color: TEXT_SECONDARY,
      fontWeight: "600",
    },
    availabilityBadge: {
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 10,
      marginLeft: 6,
      marginBottom: 4,
    },
    available: {
      backgroundColor: "rgba(39, 174, 96, 0.1)",
      borderWidth: 1,
      borderColor: "rgba(39, 174, 96, 0.3)",
    },
    notAvailable: {
      backgroundColor: "rgba(243, 156, 18, 0.1)",
      borderWidth: 1,
      borderColor: "rgba(243, 156, 18, 0.3)",
    },
    availabilityText: {
      fontSize: 11,
      fontWeight: "700",
    },
    availableText: {
      color: SUCCESS,
    },
    notAvailableText: {
      color: WARNING,
    },
    actionsRow: { 
      marginTop: 16,
      justifyContent: 'space-between',
    },
    actionBtn: {
      paddingHorizontal: 20,
      height: 44,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: 'row',
      flex: 1,
      marginRight: 10,
    },
    actionSolid: { 
      backgroundColor: PRIMARY,
      shadowColor: PRIMARY_DARK,
      shadowOpacity: 0.3,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 4 },
      elevation: 3,
    },
    actionText: { 
      fontSize: 15, 
      fontWeight: "700",
      marginLeft: 6,
    },
    iconPill: {
      height: 44,
      width: 44,
      borderRadius: 12,
      backgroundColor: BG,
      borderColor: "#FFE5E5",
      borderWidth: 2,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: "#000",
      shadowOpacity: 0.05,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
      elevation: 1,
    },
    bloodBadge: {
      backgroundColor: BG,
      borderWidth: 2,
      borderColor: "#FFE5E5",
      height: 44,
      minWidth: 54,
      paddingHorizontal: 12,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      marginLeft: 12,
      shadowColor: "#000",
      shadowOpacity: 0.05,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
      elevation: 1,
    },
    bloodText: { 
      color: PRIMARY, 
      fontWeight: "800", 
      fontSize: 16,
    },
    ratingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 6,
    },
    ratingText: {
      fontSize: 13,
      color: TEXT_SECONDARY,
      fontWeight: '600',
      marginLeft: 4,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      justifyContent: 'flex-end',
    },
    modalContent: {
      backgroundColor: CARD_BG,
      borderTopLeftRadius: 28,
      borderTopRightRadius: 28,
      padding: 24,
      maxHeight: '85%',
      shadowColor: "#000",
      shadowOpacity: 0.25,
      shadowRadius: 20,
      shadowOffset: { width: 0, height: -4 },
      elevation: 10,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 28,
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: BORDER,
    },
    modalTitle: {
      fontSize: 22,
      fontWeight: '700',
      color: TEXT,
    },
    filterSection: {
      marginBottom: 28,
    },
    sectionTitle: {
      fontSize: 17,
      fontWeight: '600',
      color: TEXT,
      marginBottom: 16,
    },
    tagContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    filterTag: {
      paddingHorizontal: 18,
      paddingVertical: 12,
      borderRadius: 20,
      borderWidth: 2,
      borderColor: BORDER,
      backgroundColor: CARD_BG,
    },
    filterTagActive: {
      backgroundColor: PRIMARY,
      borderColor: PRIMARY_DARK,
    },
    filterTagText: {
      fontSize: 14,
      fontWeight: '600',
      color: TEXT,
    },
    filterTagTextActive: {
      color: CARD_BG,
    },
    modalActions: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 20,
      paddingTop: 20,
      borderTopWidth: 1,
      borderTopColor: BORDER,
    },
    modalButton: {
      flex: 1,
      height: 54,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
    },
    modalButtonPrimary: {
      backgroundColor: PRIMARY,
      borderColor: PRIMARY_DARK,
    },
    modalButtonSecondary: {
      backgroundColor: 'transparent',
      borderColor: BORDER,
    },
    modalButtonText: {
      fontSize: 16,
      fontWeight: '700',
    },
    modalButtonTextPrimary: {
      color: CARD_BG,
    },
    modalButtonTextSecondary: {
      color: TEXT,
    },
    sortOption: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 18,
      borderBottomWidth: 1,
      borderBottomColor: BORDER,
    },
    sortOptionText: {
      flex: 1,
      fontSize: 16,
      color: TEXT,
      fontWeight: '500',
      marginLeft: 16,
    },
    sortOptionSelected: {
      color: PRIMARY,
      fontWeight: '700',
    },
    emptyState: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 80,
      paddingHorizontal: 40,
    },
    emptyStateText: {
      fontSize: 17,
      color: MUTED,
      textAlign: 'center',
      marginTop: 16,
      fontWeight: '500',
      lineHeight: 24,
    },
    loadingFooter: {
      paddingVertical: 20,
      alignItems: 'center',
    },
    loadingText: {
      marginTop: 8,
      fontSize: 14,
      color: MUTED,
      fontWeight: '500',
    },
    activeFiltersBadge: {
      position: 'absolute',
      top: -4,
      right: -4,
      backgroundColor: PRIMARY,
      width: 18,
      height: 18,
      borderRadius: 9,
      alignItems: 'center',
      justifyContent: 'center',
    },
    activeFiltersText: {
      color: CARD_BG,
      fontSize: 10,
      fontWeight: '800',
    },
    statsContainer: {
      backgroundColor: CARD_BG,
      borderRadius: 16,
      padding: 16,
      marginHorizontal: 20,
      marginBottom: 16,
      shadowColor: "#000",
      shadowOpacity: 0.06,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 4 },
      elevation: 2,
      borderWidth: 1,
      borderColor: "#FFE5E5",
    },
    statsRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    statItem: {
      alignItems: 'center',
    },
    statValue: {
      fontSize: 20,
      fontWeight: '700',
      color: PRIMARY,
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 12,
      color: TEXT_SECONDARY,
      fontWeight: '600',
    },
    networkError: {
      backgroundColor: WARNING,
      padding: 12,
      marginHorizontal: 20,
      marginBottom: 16,
      borderRadius: 12,
      alignItems: 'center',
    },
    networkErrorText: {
      color: CARD_BG,
      fontSize: 14,
      fontWeight: '600',
      textAlign: 'center',
    },
  })
  
}
);