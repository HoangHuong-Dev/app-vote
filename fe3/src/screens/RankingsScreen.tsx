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
          <Text style={styles.headerText}>Bảng Xếp Hạng</Text>
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
    backgroundColor: '#1a1a1a',
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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  countryName: {
    fontSize: 16,
    color: '#888',
    marginTop: 5,
  },
  listContainer: {
    padding: 20,
  },
  clubCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3a3a3a',
  },
  rankText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6C47FF',
    width: 40,
  },
  clubLogo: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
    marginRight: 12,
    backgroundColor: '#3a3a3a',
    borderRadius: 25,
  },
  clubInfo: {
    flex: 1,
  },
  clubName: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  votesText: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
});

export default RankingsScreen; 