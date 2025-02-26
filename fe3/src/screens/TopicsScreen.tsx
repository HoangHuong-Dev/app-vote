import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import { ENDPOINTS, getApiUrl } from '../constants/api';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type TopicsScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Topics'>;
};

type Topic = {
  id: number;
  title: string;
  description: string;
  image: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
};

const TopicsScreen: React.FC<TopicsScreenProps> = ({ navigation }) => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    try {
      const response = await axios.get(getApiUrl(ENDPOINTS.TOPICS));
      setTopics(response.data);
    } catch (err) {
      setError('Failed to load topics');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const renderTopic = ({ item }: { item: Topic }) => (
    <TouchableOpacity 
      style={styles.topicCard}
      onPress={() => navigation.navigate('VotingScreen', { topicId: item.id })}
    >
      <Image 
        source={{ uri: item.image || 'https://via.placeholder.com/150' }}
        style={styles.topicImage}
      />
      <View style={styles.topicInfo}>
        <Text style={styles.topicTitle}>{item.title}</Text>
        <Text style={styles.topicDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <Text style={[
          styles.statusBadge,
          item.is_active ? styles.activeBadge : styles.inactiveBadge
        ]}>
          {item.is_active ? 'Active' : 'Ended'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6C47FF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={topics}
        renderItem={renderTopic}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContainer}
      />
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
  topicCard: {
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
  topicImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  topicInfo: {
    padding: 16,
  },
  topicTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  topicDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
    fontSize: 12,
    fontWeight: '500',
  },
  activeBadge: {
    backgroundColor: '#E8F5E9',
    color: '#2E7D32',
  },
  inactiveBadge: {
    backgroundColor: '#FFEBEE',
    color: '#C62828',
  },
  errorText: {
    color: '#ff4757',
    fontSize: 16,
  },
});

export default TopicsScreen; 