import { Platform, StyleSheet } from 'react-native';
import { useLanguage } from '../contexts/LanguageContext';

const PRIMARY = '#E73C3C';
const PRIMARY_DARK = '#C42525';
const BG = '#FDF2F2';
const TEXT = '#1E1E1E';
const MUTED = '#7E7E7E';
const BORDER = '#E8E8E8';



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
  
}
);