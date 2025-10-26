import { Ionicons } from "@expo/vector-icons";
import { Modal, Pressable, Text, View } from "react-native";
import { useRTLStyles } from "../contexts/useRTLStyles";
import { t } from "../utils/i18n";
import { globalStyle } from "../utils/styles";

const MUTED = "#7E7E7E";
const PRIMARY = "#E73C3C";

const SortModal = ({
  showSortModal,
  setShowSortModal,
  SORT_OPTIONS,
  handleSortSelect,
  sortBy,
}) => {

  const { createRTLStyles, writingDirection } = useRTLStyles();
  const s = createRTLStyles(globalStyle.home(writingDirection));
      
  return (
    <Modal
      visible={showSortModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowSortModal(false)}
    >
      <View style={s.modalOverlay}>
        <View style={s.modalContent}>
          <View style={s.modalHeader}>
            <Text style={s.modalTitle}>{t('SORT_BY')}</Text>
            <Pressable
              onPress={() => setShowSortModal(false)}
              style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
            >
              <Ionicons name="close" size={26} color={MUTED} />
            </Pressable>
          </View>

          {SORT_OPTIONS.map(option => (
            <Pressable
              key={option.id}
              style={({ pressed }) => [
                s.sortOption,
                { opacity: pressed ? 0.7 : 1 }
              ]}
              onPress={() => handleSortSelect(option.id)}
            >
              <Ionicons 
                name={option.icon} 
                size={20} 
                color={sortBy === option.id ? PRIMARY : MUTED} 
              />
              <Text style={[
                s.sortOptionText,
                sortBy === option.id && s.sortOptionSelected
              ]}>
                {t(option.translationKey) || option.label}
              </Text>
              {sortBy === option.id && (
                <Ionicons name="checkmark" size={22} color={PRIMARY} />
              )}
            </Pressable>
          ))}
        </View>
      </View>
    </Modal>
  )};

export default SortModal;