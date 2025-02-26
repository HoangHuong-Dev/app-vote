import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { ENDPOINTS, getApiUrl } from '../constants/api';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';

type VotingScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'VotingScreen'>;
  route: RouteProp<RootStackParamList, 'VotingScreen'>;
};

type Country = {
  id: number;
  name: string;
  code: string;
};

type Club = {
  id: number;
  name: string;
  logo: string;
};

const VotingScreen: React.FC<VotingScreenProps> = ({ navigation, route }) => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<number | null>(null);
  const [selectedClub, setSelectedClub] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCountries();
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      fetchClubs(selectedCountry);
    }
  }, [selectedCountry]);

  const fetchCountries = async () => {
    try {
      const response = await axios.get(getApiUrl(ENDPOINTS.COUNTRIES));
      setCountries(response.data);
    } catch (err) {
      Alert.alert('Error', 'Failed to load countries');
    }
  };

  const fetchClubs = async (countryId: number) => {
    try {
      const response = await axios.get(getApiUrl(ENDPOINTS.CLUBS_BY_COUNTRY(countryId)));
      setClubs(response.data);
    } catch (err) {
      Alert.alert('Error', 'Failed to load clubs');
    }
  };

  const handleVote = async () => {
    if (!selectedClub) {
      Alert.alert('Error', 'Please select a club');
      return;
    }

    setLoading(true);
    try {
      await axios.post(getApiUrl(ENDPOINTS.VOTES), {
        topic_id: route.params.topicId,
        club_id: selectedClub,
      });
      
      Alert.alert('Success', 'Your vote has been recorded', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to submit vote');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.label}>Select Country</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedCountry}
            onValueChange={(value) => {
              setSelectedCountry(value);
              setSelectedClub(null);
            }}
          >
            <Picker.Item label="Choose a country" value={null} />
            {countries.map(country => (
              <Picker.Item 
                key={country.id} 
                label={country.name} 
                value={country.id} 
              />
            ))}
          </Picker>
        </View>

        {selectedCountry && (
          <>
            <Text style={styles.label}>Select Club</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedClub}
                onValueChange={setSelectedClub}
              >
                <Picker.Item label="Choose a club" value={null} />
                {clubs.map(club => (
                  <Picker.Item 
                    key={club.id} 
                    label={club.name} 
                    value={club.id} 
                  />
                ))}
              </Picker>
            </View>
          </>
        )}

        <TouchableOpacity
          style={[styles.voteButton, (!selectedClub || loading) && styles.disabledButton]}
          onPress={handleVote}
          disabled={!selectedClub || loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.voteButtonText}>Submit Vote</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  voteButton: {
    backgroundColor: '#6C47FF',
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
  },
  disabledButton: {
    backgroundColor: '#A99BFF',
  },
  voteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default VotingScreen; 