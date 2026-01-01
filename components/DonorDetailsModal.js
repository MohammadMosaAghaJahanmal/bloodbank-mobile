import { Ionicons } from "@expo/vector-icons";
import {
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { COLORS } from "../utils/styles";

const { width } = Dimensions.get('window');


const DonorDetailsModal = ({ visible, donor, onClose, t }) => {
  if (!donor) return null;

  const DetailItem = ({ icon, label, value, color = COLORS.text }) => (
    <View style={styles.detailItem}>
      <View style={styles.iconContainer}>
        <Ionicons name={icon} size={20} color={COLORS.primary} />
      </View>
      <View style={styles.detailContent}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={[styles.detailValue, { color }]}>{value}</Text>
      </View>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerIcon}>
              <Ionicons name="heart" size={24} color={COLORS.primary} />
            </View>
            <Text style={styles.title}>{t('DONOR_DETAILS')}</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color={COLORS.muted} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            
            {/* Blood Type */}
            <DetailItem
              icon="water"
              label={t('BLOOD_TYPE')}
              value={donor.blood}
              color={COLORS.primary}
            />
            {/* Location */}
            <DetailItem
              icon="location"
              label={t('LOCATION')}
              value={donor.location}
            />
            {/* Last Donation */}
            <DetailItem
              icon="calendar"
              label={t('LAST_DONATION')}
              value={donor.lastDonation === "Never Donated" ? t("NEVER_DONATED") : donor.lastDonation}
            />
            {/* Distance */}
            <DetailItem
              icon="navigate"
              label={t('DISTANCE')}
              value={donor.distance === 'Unknown' ? t("UNKNOWN") : donor.distance}
            />
            {/* Contact */}
            <DetailItem
              icon="call"
              label={t('CONTACT')}
              value={donor.phone}
            />

            {/* Rating */}
            <View style={styles.ratingContainer}>
              <View style={styles.detailItem}>
                <View style={styles.iconContainer}>
                  <Ionicons name="star" size={20} color={COLORS.warning} />
                </View>
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>{t('RATING')}</Text>
                  <View style={styles.ratingRow}>
                    <Text style={styles.ratingValue}>{donor.rating.average}</Text>
                    <Ionicons name="star" size={16} color={COLORS.warning} />
                    <Text style={styles.ratingCount}>({donor.rating.total} {t('RATINGS')})</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Total Donated */}
            <DetailItem
              icon="medkit"
              label={t('TOTAL_DONATED')}
              value={donor.donationCount.toString()}
              color={COLORS.success}
            />
            <View style={{marginBottom: 20}}></View>
          </ScrollView>

          {/* Footer Button */}
          <TouchableOpacity style={styles.closeActionButton} onPress={onClose}>
            <Text style={styles.closeActionText}>{t('CLOSE')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: COLORS.sheet,
    borderRadius: 20,
    width: width - 40,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 10,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 20,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: COLORS.muted,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '500',
  },
  ratingContainer: {
    marginVertical: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingValue: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: 'bold',
    marginRight: 4,
  },
  ratingCount: {
    fontSize: 14,
    color: COLORS.muted,
    marginLeft: 4,
  },
  closeActionButton: {
    backgroundColor: COLORS.primary,
    margin: 20,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  closeActionText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DonorDetailsModal;