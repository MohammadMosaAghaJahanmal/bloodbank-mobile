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
  TextInput,
  View
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import FilterModal from "../../../components/FilterModal";
import SortModal from "../../../components/SortModal";
import { useRTLStyles } from "../../../contexts/useRTLStyles";
import serverPath from "../../../utils/serverPath";
import { globalStyle } from "../../../utils/styles";


const PRIMARY = "#E73C3C";
const CARD_BG = "#FFFFFF";
const TEXT = "#1E1E1E";
const MUTED = "#7E7E7E";

const SORT_OPTIONS = [
  { id: "recent", label: "Most Recent", icon: "time" },
  { id: "name", label: "Name", icon: "person" },
  { id: "blood", label: "Blood Type", icon: "water" },
  { id: "location", label: "Location", icon: "location" },
];

export default function HomeScreen() {
  const { createRTLStyles, isRTL, writingDirection } = useRTLStyles();
  const [query, setQuery] = useState("");
  const [selectedBloodTypes, setSelectedBloodTypes] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [sortBy, setSortBy] = useState("recent");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [donors, setDonors] = useState([]);
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

  // Get user location
  const getUserLocation = async () => {
    setLocationLoading(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          "Permission Denied",
          "Location permission is required to find nearby donors.",
          [{ text: "OK" }]
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
        "Location Error",
        "Unable to get your location. Please try again.",
        [{ text: "OK" }]
      );
      return null;
    } finally {
      setLocationLoading(false);
    }
  };

  // Toggle nearby donors
  const toggleNearbyDonors = async () => {
    if (locationLoading) return; // Prevent pressing while loading

    if (isNearbyActive) {
      // Turn off nearby filter
      setIsNearbyActive(false);
      setUserLocation(null);
      setSortBy('recent');
      // Fetch donors without location
      fetchDonors(1, true);
    } else {
      // Turn on nearby filter
      let location = await getUserLocation();
      
      if (location) {
        setIsNearbyActive(true);
        // Clear other filters when using location
        setSelectedBloodTypes([]);
        setSelectedLocations([]);
        setQuery('');
        setSortBy('distance');
        
        // Fetch donors with location
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
      Alert.alert("Error", "Failed to load filter options");
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

  // Fetch donors from API - Updated to accept location
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

      // Add location parameters if nearby is active
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
        Alert.alert("Error", result.message || "Failed to fetch donors");
      }
    } catch (error) {
      console.error('Error fetching donors:', error);
      Alert.alert("Connection Error", "Please check your internet connection and try again.");
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
    Alert.alert(
      "Donor Details",
      `🩸 Blood Type: ${donor.blood}\n📍 Location: ${donor.location}\n⏰ Last Donation: ${donor.lastDonation}\n📏 Distance: ${donor.distance}\n📞 Contact: ${donor.phone}\n\nStatus: ${donor.availability}`,
      [{ text: "Close", style: "cancel" }]
    );
  };

const handleCall = (donor) => {
  Alert.alert(
    "Call Donor",
    `Call ${donor.name} at ${donor.phone}?`,
    [
      { text: "Cancel", style: "cancel" },
      {
        text: "Call",
        onPress: async () => {
          const phoneNumber = `tel:${donor.phone}`;
          const supported = await Linking.canOpenURL(phoneNumber);
          if (supported) {
            await Linking.openURL(phoneNumber);
          } else {
            Alert.alert("Error", "Your device cannot make phone calls.");
          }
        },
      },
    ]
  );
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
          
          <Text style={s.location} numberOfLines={1}>
            {item.province?.toUpperCase()}
          </Text>

          <View style={s.infoRow}>
            <View style={s.infoTag}>
              <Text style={s.infoText}>📍 {item.distance}</Text>
            </View>
            <View style={s.infoTag}>
              <Text style={s.infoText}>⏰ {item.lastDonation}</Text>
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
              <Text style={[s.actionText, { color: "#fff", writingDirection }]}>
                Details
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
              onPress={() => handleCall(item)}
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
        <Text style={s.loadingText}>Loading more donors...</Text>
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
            placeholder="Search donors by name, blood type, or location..."
            placeholderTextColor={MUTED}
            style={[s.searchInput, { writingDirection }]}
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
              {SORT_OPTIONS.find(opt => opt.id === sortBy)?.label || 'Sort'}
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
              Filter
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
              {locationLoading ? "Finding..." : (isNearbyActive ? "Nearby" : "Nearby")}
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Donors List */}
      {loading && donors.length === 0 ? (
        <View style={s.loadingFooter}>
          <ActivityIndicator size="large" color={PRIMARY} />
          <Text style={s.loadingText}>
            {isNearbyActive ? "Finding nearby donors..." : "Loading donors..."}
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
            { useNativeDriver: true }
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
                  ? "No donors found near your location"
                  : query || activeFiltersCount > 0 
                  ? "No donors found matching your search criteria"
                  : "No donors available at the moment"
                }
              </Text>
            </View>
          }
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={10}
          removeClippedSubviews={true}
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
    </SafeAreaView>
  );
}