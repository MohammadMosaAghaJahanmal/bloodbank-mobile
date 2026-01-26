import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../utils/i18n';
import { COLORS, globalStyle } from '../utils/styles';

const { drawer: styles } = globalStyle;

export default function DeleteAccountModal({ visible, onClose, onSubmit }) {
  const { isRTL } = useLanguage();
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!reason.trim()) {
      Alert.alert(
        t('REQUIRED_FIELD') || 'Required',
        t('DELETE_ACCOUNT_REASON_REQUIRED') || 'Please Provide A Reason For Deleting Your Account.'
      );
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(reason.trim());
      setReason('');
      onClose();
    } catch (error) {
      console.error('Error submitting delete request:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setReason('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {t('DELETE_ACCOUNT') || 'Delete Account'}
            </Text>
            <Text style={styles.modalSubtitle}>
              {t('DELETE_ACCOUNT_CONFIRMATION') || 'Are you sure you want to delete your account? This action cannot be undone.'}
            </Text>
          </View>

          {/* Reason Input */}
          <View style={styles.inputContainer}>
            <Text style={[
              styles.inputLabel,
              { textAlign: isRTL ? 'right' : 'left' }
            ]}>
              {t('REASON_FOR_DELETION') || 'Reason for deletion'} *
            </Text>
            <TextInput
              style={[
                styles.textInput,
                isRTL && { textAlign: 'right' }
              ]}
              placeholder={t('ENTER_REASON_PLACEHOLDER') || 'Please tell us why you want to delete your account...'}
              placeholderTextColor={COLORS.muted}
              value={reason}
              onChangeText={setReason}
              multiline={true}
              numberOfLines={4}
              textAlignVertical="top"
              editable={!isSubmitting}
            />
          </View>

          {/* Buttons */}
          <View style={[
            styles.modalButtons,
            isRTL && { flexDirection: 'row-reverse' }
          ]}>
            <Pressable
              style={[styles.modalButton, styles.cancelButton]}
              onPress={handleCancel}
              disabled={isSubmitting}
            >
              <Text style={styles.cancelButtonText}>
                {t('CANCEL') || 'Cancel'}
              </Text>
            </Pressable>
            
            <Pressable
              style={[
                styles.modalButton,
                styles.deleteButton,
                isSubmitting && styles.deleteButtonDisabled
              ]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.deleteButtonText}>
                  {t('DELETE_ACCOUNT') || 'Delete Account'}
                </Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}