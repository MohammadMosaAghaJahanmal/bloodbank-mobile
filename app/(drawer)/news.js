// app/screens/NewsScreen.tsx
import { Ionicons } from '@expo/vector-icons';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Image,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/Header';
import { useRTLStyles } from '../../contexts/useRTLStyles';
import i18n, { t } from '../../utils/i18n';
import serverPath from '../../utils/serverPath';
import { COLORS, globalStyle } from '../../utils/styles';


const NewsScreen = () => {
  const { createRTLStyles, isRTL, writingDirection } = useRTLStyles();
  
  const styles = createRTLStyles(globalStyle);
  
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasMore: false,
    limit: 10
  });

  const scrollY = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);
  const modalScrollRef = useRef(null);

  // API call function
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

  // Fetch news from API
  const fetchNews = async (page = 1, reset = false) => {
    if ((reset ? loading : loadingMore)) return;
    
    if (reset) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
      });

      const result = await apiCall(`/api/news?${params}`);

      if (result.status === 'success') {
        if (reset) {
          setNews(result.data.news);
        } else {
          setNews(prev => [...prev, ...result.data.news]);
        }
        setPagination(result.data.pagination);
      } else {
        console.error('Failed to fetch news:', result.message);
      }
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  };

  // Initial data loading
  useEffect(() => {
    fetchNews(1, true);
  }, []);

  // Load more news for pagination
  const loadMoreNews = useCallback(() => {
    if (loadingMore || !pagination?.hasMore) return;
    fetchNews(pagination.currentPage + 1, false);
  }, [loadingMore, pagination]);

  // Pull to refresh
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchNews(1, true);
  }, []);

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(i18n.locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Truncate content for preview
  const truncateContent = (content, maxLength = 120) => {
    if (content?.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  // Handle read more press - show modal with full details
  const handleReadMore = (newsItem) => {
    setSelectedNews(newsItem);
    setModalVisible(true);
  };

  // Close modal
  const closeModal = () => {
    setModalVisible(false);
    setSelectedNews(null);
  };



  const renderNewsItem = ({ item, index }) => (
    <Animated.View
      style={[
        styles.newsCard,
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
      {/* News Image */}
      {item.imageUrl && (
        <View style={styles.newsImageContainer}>
          <Image 
            source={{ uri: serverPath(item.imageUrl) }} 
            style={styles.newsImage}
            resizeMode="cover"
            defaultSource={require('../../assets/images/icon.png')}
          />
        </View>
      )}

      {/* News Content */}
      <View style={styles.newsContent}>
        <Text style={[styles.newsTitle, { direction: writingDirection }]} numberOfLines={2}>
          {item.title}
        </Text>
        
        <Text style={[styles.newsDate, { direction: writingDirection }]}>
          <Ionicons name="time-outline" size={14} color={COLORS.muted} />
          {' '}{formatDate(item.publishedAt)}
        </Text>
        
        <Text style={[styles.newsContentText, { direction: writingDirection }]} numberOfLines={3}>
          {truncateContent(item.content)}
        </Text>

        <Pressable 
          style={({ pressed }) => [
            styles.readMoreButton,
            { opacity: pressed ? 0.7 : 1 }
          ]}
          onPress={() => handleReadMore(item)}
        >
          <Text style={[styles.readMoreText, { direction: writingDirection }]}>
            {t('READ_MORE')}
          </Text>
          <Ionicons 
            name={isRTL ? "chevron-back" : "chevron-forward"} 
            size={16} 
            color={COLORS.primary} 
          />
        </Pressable>
      </View>
    </Animated.View>
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    
    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator size="small" color={COLORS.primary} />
        <Text style={[styles.loadingText, { direction: writingDirection }]}>{t('LOADING_MORE_NEWS')}</Text>
      </View>
    );
  };

  // News Detail Modal
  const renderNewsModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={closeModal}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { direction: writingDirection }]}>
              {t('NEWS_DETAILS')}
            </Text>
            <Pressable 
              onPress={closeModal}
              style={({ pressed }) => [
                styles.closeButton,
                { opacity: pressed ? 0.7 : 1 }
              ]}
            >
              <Ionicons name="close" size={24} color={COLORS.text} />
            </Pressable>
          </View>

          {selectedNews && (
            <ScrollView 
              ref={modalScrollRef}
              style={styles.modalContent}
              showsVerticalScrollIndicator={false}
            >
              {/* News Image */}
              {selectedNews.imageUrl && (
                <View style={styles.modalImageContainer}>
                  <Image 
                    source={{ uri: serverPath(selectedNews.imageUrl) }} 
                    style={styles.modalImage}
                    resizeMode="cover"
                    defaultSource={require('../../assets/images/icon.png')}
                  />
                </View>
              )}

              {/* News Content */}
              <View style={styles.modalNewsContent}>
                <Text style={[styles.modalNewsTitle, { direction: writingDirection }]}>
                  {selectedNews.title}
                </Text>
                
                <View style={styles.modalMeta}>
                  <View style={styles.modalMetaItem}>
                    <Ionicons name="time-outline" size={16} color={COLORS.muted} />
                    <Text style={[styles.modalMetaText, { direction: writingDirection }]}>
                      {formatDate(selectedNews.publishedAt)}
                    </Text>
                  </View>

                </View>

                <View style={styles.modalDivider} />

                <Text style={[styles.modalNewsContentText, { direction: writingDirection, lineHeight: 24 }]}>
                  {selectedNews.content}
                </Text>
              </View>
            </ScrollView>
          )}

          {/* Close Button */}
          <Pressable 
            style={({ pressed }) => [
              styles.modalCloseButton,
              { opacity: pressed ? 0.8 : 1 }
            ]}
            onPress={closeModal}
          >
            <Text style={styles.modalCloseButtonText}>
              {t('CLOSE')}
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <Header
        title={t('NEWS')}
        subTitle={t('LATEST_UPDATES')}
      />

      {/* News List */}
      {loading && news?.length === 0 ? (
        <View style={styles.loadingFooter}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={[styles.loadingText, { direction: writingDirection }]}>
            {t('LOADING_NEWS')}
          </Text>
        </View>
      ) : (
        <Animated.FlatList
          ref={flatListRef}
          data={news}
          keyExtractor={(item) => item.id}
          renderItem={renderNewsItem}
          contentContainerStyle={styles.newsListContainer}
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
              colors={[COLORS.primary]}
              tintColor={COLORS.primary}
            />
          }
          onEndReached={loadMoreNews}
          onEndReachedThreshold={0.3}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="newspaper-outline" size={72} color={COLORS.muted} />
              <Text style={[styles.emptyStateText, { direction: writingDirection }]}>
                {t('NO_NEWS_AVAILABLE')}
              </Text>
              <Text style={[styles.emptyStateSubtext, { direction: writingDirection }]}>
                {t('CHECK_BACK_LATER')}
              </Text>
            </View>
          }
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={10}
          removeClippedSubviews={true}
        />
      )}

      {renderNewsModal()}
    </SafeAreaView>
  );
};

export default NewsScreen;