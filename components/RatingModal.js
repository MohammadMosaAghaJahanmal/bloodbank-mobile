// components/RatingModal.js
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { t } from '../utils/i18n';

const PRIMARY = "#E73C3C";
const CARD_BG = "#FFFFFF";
const TEXT = "#1E1E1E";
const MUTED = "#7E7E7E";

const RatingModal = ({ visible, onClose, donor, onSubmitRating }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [tempRating, setTempRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStarPress = (selectedRating) => {
    setRating(selectedRating);
  };

  const handleStarHover = (hoverRating) => {
    setTempRating(hoverRating);
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      Alert.alert(t('ERROR'), t('PLEASE_SELECT_RATING'));
      return;
    }

    if (!donor?.id) {
      Alert.alert(t('ERROR'), t('DONOR_NOT_FOUND'));
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmitRating({
        donorId: donor.id,
        score: rating,
        comment: comment.trim() || null,
      });
      
      // Reset form
      setRating(0);
      setComment('');
      setTempRating(0);
      onClose();
      
      Alert.alert(t('SUCCESS'), t('RATING_SUBMITTED'));
    } catch (error) {
      Alert.alert(t('ERROR'), t('RATING_SUBMISSION_FAILED'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (rating > 0 && !isSubmitting) {
      Alert.alert(
        t('UNSAVED_CHANGES'),
        t('RATING_NOT_SAVED_CONFIRM'),
        [
          { text: t('CANCEL'), style: 'cancel' },
          { 
            text: t('DISCARD'), 
            style: 'destructive',
            onPress: () => {
              setRating(0);
              setComment('');
              setTempRating(0);
              onClose();
            }
          },
        ]
      );
    } else {
      setRating(0);
      setComment('');
      setTempRating(0);
      onClose();
    }
  };

  const displayRating = tempRating > 0 ? tempRating : rating;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>{t('RATE_DONOR')}</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={MUTED} />
            </TouchableOpacity>
          </View>

          {/* Donor Info */}
          {donor && (
            <View style={styles.donorInfo}>
              <Text style={styles.donorName}>{donor.name}</Text>
              <Text style={styles.donorDetails}>
                {donor.blood} • {donor.location}
              </Text>
            </View>
          )}

          {/* Stars Rating */}
          <View style={styles.ratingSection}>
            <Text style={styles.ratingLabel}>{t('HOW_WAS_YOUR_EXPERIENCE')}</Text>
            
            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  onPress={() => handleStarPress(star)}
                  onPressIn={() => handleStarHover(star)}
                  onPressOut={() => handleStarHover(0)}
                  style={styles.starButton}
                  disabled={isSubmitting}
                >
                  <Ionicons
                    name={star <= displayRating ? "star" : "star-outline"}
                    size={40}
                    color={star <= displayRating ? "#FFD700" : MUTED}
                  />
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.ratingText}>
              {displayRating === 0 
                ? t('SELECT_RATING')
                : `${displayRating} ${displayRating === 1 ? t('STAR') : t('STARS')}`
              }
            </Text>
          </View>

          {/* Comment Input */}
          <View style={styles.commentSection}>
            <Text style={styles.commentLabel}>{t('OPTIONAL_COMMENT')}</Text>
            <TextInput
              style={styles.commentInput}
              placeholder={t('SHARE_YOUR_EXPERIENCE')}
              placeholderTextColor={MUTED}
              value={comment}
              onChangeText={setComment}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              editable={!isSubmitting}
            />
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleClose}
              disabled={isSubmitting}
            >
              <Text style={styles.cancelButtonText}>{t('CANCEL')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                styles.submitButton,
                (rating === 0 || isSubmitting) && styles.submitButtonDisabled
              ]}
              onPress={handleSubmit}
              disabled={rating === 0 || isSubmitting}
            >
              <Text style={styles.submitButtonText}>
                {isSubmitting ? t('SUBMITTING') : t('SUBMIT_RATING')}
              </Text>
            </TouchableOpacity>
          </View>
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
  modalContent: {
    backgroundColor: CARD_BG,
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: TEXT,
  },
  closeButton: {
    padding: 4,
  },
  donorInfo: {
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  donorName: {
    fontSize: 18,
    fontWeight: '600',
    color: TEXT,
    marginBottom: 4,
  },
  donorDetails: {
    fontSize: 14,
    color: MUTED,
  },
  ratingSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  ratingLabel: {
    fontSize: 16,
    color: TEXT,
    marginBottom: 16,
    textAlign: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 8,
  },
  starButton: {
    padding: 8,
    marginHorizontal: 4,
  },
  ratingText: {
    fontSize: 14,
    color: MUTED,
    textAlign: 'center',
  },
  commentSection: {
    marginBottom: 24,
  },
  commentLabel: {
    fontSize: 16,
    color: TEXT,
    marginBottom: 8,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#DDD',
  },
  submitButton: {
    backgroundColor: PRIMARY,
  },
  submitButtonDisabled: {
    backgroundColor: MUTED,
  },
  cancelButtonText: {
    fontSize: 16,
    color: MUTED,
    fontWeight: '600',
  },
  submitButtonText: {
    fontSize: 16,
    color: CARD_BG,
    fontWeight: '600',
  },
});

export default RatingModal;