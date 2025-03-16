import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { useAuth } from '../context/AuthContext';
import TabBar from '../components/TabBar';
import { getCityRankings } from '../services/api/rankings';
import { AxiosResponse } from 'axios';
import RankingTabs from '../components/RankingTabs';

// Define the City interface based on the API response
interface City {
  id: number;
  name: string;
  country: {
    id: number;
    name: string;
  };
  votes_count: number;
}

type CityRankingScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'CityRanking'>;
};

const CityRankingScreen: React.FC<CityRankingScreenProps> = ({ navigation }) => {
  const { logout, token } = useAuth();
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch cities data from API
  const fetchCities = async () => {
    try {
      if (!token) {
        console.error('No token available');
        setError('Authentication required');
        navigation.replace('Login');
        return;
      }

      setLoading(true);
      setError(null);
      
      console.log('Token:', token);
      console.log('Fetching cities...');
      
      // Call the API and handle the response
      const response = await getCityRankings() as AxiosResponse;
      console.log('API Response:', response);
      
      // The API returns data directly in the response
      if (response && response.data) {
        setCities(response.data as City[]);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err: any) {
      console.error('Error fetching cities:', err);
      const errorMessage = err?.message || 'Failed to fetch cities';
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

    fetchCities();
  }, [token]);

  const handleLogout = () => {
    logout();
    navigation.replace('Login');
  };

  const renderCityItem = ({ item, index }: { item: City; index: number }) => (
    <TouchableOpacity 
      style={styles.cityItem}
      onPress={() => {
        // Navigate to city detail or clubs in this city
        // navigation.navigate('CityDetail', { cityId: item.id });
      }}
    >
      <View style={styles.rankContainer}>
        <Text style={styles.rankText}>{index + 1}</Text>
      </View>
      <View style={styles.cityInfo}>
        <Text style={styles.cityName}>{item.name}</Text>
        <Text style={styles.countryName}>{item.country.name}</Text>
        <Text style={styles.voteCount}>{item.votes_count} votes</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading && cities.length === 0) {
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
        <TouchableOpacity style={styles.retryButton} onPress={fetchCities}>
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
        
        <RankingTabs navigation={navigation} activeTab="cities" />

        <View style={styles.rankingContainer}>
          <FlatList
            data={cities.sort((a, b) => b.votes_count - a.votes_count)}
            renderItem={renderCityItem}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={styles.rankingListContent}
            scrollEnabled={true}
            showsVerticalScrollIndicator={true}
            initialNumToRender={10}
            maxToRenderPerBatch={20}
            windowSize={10}
            refreshing={loading}
            onRefresh={fetchCities}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No cities found</Text>
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
  cityItem: {
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
  cityInfo: {
    flex: 1,
  },
  cityName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 2,
  },
  countryName: {
    fontSize: 14,
    color: '#6c757d',
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

export default CityRankingScreen; 