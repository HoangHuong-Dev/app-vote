import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Dimensions,
} from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import api from '../services/api/api';
import type { Country } from '../services/api/countries';
import type { Club } from '../services/api/clubs';
import type { Topic } from '../services/api/topics';
import TabBar from '../components/TabBar';
import { useAuth } from '../context/AuthContext';

type VotingScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'VotingScreen'>;
  route: RouteProp<RootStackParamList, 'VotingScreen'>;
};

type TopicWithDetails = Topic & {
  countries: (Country & {
    clubs: Club[];
  })[];
};

const windowWidth = Dimensions.get('window').width;
const itemWidth = (windowWidth - 60) / 2; // 60 = padding (20) * 2 + gap between items (20)

const VotingScreen: React.FC<VotingScreenProps> = ({ navigation, route }) => {
  const [topic, setTopic] = useState<TopicWithDetails | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const { logout } = useAuth();

  useEffect(() => {
    fetchTopicDetails();
  }, []);

  const fetchTopicDetails = async () => {
    try {
      const response = await api.getTopicDetails(route.params.topicId);
      setTopic(response as TopicWithDetails);
    } catch (err) {
      Alert.alert('Error', 'Failed to load topic details');
    } finally {
      setLoading(false);
    }
  };

  const renderCountry = ({ item }: { item: Country }) => (
    <TouchableOpacity 
      style={[styles.countryCard, { width: itemWidth }]}
      onPress={() => setSelectedCountry(item.id)}
    >
      <Image 
        source={{ uri: item.image }}
        style={styles.countryImage}
      />
      <View style={styles.countryInfo}>
        <Text style={styles.countryName} numberOfLines={2}>
          {item.name}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderClub = ({ item }: { item: Club }) => (
    <TouchableOpacity 
      style={[
        styles.clubCard,
        voting && styles.clubCardDisabled
      ]}
      onPress={() => handleVote(item.id)}
      disabled={voting}
    >
      <Image 
        source={{ uri: item.logo }}
        style={styles.clubLogo}
      />
      <View style={styles.clubInfo}>
        <Text style={styles.clubName}>{item.name}</Text>
        <Text style={styles.clubVotes}>Votes: {item.votes_count}</Text>
      </View>
      {voting && <ActivityIndicator size="small" color="#6C47FF" />}
    </TouchableOpacity>
  );

  const handleVote = async (clubId: number) => {
    if (voting) return;
    
    setVoting(true);
    try {
      await api.submitVote(route.params.topicId, clubId);
      Alert.alert(
        'Success', 
        'Your vote has been recorded', 
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to submit vote';
      Alert.alert('Error', errorMessage);
    } finally {
      setVoting(false);
    }
  };

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
        {!selectedCountry ? (
          <>
            <View style={styles.header}>
              <Text style={styles.headerText}>Chọn Quốc Gia</Text>
            </View>
            <FlatList
              data={topic?.countries}
              renderItem={renderCountry}
              keyExtractor={item => item.id.toString()}
              contentContainerStyle={styles.listContainer}
              numColumns={2}
              columnWrapperStyle={styles.row}
            />
          </>
        ) : (
          <>
            <View style={styles.header}>
              <TouchableOpacity 
                style={styles.backButton}
                onPress={() => setSelectedCountry(null)}
                disabled={voting}
              >
                <Text style={styles.backButtonText}>← Quay lại</Text>
              </TouchableOpacity>
              <Text style={styles.headerText}>Chọn Câu Lạc Bộ</Text>
            </View>
            <FlatList
              data={topic?.countries.find(c => c.id === selectedCountry)?.clubs}
              renderItem={renderClub}
              keyExtractor={item => item.id.toString()}
              contentContainerStyle={styles.listContainer}
            />
          </>
        )}
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
  },
  backButton: {
    marginRight: 15,
  },
  backButtonText: {
    color: '#6C47FF',
    fontSize: 16,
    fontWeight: '600',
  },
  listContainer: {
    padding: 20,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  countryCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#3a3a3a',
  },
  countryImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  countryInfo: {
    padding: 10,
  },
  countryName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
  countryFlag: {
    display: 'none',
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
  clubVotes: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  clubCardDisabled: {
    opacity: 0.7,
  },
});

export default VotingScreen; 