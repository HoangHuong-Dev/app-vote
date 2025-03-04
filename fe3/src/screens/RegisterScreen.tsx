import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Modal,
  FlatList,
  Image,
  Dimensions,
  ImageBackground,
} from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AxiosError } from 'axios';
import { RootStackParamList } from '../../App';
import { useAuth } from '../context/AuthContext';
import api from '../services/api/api';
import type { Topic } from '../services/api/topics';
import type { Country } from '../services/api/countries';
import type { Club } from '../services/api/clubs';

type RegisterScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Register'>;
};

const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    topic?: string;
    country?: string;
    club?: string;
    general?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const [showTopicSelect, setShowTopicSelect] = useState(false);
  const [showCountrySelect, setShowCountrySelect] = useState(false);
  const [showClubSelect, setShowClubSelect] = useState(false);

  useEffect(() => {
    fetchTopics();
  }, []);

  useEffect(() => {
    if (selectedTopic) {
      fetchCountries(selectedTopic.id);
    }
  }, [selectedTopic]);

  useEffect(() => {
    if (selectedCountry && selectedTopic) {
      fetchClubs(selectedCountry.id, selectedTopic.id);
    }
  }, [selectedCountry, selectedTopic]);

  const fetchTopics = async () => {
    try {
      const response = await api.getTopics();
      setTopics(response as Topic[]);
    } catch (err) {
      console.error('Failed to fetch topics:', err);
    }
  };

  const fetchCountries = async (topicId: number) => {
    try {
      const response = await api.getCountries(topicId);
      setCountries(response as Country[]);
    } catch (err) {
      console.error('Failed to fetch countries:', err);
    }
  };

  const fetchClubs = async (countryId: number, topicId: number) => {
    try {
      const response = await api.getClubsByCountryAndTopic(countryId, topicId);
      setClubs(response as Club[]);
    } catch (err) {
      console.error('Failed to fetch clubs:', err);
    }
  };

  const validateForm = () => {
    const newErrors: {
      name?: string;
      email?: string;
      password?: string;
      topic?: string;
      country?: string;
      club?: string;
    } = {};
    
    // Validate name
    if (!name) {
      newErrors.name = 'Name is required';
    } else if (name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Validate email
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }

    // Validate password
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Validate topic
    if (!selectedTopic) {
      newErrors.topic = 'Please select a topic';
    }

    // Validate country
    if (!selectedCountry) {
      newErrors.country = 'Please select a country';
    }

    // Validate club
    if (!selectedClub) {
      newErrors.club = 'Please select a club';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (): Promise<void> => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Register user
      const response: any = await api.register(
        name,
        email,
        password,
        selectedTopic!.id,
        selectedCountry!.id,
        selectedClub!.id
      );

      // Login after successful registration
      await login(response?.access_token, response?.user);

      // Submit vote for selected club
      await api.submitVote(selectedTopic!.id, selectedClub!.id);

      // Navigate to Rankings screen
      navigation.navigate('Rankings', { countryId: selectedCountry!.id });
    } catch (error) {
      const axiosError = error as AxiosError<{message: string}>;
      console.error('Registration error:', axiosError);
      setErrors({
        general: axiosError.response?.data?.message || 'Registration failed. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ImageBackground 
      source={require('../assets/bg-login.jpg')}
      style={styles.container}
    >
      <View style={styles.overlay}>
        <View style={styles.logoContainer}>
          <View style={styles.logoIcon}>
            <View style={styles.logoCircle}>
              <View style={styles.logoRocket} />
            </View>
          </View>
          <Text style={styles.welcomeText}>Create Account</Text>
          <Text style={styles.subtitleText}>Please fill in the form to continue</Text>
        </View>

        <View style={styles.formContainer}>
          {errors.general && (
            <View style={styles.generalErrorContainer}>
              <Text style={styles.generalErrorText}>{errors.general}</Text>
            </View>
          )}

          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, errors.name ? styles.inputError : null]}
              placeholder="Full Name"
              placeholderTextColor="#6c757d"
              value={name}
              onChangeText={(text) => {
                setName(text);
                setErrors(prev => ({...prev, name: undefined, general: undefined}));
              }}
              autoCapitalize="words"
              editable={!isLoading}
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, errors.email ? styles.inputError : null]}
              placeholder="Email"
              placeholderTextColor="#6c757d"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setErrors(prev => ({...prev, email: undefined, general: undefined}));
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!isLoading}
            />
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, errors.password ? styles.inputError : null]}
              placeholder="Password"
              placeholderTextColor="#6c757d"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setErrors(prev => ({...prev, password: undefined, general: undefined}));
              }}
              secureTextEntry
              editable={!isLoading}
            />
            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.selectContainer}>
              <TouchableOpacity
                style={[styles.input, errors.topic ? styles.inputError : null]}
                onPress={() => setShowTopicSelect(!showTopicSelect)}
              >
                <Text style={[styles.selectBoxText, !selectedTopic && styles.selectBoxPlaceholder]}>
                  {selectedTopic ? selectedTopic.title : 'Select a topic'}
                </Text>
                <Text style={[styles.selectBoxArrow, showTopicSelect && styles.selectBoxArrowUp]}>▼</Text>
              </TouchableOpacity>
              {showTopicSelect && (
                <View style={styles.dropdown}>
                  <FlatList
                    data={topics}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={[
                          styles.dropdownItem,
                          selectedTopic?.id === item.id && styles.dropdownItemSelected
                        ]}
                        onPress={() => {
                          setSelectedTopic(item);
                          setSelectedCountry(null);
                          setSelectedClub(null);
                          setShowTopicSelect(false);
                          setErrors(prev => ({...prev, topic: undefined, general: undefined}));
                        }}
                      >
                        <Text style={[
                          styles.dropdownItemText,
                          selectedTopic?.id === item.id && styles.dropdownItemTextSelected
                        ]}>
                          {item.title}
                        </Text>
                      </TouchableOpacity>
                    )}
                    keyExtractor={item => item.id.toString()}
                  />
                </View>
              )}
            </View>
            {errors.topic && <Text style={styles.errorText}>{errors.topic}</Text>}
          </View>

          {selectedTopic && (
            <View style={styles.inputContainer}>
              <View style={styles.selectContainer}>
                <TouchableOpacity
                  style={[styles.input, errors.country ? styles.inputError : null]}
                  onPress={() => setShowCountrySelect(!showCountrySelect)}
                >
                  <Text style={[styles.selectBoxText, !selectedCountry && styles.selectBoxPlaceholder]}>
                    {selectedCountry ? selectedCountry.name : 'Select a country'}
                  </Text>
                  <Text style={[styles.selectBoxArrow, showCountrySelect && styles.selectBoxArrowUp]}>▼</Text>
                </TouchableOpacity>
                {showCountrySelect && (
                  <View style={styles.dropdown}>
                    <FlatList
                      data={countries}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          style={[
                            styles.dropdownItem,
                            selectedCountry?.id === item.id && styles.dropdownItemSelected
                          ]}
                          onPress={() => {
                            setSelectedCountry(item);
                            setSelectedClub(null);
                            setShowCountrySelect(false);
                            setErrors(prev => ({...prev, country: undefined, general: undefined}));
                          }}
                        >
                          <Text style={[
                            styles.dropdownItemText,
                            selectedCountry?.id === item.id && styles.dropdownItemTextSelected
                          ]}>
                            {item.name}
                          </Text>
                        </TouchableOpacity>
                      )}
                      keyExtractor={item => item.id.toString()}
                    />
                  </View>
                )}
              </View>
              {errors.country && <Text style={styles.errorText}>{errors.country}</Text>}
            </View>
          )}

          {selectedCountry && (
            <View style={styles.inputContainer}>
              <View style={styles.selectContainer}>
                <TouchableOpacity
                  style={[styles.input, errors.club ? styles.inputError : null]}
                  onPress={() => setShowClubSelect(!showClubSelect)}
                >
                  <Text style={[styles.selectBoxText, !selectedClub && styles.selectBoxPlaceholder]}>
                    {selectedClub ? selectedClub.name : 'Select a club'}
                  </Text>
                  <Text style={[styles.selectBoxArrow, showClubSelect && styles.selectBoxArrowUp]}>▼</Text>
                </TouchableOpacity>
                {showClubSelect && (
                  <View style={styles.dropdown}>
                    <FlatList
                      data={clubs}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          style={[
                            styles.dropdownItem,
                            selectedClub?.id === item.id && styles.dropdownItemSelected
                          ]}
                          onPress={() => {
                            setSelectedClub(item);
                            setShowClubSelect(false);
                            setErrors(prev => ({...prev, club: undefined, general: undefined}));
                          }}
                        >
                          <Text style={[
                            styles.dropdownItemText,
                            selectedClub?.id === item.id && styles.dropdownItemTextSelected
                          ]}>
                            {item.name}
                          </Text>
                        </TouchableOpacity>
                      )}
                      keyExtractor={item => item.id.toString()}
                    />
                  </View>
                )}
              </View>
              {errors.club && <Text style={styles.errorText}>{errors.club}</Text>}
            </View>
          )}

          <TouchableOpacity 
            style={[styles.registerButton, isLoading && styles.registerButtonDisabled]} 
            onPress={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.registerButtonText}>SIGN UP & VOTE</Text>
            )}
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')} disabled={isLoading}>
              <Text style={styles.loginLink}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: '15%',
    marginBottom: 40,
  },
  logoIcon: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ff3b30',
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ rotate: '45deg' }],
  },
  logoRocket: {
    width: 20,
    height: 30,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: '#fff',
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: '600',
    marginTop: 20,
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
  },
  subtitleText: {
    fontSize: 16,
    color: '#fff',
    marginTop: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
  },
  formContainer: {
    width: '100%',
  },
  generalErrorContainer: {
    backgroundColor: 'rgba(220, 53, 69, 0.9)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  generalErrorText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 15,
  },
  input: {
    height: 50,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputError: {
    borderColor: '#dc3545',
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
  },
  selectContainer: {
    position: 'relative',
    zIndex: 1,
  },
  selectBoxText: {
    color: '#fff',
    fontSize: 16,
  },
  selectBoxPlaceholder: {
    color: '#6c757d',
  },
  selectBoxArrow: {
    color: '#6c757d',
    fontSize: 12,
  },
  selectBoxArrowUp: {
    transform: [{ rotate: '180deg' }],
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginTop: 4,
    maxHeight: 200,
    zIndex: 2,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  dropdownItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  dropdownItemSelected: {
    backgroundColor: '#ff3b30',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#fff',
  },
  dropdownItemTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  registerButton: {
    backgroundColor: '#ff3b30',
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    elevation: 3,
    shadowColor: '#ff3b30',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
  },
  registerButtonDisabled: {
    backgroundColor: 'rgba(255, 59, 48, 0.5)',
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginText: {
    color: '#fff',
    fontSize: 14,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
  },
  loginLink: {
    color: '#ff3b30',
    fontSize: 14,
    fontWeight: '500',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
  },
});

export default RegisterScreen;