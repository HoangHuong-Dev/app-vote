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
  is_active?: boolean;
};

const windowWidth = Dimensions.get('window').width;
const itemWidth = (windowWidth - 60) / 2; // 60 = padding (20) * 2 + gap between items (20)

const VotingScreen: React.FC<VotingScreenProps> = ({ navigation, route }) => {
  const [topic, setTopic] = useState<TopicWithDetails | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const { logout } = useAuth();
  const [isTopicActive, setIsTopicActive] = useState(true);

  useEffect(() => {
    fetchTopicDetails();
  }, []);

  const fetchTopicDetails = async () => {
    try {
      const response = await api.getTopicDetails(route.params.topicId) as TopicWithDetails;
      setTopic(response);
      setIsTopicActive(response.is_active ?? true);
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
        (voting || !isTopicActive) && styles.clubCardDisabled
      ]}
      onPress={() => handleVote(item.id)}
      disabled={voting || !isTopicActive}
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
      {!isTopicActive && (
        <Text style={styles.inactiveText}>Voting closed</Text>
      )}
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
      console.log('err', err);
      
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
        {!isTopicActive && (
          <View style={styles.warningBanner}>
            <Text style={styles.warningText}>
              This topic is not currently active for voting
            </Text>
          </View>
        )}
        {!selectedCountry ? (
          <>
            <View style={styles.header}>
              <Text style={styles.headerText}>Select Country</Text>
            </View>
            <FlatList
              key="countries-grid"
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
                <Text style={styles.backButtonText}>← Back</Text>
              </TouchableOpacity>
              <Text style={styles.headerText}>Select Club</Text>
            </View>
            <FlatList
              key="clubs-list"
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#212529',
    flex: 1,
  },
  backButton: {
    marginRight: 15,
    padding: 8,
    backgroundColor: 'rgba(67, 97, 238, 0.1)',
    borderRadius: 12,
  },
  backButtonText: {
    color: '#4361ee',
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
    width: itemWidth,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#e9ecef',
  },
  countryImage: {
    width: '100%',
    height: itemWidth * 0.75,
    resizeMode: 'cover',
  },
  countryInfo: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  countryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
    textAlign: 'center',
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
  clubLogo: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
    marginRight: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 30,
    padding: 8,
    borderWidth: 3,
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
  clubVotes: {
    fontSize: 14,
    color: '#6c757d',
    fontWeight: '500',
  },
  clubCardDisabled: {
    opacity: 0.6,
  },
  warningBanner: {
    backgroundColor: '#fff3cd',
    padding: 16,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: '#ffeeba',
  },
  warningText: {
    color: '#856404',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
  },
  inactiveText: {
    color: '#dc3545',
    fontSize: 12,
    marginLeft: 8,
    fontWeight: '500',
    backgroundColor: 'rgba(220, 53, 69, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
});

export default VotingScreen; 