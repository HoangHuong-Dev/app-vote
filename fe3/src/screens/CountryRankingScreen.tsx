import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { useAuth } from '../context/AuthContext';
import TabBar from '../components/TabBar';
import { getCountryRankings } from '../services/api/rankings';
import { AxiosResponse } from 'axios';
import RankingTabs from '../components/RankingTabs';

// Define the Country interface based on the API response
interface Country {
  id: number;
  name: string;
  votes_count: number;
}

type CountryRankingScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'CountryRanking'>;
};

const CountryRankingScreen: React.FC<CountryRankingScreenProps> = ({ navigation }) => {
  const { logout, token } = useAuth();
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch countries data from API
  const fetchCountries = async () => {
    try {
      if (!token) {
        console.error('No token available');
        setError('Authentication required');
        navigation.replace('Login');
        return;
      }

      setLoading(true);
      setError(null);
      
      // Call the API and handle the response
      const response = await getCountryRankings() as AxiosResponse;
      
      // The API returns data directly in the response
      if (response && response.data) {
        setCountries(response.data as Country[]);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err: any) {
      console.error('Error fetching countries:', err);
      const errorMessage = err?.message || 'Failed to fetch countries';
      setError(errorMessage);
      
      if (err?.response?.status === 401) {
        navigation.replace('Login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });

    if (!token) {
      navigation.replace('Login');
      return;
    }

    fetchCountries();
  }, [token]);

  const handleLogout = () => {
    logout();
    navigation.replace('Login');
  };

  const renderCountryItem = ({ item, index }: { item: Country; index: number }) => (
    <TouchableOpacity 
      style={styles.countryItem}
      onPress={() => {
        // Navigate to country detail or clubs in this country
        // navigation.navigate('CountryDetail', { countryId: item.id });
      }}
    >
      <View style={styles.rankContainer}>
        <Text style={styles.rankText}>{index + 1}</Text>
      </View>
      <View style={styles.countryInfo}>
        <Text style={styles.countryName}>{item.name}</Text>
        <Text style={styles.voteCount}>{item.votes_count} votes</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading && countries.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchCountries}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <View style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Rankings</Text>
        </View>
        
        <RankingTabs navigation={navigation} activeTab="countries" />

        <View style={styles.rankingContainer}>
          <FlatList
            data={countries.sort((a, b) => b.votes_count - a.votes_count)}
            renderItem={renderCountryItem}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={styles.rankingListContent}
            scrollEnabled={true}
            showsVerticalScrollIndicator={true}
            initialNumToRender={10}
            maxToRenderPerBatch={20}
            windowSize={10}
            refreshing={loading}
            onRefresh={fetchCountries}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No countries found</Text>
              </View>
            }
          />
        </View>
      </View>
      <TabBar navigation={navigation} onLogout={handleLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  headerContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginTop: 30, // Add space for status bar
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212529',
  },
  rankingContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  rankingListContent: {
    paddingBottom: 10,
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  rankContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  rankText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212529',
  },
  countryInfo: {
    flex: 1,
  },
  countryName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 5,
  },
  voteCount: {
    fontSize: 14,
    color: '#6c757d',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#dc3545',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#6c757d',
  },
});

export default CountryRankingScreen; 