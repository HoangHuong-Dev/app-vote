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
import TabBar from '../components/TabBar';

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { user, logout } = useAuth();
  const [topics, setTopics] = useState<Topic[]>([]);
  const fadeAnim = new Animated.Value(0);
  const translateY = new Animated.Value(50);

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
    
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

  const handleLogout = () => {
    logout();
    navigation.replace('Login');
  };

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

  return (
    <View style={styles.mainContainer}>
      <ScrollView style={styles.container}>
        <Animated.View
          style={[
          styles.welcomeContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY }],
          },
        ]}>

        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.nameText}>Welcome {user?.name || 'User'}</Text>
        </View>

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
        </Animated.View>
      </ScrollView>
      <TabBar navigation={navigation} onLogout={handleLogout} />
    </View>
  );
};

const windowWidth = Dimensions.get('window').width;
const itemWidth = (windowWidth - 60) / 2; // 60 = padding (20) * 2 + gap between items (20)

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
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
    color: '#6c757d',
  },
  nameText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#212529',
    marginTop: 5,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 20,
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
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#e9ecef',
  },
  topicImage: {
    width: '100%',
    height: itemWidth * 0.75,
    resizeMode: 'cover',
  },
  topicTitle: {
    color: '#212529',
    fontSize: 16,
    fontWeight: '600',
    padding: 16,
    textAlign: 'center',
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  logoutButton: {
    backgroundColor: '#dc3545',
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