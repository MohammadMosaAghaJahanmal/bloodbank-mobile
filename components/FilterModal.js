import { Ionicons } from "@expo/vector-icons";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";
import { useRTLStyles } from "../contexts/useRTLStyles";
import { globalStyle } from "../utils/styles";


const MUTED = "#7E7E7E";

  const FilterModal = ({
    showFilterModal,
    setShowFilterModal,
    filterOptions,
    selectedBloodTypes,
    handleBloodTypeToggle,
    selectedLocations,
    handleLocationToggle,
    handleClearFilters
  }) => {
      const { createRTLStyles, writingDirection } = useRTLStyles();
      const s = createRTLStyles(globalStyle.home(writingDirection));
    
    
    
    return (
    <Modal
      visible={showFilterModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowFilterModal(false)}
    >
      <View style={s.modalOverlay}>
        <View style={s.modalContent}>
          <View style={s.modalHeader}>
            <Text style={s.modalTitle}>Filter Donors</Text>
            <Pressable 
              onPress={() => setShowFilterModal(false)}
              style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
            >
              <Ionicons name="close" size={26} color={MUTED} />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={s.filterSection}>
              <Text style={s.sectionTitle}>Blood Type</Text>
              <View style={s.tagContainer}>
                {filterOptions.bloodTypes.map(bloodType => (
                  <Pressable
                    key={bloodType}
                    style={({ pressed }) => [
                      s.filterTag,
                      selectedBloodTypes.includes(bloodType) && s.filterTagActive,
                      { opacity: pressed ? 0.7 : 1 }
                    ]}
                    onPress={() => handleBloodTypeToggle(bloodType)}
                  >
                    <Text style={[
                      s.filterTagText,
                      selectedBloodTypes.includes(bloodType) && s.filterTagTextActive
                    ]}>
                      {bloodType}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={s.filterSection}>
              <Text style={s.sectionTitle}>Location</Text>
              <View style={s.tagContainer}>
                {filterOptions.locations.slice(0, 20).map(location => (
                  <Pressable
                    key={location}
                    style={({ pressed }) => [
                      s.filterTag,
                      selectedLocations.includes(location) && s.filterTagActive,
                      { opacity: pressed ? 0.7 : 1 }
                    ]}
                    onPress={() => handleLocationToggle(location)}
                  >
                    <Text style={[
                      [
                        s.filterTagText,
                        selectedLocations.includes(location) && s.filterTagTextActive,
                        {textTransform: "capitalize"}
                      ]
                    ]}>
                      {location}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </ScrollView>

          <View style={s.modalActions}>
            <Pressable 
              style={({ pressed }) => [
                s.modalButton, 
                s.modalButtonSecondary,
                { opacity: pressed ? 0.7 : 1 }
              ]}
              onPress={handleClearFilters}
            >
              <Text style={[s.modalButtonText, s.modalButtonTextSecondary]}>
                Clear All
              </Text>
            </Pressable>
            <Pressable 
              style={({ pressed }) => [
                s.modalButton, 
                s.modalButtonPrimary,
                { opacity: pressed ? 0.9 : 1 }
              ]}
              onPress={() => setShowFilterModal(false)}
            >
              <Text style={[s.modalButtonText, s.modalButtonTextPrimary]}>
                Apply Filters
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );}



  export default FilterModal;