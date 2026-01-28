// app/(drawer)/(tabs)/home/index.js
import { Ionicons } from "@expo/vector-icons";
import * as Location from 'expo-location';
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Image,
  Linking,
  Pressable,
  RefreshControl,
  Text,
  Platform,
  TextInput,
  View
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import DonorDetailsModal from "../../../components/DonorDetailsModal";
import FilterModal from "../../../components/FilterModal";
import RatingModal from "../../../components/RatingModal";
import SortModal from "../../../components/SortModal";
import { AFGHANISTAN_PROVINCES } from '../../../constants/theme';
import { useRTLStyles } from "../../../contexts/useRTLStyles";
import { t } from "../../../utils/i18n";
import serverPath from "../../../utils/serverPath";
import { globalStyle } from "../../../utils/styles";
const PRIMARY = "#E73C3C";
const CARD_BG = "#FFFFFF";
const TEXT = "#1E1E1E";
const MUTED = "#7E7E7E";

export default function HomeScreen() {
  
  const SORT_OPTIONS = [
    { 
      id: "recent", 
      label: t('SORT_RECENT'), 
      icon: "time", 
      translationKey: "SORT_RECENT" 
    },
    { 
      id: "name", 
      label: t('SORT_NAME_ASC'), 
      icon: "person", 
      translationKey: "SORT_NAME_ASC" 
    },
    { 
      id: "blood", 
      label: t('SORT_BLOOD_TYPE'), 
      icon: "water", 
      translationKey: "SORT_BLOOD_TYPE" 
    },
    { 
      id: "location", 
      label: t('LOCATION'), 
      icon: "location", 
      translationKey: "LOCATION" 
    },
    { 
      id: "distance", 
      label: t('SORT_DISTANCE'), 
      icon: "navigate", 
      translationKey: "SORT_DISTANCE" 
    },
    { 
      id: "rating", 
      label: t('SORT_RATING'), 
      icon: "star", 
      translationKey: "SORT_RATING" 
    },
  ];

  const { createRTLStyles, isRTL, writingDirection } = useRTLStyles();
  const [query, setQuery] = useState("");
  const [selectedBloodTypes, setSelectedBloodTypes] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [sortBy, setSortBy] = useState("recent");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [donors, setDonors] = useState([]);
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);


  const [filterOptions, setFilterOptions] = useState({ bloodTypes: [], locations: [] });
  const [stats, setStats] = useState({ totalDonors: 0, availableDonors: 0, availability: 0 });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasMore: false,
    limit: 20
  });
  const [userLocation, setUserLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [isNearbyActive, setIsNearbyActive] = useState(false);
  const [selectedDonorForRating, setSelectedDonorForRating] = useState(null);
  
  const scrollY = useRef(new Animated.Value(0)).current;
  const searchInputRef = useRef(null);
  const flatListRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  // API Call Functions
  const apiCall = async (endpoint, options = {}) => {
    try {
      const response = await fetch(serverPath(endpoint), {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API call failed:', error);
      throw error;
    }
  };

  // Submit rating function
  const submitRating = async (ratingData) => {
    return await apiCall('/api/rating', {
      method: 'POST',
      body: JSON.stringify(ratingData),
    });
  };

  // Handle rating submission
  const handleRatingSubmit = async (ratingData) => {
    await submitRating(ratingData);
  };

  // Get user location
  const getUserLocation = async () => {
    setLocationLoading(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          t('PERMISSION_DENIED'),
          t('LOCATION_PERMISSION_REQUIRED'),
          [{ text: t('OK') }]
        );
        setLocationLoading(false);
        return null;
      }

      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      
      const { latitude, longitude } = location.coords;
      setUserLocation({ latitude, longitude });
      
      return { latitude, longitude };
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert(
        t('LOCATION_ERROR'),
        t('UNABLE_TO_GET_LOCATION'),
        [{ text: t('OK') }]
      );
      return null;
    } finally {
      setLocationLoading(false);
    }
  };

  // Toggle nearby donors
  const toggleNearbyDonors = async () => {
    if (locationLoading) return;

    if (isNearbyActive) {
      setIsNearbyActive(false);
      setUserLocation(null);
      setSortBy('recent');
      fetchDonors(1, true);
    } else {
      let location = await getUserLocation();
      
      if (location) {
        setIsNearbyActive(true);
        setSelectedBloodTypes([]);
        setSelectedLocations([]);
        setQuery('');
        setSortBy('distance');
        fetchDonors(1, true, location);
      }
    }
  };

  // Fetch filter options
  const fetchFilterOptions = async () => {
    try {
      const result = await apiCall('/api/donors/filters');
      if (result.status === 'success') {
        setFilterOptions(result.data);
      }
    } catch (error) {
      console.error('Error fetching filter options:', error);
      Alert.alert(t('ERROR'), t('FAILED_TO_LOAD_FILTERS'));
    }
  };

  // Fetch donor statistics
  const fetchDonorStats = async () => {
    try {
      const result = await apiCall('/api/donors/stats');
      if (result.status === 'success') {
        setStats(result.data);
      }
    } catch (error) {
      console.error('Error fetching donor stats:', error);
    }
  };

  // Fetch donors from API
  const fetchDonors = async (page = 1, reset = false, location = null) => {
    if ((reset ? loading : loadingMore)) return;
    
    if (reset) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        sortBy,
        query: query.trim(),
        bloodTypes: selectedBloodTypes.join(','),
        locations: selectedLocations.join(','),
      });

      if (isNearbyActive && userLocation) {
        params.append('latitude', userLocation.latitude.toString());
        params.append('longitude', userLocation.longitude.toString());
      } else if (location) {
        params.append('latitude', location.latitude.toString());
        params.append('longitude', location.longitude.toString());
      }

      const result = await apiCall(`/api/donors/search?${params}`);

      if (result.status === 'success') {
        if (reset) {
          setDonors(result.data.donors);
        } else {
          setDonors(prev => [...prev, ...result.data.donors]);
        }
        setPagination(result.data.pagination);
      } else {
        Alert.alert(t('ERROR'), result.message || t('FAILED_TO_FETCH_DONORS'));
      }
    } catch (error) {
      console.error('Error fetching donors:', error);
      Alert.alert(t('CONNECTION_ERROR'), t('CHECK_INTERNET_CONNECTION'));
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  };

  // Initial data loading
  useEffect(() => {
    fetchFilterOptions();
    fetchDonorStats();
    fetchDonors(1, true);
  }, []);

  // Search with debounce
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      fetchDonors(1, true);
    }, 500);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [query]);

  // Fetch when filters change
  useEffect(() => {
    fetchDonors(1, true);
  }, [selectedBloodTypes, selectedLocations, sortBy, isNearbyActive]);

  // Load more donors for pagination
  const loadMoreDonors = useCallback(() => {
    if (loadingMore || !pagination.hasMore) return;
    fetchDonors(pagination.currentPage + 1, false);
  }, [loadingMore, pagination]);

  // Pull to refresh
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchDonors(1, true);
    fetchDonorStats();
  }, []);

  const handleBloodTypeToggle = (bloodType) => {
    setSelectedBloodTypes(prev => 
      prev.includes(bloodType) 
        ? prev.filter(type => type !== bloodType)
        : [...prev, bloodType]
    );
  };

  const handleLocationToggle = (location) => {
    setSelectedLocations(prev => 
      prev.includes(location) 
        ? prev.filter(loc => loc !== location)
        : [...prev, location]
    );
  };

  const handleSortSelect = (sortOption) => {
    setSortBy(sortOption);
    setShowSortModal(false);
  };

  const handleClearFilters = () => {
    setSelectedBloodTypes([]);
    setSelectedLocations([]);
    setSortBy('recent');
    setQuery('');
    setUserLocation(null);
    setIsNearbyActive(false);
  };

  const handleViewDetails = (donor) => {
    setSelectedDonor(donor);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedDonor(null);
  };

  const DEFAULT_COUNTRY_CODE = '93'; 

  const toWhatsAppNumber = (raw) => {
    let n = String(raw).replace(/\D/g, '');
    if (n.startsWith('00')) n = n.slice(2);
    if (n.startsWith('0')) n = DEFAULT_COUNTRY_CODE + n.slice(1);
    if (!n.startsWith(DEFAULT_COUNTRY_CODE) && n.length <= 10) {
      n = DEFAULT_COUNTRY_CODE + n;
    }
    return n;
  };

  const openWhatsApp = async (rawPhone) => {
    const phone = toWhatsAppNumber(rawPhone);
    const appUrl = `whatsapp://send?phone=${phone}`;
    const webUrl = `https://wa.me/${phone}`;

    try {
      const supported = await Linking.canOpenURL(appUrl);
      if (supported) {
        await Linking.openURL(appUrl);
        return true;
      }
      await Linking.openURL(webUrl);
      return true;
    } catch (e) {
      Alert.alert(t('ERROR'), t('WHATSAPP_NOT_INSTALLED'));
      return false;
    }
  };

  const handleCall = async (donor) => {
    try {
      const tel = `tel:${donor.phone}`;
      const supported = await Linking.canOpenURL(tel);
      if (supported) {
        await Linking.openURL(tel);
        return true;
      } else {
        Alert.alert(t('ERROR'), t('CANNOT_MAKE_CALLS'));
        return false;
      }
    } catch {
      Alert.alert(t('ERROR'), t('CANNOT_MAKE_CALLS'));
      return false;
    }
  };

  const showContactOptions = (donor) => {
    Alert.alert(
      t('CONTACT_DONOR'),
      t('CONTACT_DONOR_CONFIRMATION', { name: donor.name, phone: donor.phone }),
      [
        { text: t('CANCEL'), style: 'cancel' },
        {
          text: t('CALL'),
          onPress: async () => {
            const success = await handleCall(donor);
            if (success) {
              // Show rating modal after successful call
              setSelectedDonorForRating(donor);
              setTimeout(() => setShowRatingModal(true), 1000);
            }
          },
        },
        {
          text: t('WHATSAPP'),
          onPress: async () => {
            const success = await openWhatsApp(donor.phone);
            if (success) {
              // Show rating modal after successful WhatsApp
              setSelectedDonorForRating(donor);
              setTimeout(() => setShowRatingModal(true), 1000);
            }
          },
        },
      ]
    );
  };

  const closeRatingModal = () => {
    setShowRatingModal(false);
    setSelectedDonorForRating(null);
  };

  const s = createRTLStyles(globalStyle.home(writingDirection));

  const renderItem = ({ item, index }) => (
    <Animated.View
      style={[
        s.card,
        {
          opacity: scrollY.interpolate({
            inputRange: [0, 50 * index, 100 * index],
            outputRange: [1, 1, 1],
            extrapolate: 'clamp',
          }),
          transform: [
            {
              scale: scrollY.interpolate({
                inputRange: [0, 100],
                outputRange: [1, 0.98],
                extrapolate: 'clamp',
              }),
            },
          ],
        },
      ]}
    >
      <View style={s.row}>
        <View style={s.avatarContainer}>
          <Image 
            source={{ uri: serverPath(item.avatar) || `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70) + 1}` }} 
            style={s.avatar} 
            defaultSource={require('../../../assets/images/logo-drop.png')}
          />
        </View>
        
        <View style={{ flex: 1 }}>
          <View style={[s.row, { justifyContent: 'space-between' }]}>
            <Text style={[s.name, {textTransform: "capitalize"}]}>{item.name}</Text>
            <View style={s.bloodBadge}>
              <Text style={s.bloodText}>{item.blood}</Text>
            </View>
          </View>
          
          <View style={s.ratingContainer}>
            <Text style={[s.location, isRTL && {direction: "rtl"}]} numberOfLines={1}>
              { AFGHANISTAN_PROVINCES?.find(per => per.id === item.province?.toLowerCase())?.[isRTL ? "ps"  : "en" ] }
            </Text>
          </View>

          <View style={s.infoRow}>
            <View style={s.infoTag}>
              <Text style={s.infoText}>📍 {item.distance === 'Unknown' ? t("UNKNOWN") : item.distance}</Text>
            </View>
            <View style={s.infoTag}>
              <Text style={s.infoText}>
                <Ionicons name="star" size={12} color="#FFD700" /> {item.rating.average} ({item.rating.total > 10? "10+" : item.rating.total})
              </Text>
            </View>
          </View>

          <View style={[s.row, s.actionsRow]}>
            <Pressable 
              style={({ pressed }) => [
                s.actionBtn, 
                s.actionSolid, 
                { 
                  opacity: pressed ? 0.8 : 1,
                  transform: [{ scale: pressed ? 0.98 : 1 }]
                }
              ]} 
              onPress={() => handleViewDetails(item)}
            >
              <Ionicons name="information-circle" size={18} color="#fff" />
              <Text style={[s.actionText, { color: "#fff", direction: writingDirection }]}>
                {t('DETAILS')}
              </Text>
            </Pressable>

            <Pressable 
              style={({ pressed }) => [
                s.iconPill, 
                { 
                  opacity: pressed ? 0.8 : 1,
                  transform: [{ scale: pressed ? 0.95 : 1 }]
                }
              ]} 
              onPress={() => showContactOptions(item)}
            >
              <Ionicons name="call" size={20} color={PRIMARY} />
            </Pressable>
          </View>
        </View>
      </View>
    </Animated.View>
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    
    return (
      <View style={s.loadingFooter}>
        <ActivityIndicator size="small" color={PRIMARY} />
        <Text style={s.loadingText}>{t('LOADING_MORE_DONORS')}</Text>
      </View>
    );
  };

  const activeFiltersCount = selectedBloodTypes.length + selectedLocations.length;

  const headerOpacity = scrollY.interpolate({
    inputRange: [160, 160, 160],
    outputRange: [1, 1, 1],
    extrapolate: 'clamp',
  });

  const headerTranslate = scrollY.interpolate({
    inputRange: [100, 100],
    outputRange: [-20, -20],
    extrapolate: 'clamp',
  });

  return (
    <SafeAreaView style={s.root}>
      <Animated.View 
        style={[
          s.headerBackground,
          {
            opacity: headerOpacity,
            transform: [{ translateY: headerTranslate }],
          }
        ]}
      />
      
      <View style={s.topPad}>
        <View style={[s.searchWrap, s.row]}>
          <Ionicons name="search" size={22} color={MUTED} style={s.searchIcon} />
          <TextInput
            ref={searchInputRef}
            value={query}
            onChangeText={setQuery}
            placeholder={t('SEARCH_DONORS_PLACEHOLDER')}
            placeholderTextColor={MUTED}
            style={[s.searchInput, { direction: writingDirection }]}
            returnKeyType="search"
          />
          {query.length > 0 && (
            <Pressable 
              onPress={() => setQuery('')} 
              style={({ pressed }) => [{ padding: 8 }, { opacity: pressed ? 0.7 : 1 }]}
            >
              <Ionicons name="close-circle" size={20} color={MUTED} />
            </Pressable>
          )}
        </View>

        <View style={[s.row, s.chipRow]}>
          {/* Sort Button */}
          <Pressable 
            style={({ pressed }) => [
              s.chip, 
              sortBy !== 'recent' && s.chipActive,
              { opacity: pressed ? 0.8 : 1 }
            ]} 
            onPress={() => setShowSortModal(true)}
          >
            <Ionicons 
              name="swap-vertical" 
              size={16} 
              color={sortBy !== 'recent' ? CARD_BG : TEXT} 
            />
            <Text style={[s.chipText, sortBy !== 'recent' && s.chipTextActive]}>
              {SORT_OPTIONS.find(opt => opt.id === sortBy)?.label || t('SORT')}
            </Text>
          </Pressable>

          {/* Filter Button */}
          <Pressable 
            style={({ pressed }) => [
              s.chip, 
              activeFiltersCount > 0 && s.chipActive,
              { opacity: pressed ? 0.8 : 1 }
            ]} 
            onPress={() => setShowFilterModal(true)}
          >
            <View style={{ position: 'relative' }}>
              <Ionicons 
                name="filter" 
                size={16} 
                color={activeFiltersCount > 0 ? CARD_BG : TEXT} 
              />
              {activeFiltersCount > 0 && (
                <View style={s.activeFiltersBadge}>
                  <Text style={s.activeFiltersText}>
                    {activeFiltersCount}
                  </Text>
                </View>
              )}
            </View>
            <Text style={[
              s.chipText, 
              activeFiltersCount > 0 && s.chipTextActive
            ]}>
              {t('FILTER')}
            </Text>
          </Pressable>

          {/* Nearby Toggle Button */}
          <Pressable 
            style={({ pressed }) => [
              s.chip, 
              isNearbyActive && s.chipActive,
              { 
                opacity: locationLoading ? 0.6 : (pressed ? 0.8 : 1)
              }
            ]} 
            onPress={toggleNearbyDonors}
            disabled={locationLoading}
          >
            {locationLoading ? (
              <ActivityIndicator size="small" color={isNearbyActive ? CARD_BG : PRIMARY} />
            ) : (
              <Ionicons 
                name={isNearbyActive ? "location" : "location-outline"} 
                size={16} 
                color={isNearbyActive ? CARD_BG : TEXT} 
              />
            )}
            <Text style={[
              s.chipText, 
              isNearbyActive && s.chipTextActive
            ]}>
              {locationLoading ? t('FINDING') : (isNearbyActive ? t('NEARBY') : t('NEARBY'))}
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Donors List */}
      {loading && donors.length === 0 ? (
        <View style={s.loadingFooter}>
          <ActivityIndicator size="large" color={PRIMARY} />
          <Text style={s.loadingText}>
            {isNearbyActive ? t('FINDING_NEARBY_DONORS') : t('LOADING_DONORS')}
          </Text>
        </View>
      ) : (
        <Animated.FlatList
          ref={flatListRef}
          data={donors}
          keyExtractor={(it) => it.id}
          renderItem={renderItem}
          contentContainerStyle={s.listPad}
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: Platform.OS === "androidr" }
          )}
          scrollEventThrottle={16}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[PRIMARY]}
              tintColor={PRIMARY}
            />
          }
          onEndReached={loadMoreDonors}
          onEndReachedThreshold={0.3}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={
            <View style={s.emptyState}>
              <Ionicons name="search-outline" size={72} color={MUTED} />
              <Text style={s.emptyStateText}>
                {isNearbyActive 
                  ? t('NO_DONORS_NEAR_LOCATION')
                  : query || activeFiltersCount > 0 
                  ? t('NO_DONORS_MATCHING_SEARCH')
                  : t('NO_DONORS_AVAILABLE')
                }
              </Text>
            </View>
          }
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={10}
          removeClippedSubviews={Platform.OS === 'android'}
        />
      )}

      <FilterModal
        showFilterModal={showFilterModal}
        setShowFilterModal={setShowFilterModal}
        filterOptions={filterOptions}
        selectedBloodTypes={selectedBloodTypes}
        handleBloodTypeToggle={handleBloodTypeToggle}
        selectedLocations={selectedLocations}
        handleLocationToggle={handleLocationToggle}
        handleClearFilters={handleClearFilters}
      />
      <SortModal
        showSortModal={showSortModal}
        setShowSortModal={setShowSortModal}
        SORT_OPTIONS={SORT_OPTIONS}
        handleSortSelect={handleSortSelect}
        sortBy={sortBy}
      />
      
      <RatingModal
        visible={showRatingModal}
        onClose={closeRatingModal}
        donor={selectedDonorForRating}
        onSubmitRating={handleRatingSubmit}
      />
      <DonorDetailsModal
        visible={modalVisible}
        donor={selectedDonor}
        onClose={handleCloseModal}
        t={t} // Replace with your translation function
      />
    </SafeAreaView>
  );
}