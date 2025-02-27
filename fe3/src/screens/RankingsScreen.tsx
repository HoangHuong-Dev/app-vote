import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
} from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import api from '../services/api/api';
import { useAuth } from '../context/AuthContext';
import TabBar from '../components/TabBar';

type RankingsScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Rankings'>;
  route: RouteProp<RootStackParamList, 'Rankings'>;
};

type RankingClub = {
  id: number;
  name: string;
  logo: string;
  votes_count: number;
  rank: number;
};

type RankingData = {
  country: {
    id: number;
    name: string;
    flag: string;
    image: string;
  };
  clubs: RankingClub[];
};

const RankingsScreen: React.FC<RankingsScreenProps> = ({ navigation, route }) => {
  const [rankings, setRankings] = useState<RankingData | null>(null);
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();

  useEffect(() => {
    fetchRankings();
  }, []);

  const fetchRankings = async () => {
    try {
      const response = await api.getClubRankingsByCountry(route.params.countryId);
      setRankings(response as RankingData);
    } catch (err) {
      console.error('Failed to fetch rankings:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderClub = ({ item }: { item: RankingClub }) => (
    <View style={styles.clubCard}>
      <Text style={styles.rankText}>#{item.rank}</Text>
      <Image 
        source={{ uri: item.logo }}
        style={styles.clubLogo}
      />
      <View style={styles.clubInfo}>
        <Text style={styles.clubName}>{item.name}</Text>
        <Text style={styles.votesText}>{item.votes_count} votes</Text>
      </View>
    </View>
  );

  const handleLogout = () => {
    logout();
    navigation.replace('Login');
  };

  if (loading) {
    return (
      <View style={styles.mainContainer}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#6C47FF" />
        </View>
        <TabBar navigation={navigation} onLogout={handleLogout} />
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Rankings</Text>
          <Text style={styles.countryName}>{rankings?.country.name}</Text>
        </View>
        <FlatList
          data={rankings?.clubs}
          renderItem={renderClub}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContainer}
        />
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
  content: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#212529',
  },
  countryName: {
    fontSize: 16,
    color: '#6c757d',
    marginTop: 5,
  },
  listContainer: {
    padding: 20,
  },
  clubCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#e9ecef',
  },
  rankText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4361ee',
    width: 50,
    textAlign: 'center',
  },
  clubLogo: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
    marginRight: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 30,
    padding: 8,
    borderWidth: 2,
    borderColor: '#e9ecef',
  },
  clubInfo: {
    flex: 1,
    marginLeft: 4,
  },
  clubName: {
    fontSize: 18,
    color: '#212529',
    fontWeight: '600',
    marginBottom: 4,
  },
  votesText: {
    fontSize: 14,
    color: '#6c757d',
    fontWeight: '500',
  },
});

export default RankingsScreen; 