import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import api from '../services/api/api';
import type { Country } from '../services/api/countries';
import { useAuth } from '../context/AuthContext';
import TabBar from '../components/TabBar';

type CountriesScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Countries'>;
};

const windowWidth = Dimensions.get('window').width;
const itemWidth = (windowWidth - 60) / 2;

const CountriesScreen: React.FC<CountriesScreenProps> = ({ navigation }) => {
  const [countries, setCountries] = useState<Country[]>([]);
  const { logout } = useAuth();

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      const response = await api.getCountries();
      setCountries(response as Country[]);
    } catch (err) {
      console.error('Failed to fetch countries:', err);
    }
  };

  const renderCountry = ({ item }: { item: Country }) => (
    <TouchableOpacity 
      style={[styles.countryCard, { width: itemWidth }]}
      onPress={() => navigation.navigate('Rankings', { countryId: item.id })}
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

  const handleLogout = () => {
    logout();
    navigation.replace('Login');
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Chọn Quốc Gia</Text>
        </View>
        <FlatList
          data={countries}
          renderItem={renderCountry}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          numColumns={2}
          columnWrapperStyle={styles.row}
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
});

export default CountriesScreen; 