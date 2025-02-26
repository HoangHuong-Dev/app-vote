import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ScrollView,
  Image,
  FlatList,
  Dimensions,
} from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { useAuth } from '../context/AuthContext';
import api from '../services/api/api';
import type { Topic } from '../services/api/topics';

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { user, logout } = useAuth();
  const [topics, setTopics] = useState<Topic[]>([]);
  const fadeAnim = new Animated.Value(0);
  const translateY = new Animated.Value(50);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    try {
      const response = await api.getTopics();
      setTopics(response as Topic[]);
      console.log("topics", topics);
    } catch (err) {
      console.error('Failed to fetch topics:', err);
    }
  };

  const renderTopicItem = ({ item }: { item: Topic }) => (
    <TouchableOpacity 
      style={styles.topicItem}
      onPress={() => navigation.navigate('VotingScreen', { topicId: item.id })}
    >
      <Image 
        source={{ uri: item.image_url }}
        style={styles.topicImage}
      />
      <Text style={styles.topicTitle} numberOfLines={2}>
        {item.title}
      </Text>
    </TouchableOpacity>
  );

  const handleLogout = () => {
    logout();
    navigation.replace('Login');
  };

  return (
    <ScrollView style={styles.container}>
      <Animated.View
        style={[
          styles.welcomeContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY }],
          },
        ]}>

        {/* Topics Grid */}
        <View style={styles.topicsContainer}>
          <Text style={styles.sectionTitle}>Vote Topics</Text>
          <FlatList
            data={topics}
            renderItem={renderTopicItem}
            keyExtractor={item => item.id.toString()}
            numColumns={2}
            columnWrapperStyle={styles.topicsRow}
            scrollEnabled={false}
          />
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>LOGOUT</Text>
        </TouchableOpacity>
      </Animated.View>
    </ScrollView>
  );
};

const windowWidth = Dimensions.get('window').width;
const itemWidth = (windowWidth - 60) / 2; // 60 = padding (20) * 2 + gap between items (20)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  welcomeContainer: {
    padding: 20,
  },
  header: {
    marginTop: 40,
    marginBottom: 30,
  },
  welcomeText: {
    fontSize: 20,
    color: '#888',
  },
  nameText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  topicsContainer: {
    marginBottom: 30,
  },
  topicsRow: {
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  topicItem: {
    width: itemWidth,
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    overflow: 'hidden',
  },
  topicImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  topicTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    padding: 10,
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: '#ff4757',
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;