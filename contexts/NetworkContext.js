// contexts/NetworkContext.js
import NetInfo from '@react-native-community/netinfo';
import { createContext, useContext, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { t } from '../utils/i18n';
import { COLORS } from '../utils/styles';

const NetworkContext = createContext();

export const useNetwork = () => {
  const context = useContext(NetworkContext);
  if (!context) {
    throw new Error('useNetwork must be used within NetworkProvider');
  }
  return context;
};

export const NetworkProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(null);
  const [isInternetReachable, setIsInternetReachable] = useState(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkInitialConnection = async () => {
      try {
        const state = await NetInfo.fetch();
        setIsConnected(state.isConnected);
        setIsInternetReachable(state.isInternetReachable);
        setIsChecking(false);
      } catch (error) {
        setIsConnected(false);
        setIsInternetReachable(false);
        setIsChecking(false);
      }
    };

    checkInitialConnection();

    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
      setIsInternetReachable(state.isInternetReachable);
      setIsChecking(false);
    });

    return () => unsubscribe();
  }, []);

  const checkConnection = async () => {
    setIsChecking(true);
    try {
      const state = await NetInfo.fetch();
      setIsConnected(state.isConnected);
      setIsInternetReachable(state.isInternetReachable);
    } catch (error) {
      setIsConnected(false);
      setIsInternetReachable(false);
    } finally {
      setIsChecking(false);
    }
  };

  const value = {
    isConnected,
    isInternetReachable,
    checkConnection,
    hasInternet: isConnected && isInternetReachable,
    isChecking,
  };

  return (
    <NetworkContext.Provider value={value}>
      {children}
    </NetworkContext.Provider>
  );
};

// Main component that controls content visibility
export const NetworkAwareContent = ({ children }) => {
  const { hasInternet, isChecking } = useNetwork();

  if (isChecking) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingContent}>
          <View style={styles.loadingIcon}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
          <Text style={styles.loadingTitle}>{t('CHECKING_CONNECTION')}</Text>
          <Text style={styles.loadingSubtitle}>{t('PLEASE_WAIT')}</Text>
        </View>
      </View>
    );
  }

  if (!hasInternet) {
    return <OfflineNotice />;
  }

  return children;
};

// Offline Component
export const OfflineNotice = ({ onRetry }) => {
  const { checkConnection, isChecking } = useNetwork();

  const handleRetry = async () => {
    await checkConnection();
    onRetry?.();
  };

  return (
    <View style={styles.offlineContainer}>
      <View style={styles.offlineContent}>
        {/* Icon Container */}
        <View style={styles.iconContainer}>
          <View style={styles.wifiIcon}>
            <Text style={styles.wifiIconText}>📶</Text>
          </View>
          <View style={styles.offlineBadge}>
            <Text style={styles.offlineBadgeText}>!</Text>
          </View>
        </View>

        {/* Text Content */}
        <Text style={styles.offlineTitle}>{t('NO_INTERNET')}</Text>
        <Text style={styles.offlineSubtitle}>{t('CONNECTION_ISSUE')}</Text>
        <Text style={styles.offlineText}>{t('CHECK_CONNECTION_AND_TRY_AGAIN')}</Text>

        {/* Retry Button */}
        <TouchableOpacity 
          style={[styles.retryButton, isChecking && styles.disabledButton]} 
          onPress={handleRetry}
          disabled={isChecking}
        >
          {isChecking ? (
            <ActivityIndicator color={COLORS.sheet} size="small" />
          ) : (
            <View style={styles.buttonContent}>
              <Text style={styles.retryButtonText}>{t('TRY_AGAIN')}</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Help Text */}
        <Text style={styles.helpText}>{t('RESTART_DEVICE_OR_CHECK_SETTINGS')}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.bg,
  },
  loadingContent: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  loadingIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  loadingTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  loadingSubtitle: {
    fontSize: 16,
    color: COLORS.muted,
    textAlign: 'center',
    lineHeight: 22,
  },
  offlineContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.bg,
    padding: 32,
  },
  offlineContent: {
    alignItems: 'center',
    width: '100%',
    maxWidth: 320,
  },
  iconContainer: {
    position: 'relative',
    marginBottom: 32,
  },
  wifiIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.errorLight,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.error,
  },
  wifiIconText: {
    fontSize: 48,
  },
  offlineBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.error,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.bg,
  },
  offlineBadgeText: {
    color: COLORS.bg,
    fontSize: 16,
    fontWeight: 'bold',
  },
  offlineTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  offlineSubtitle: {
    fontSize: 18,
    fontWeight: '500',
    color: COLORS.error,
    marginBottom: 12,
    textAlign: 'center',
  },
  offlineText: {
    fontSize: 16,
    color: COLORS.muted,
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 12,
    minWidth: 160,
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  disabledButton: {
    opacity: 0.7,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  retryButtonText: {
    color: COLORS.sheet,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  helpText: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
    marginTop: 24,
    lineHeight: 20,
  },
});