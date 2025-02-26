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
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import api from '../services/api/api';
import type { Country } from '../services/api/countries';
import { useAuth } from '../context/AuthContext';
import TabBar from '../components/TabBar';

type TopicsScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Topics'>;
};

const TopicsScreen: React.FC<TopicsScreenProps> = ({ navigation }) => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { logout } = useAuth();

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      const response = await api.getCountries();
      setCountries(response as Country[]);
    } catch (err) {
      setError('Failed to load countries');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const renderCountry = ({ item }: { item: Country }) => (
    <TouchableOpacity 
      style={styles.countryCard}
      onPress={() => navigation.navigate('VotingScreen', { topicId: item.id })}
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

  const handleLogout = () => {
    logout();
    navigation.replace('Login');
  };

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
        data={countries}
        renderItem={renderCountry}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContainer}
      />
      <TabBar navigation={navigation} onLogout={handleLogout} />
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
  errorText: {
    color: '#ff4757',
    fontSize: 16,
  },
});

export default TopicsScreen; 