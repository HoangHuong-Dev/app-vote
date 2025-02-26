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
} from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import api from '../services/api/api';
import type { Country } from '../services/api/countries';
import type { Club } from '../services/api/clubs';
import type { Topic } from '../services/api/topics';

type VotingScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'VotingScreen'>;
  route: RouteProp<RootStackParamList, 'VotingScreen'>;
};

type TopicWithDetails = Topic & {
  countries: (Country & {
    clubs: Club[];
  })[];
};

const VotingScreen: React.FC<VotingScreenProps> = ({ navigation, route }) => {
  const [topic, setTopic] = useState<TopicWithDetails | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);

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
      style={styles.countryCard}
      onPress={() => setSelectedCountry(item.id)}
    >
      <Image 
        source={{ uri: item.image }}
        style={styles.countryImage}
      />
      <View style={styles.countryInfo}>
        <Text style={styles.countryName}>{item.name}</Text>
        <Image 
          source={{ uri: item.flag }}
          style={styles.countryFlag}
        />
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

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6C47FF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!selectedCountry ? (
        // Show countries list
        <FlatList
          data={topic?.countries}
          renderItem={renderCountry}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        // Show clubs list for selected country
        <>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => setSelectedCountry(null)}
            disabled={voting}
          >
            <Text style={styles.backButtonText}>← Back to Countries</Text>
          </TouchableOpacity>
          <FlatList
            data={topic?.countries.find(c => c.id === selectedCountry)?.clubs}
            renderItem={renderClub}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={styles.listContainer}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 16,
  },
  countryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  countryImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  countryInfo: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  countryName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  countryFlag: {
    width: 30,
    height: 20,
    resizeMode: 'contain',
  },
  clubCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  clubLogo: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    marginRight: 12,
  },
  clubInfo: {
    flex: 1,
    marginLeft: 12,
  },
  clubName: {
    fontSize: 16,
    color: '#333',
  },
  clubVotes: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  backButton: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  backButtonText: {
    color: '#6C47FF',
    fontSize: 16,
    fontWeight: '600',
  },
  clubCardDisabled: {
    opacity: 0.7,
  },
});

export default VotingScreen; 