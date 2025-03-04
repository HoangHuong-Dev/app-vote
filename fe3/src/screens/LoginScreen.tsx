import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ImageBackground,
} from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AxiosError } from 'axios';
import { RootStackParamList } from '../../App';
import { useAuth } from '../context/AuthContext';
import api from '../services/api/api';

type LoginScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
};

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errors, setErrors] = useState<{email?: string; password?: string; general?: string}>({});
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const validateForm = () => {
    const newErrors: {email?: string; password?: string} = {};
    
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (): Promise<void> => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response: any = await api.login(email, password);
      login(response?.access_token, response?.user);
      navigation.navigate('Countries');
    } catch (error) {
      const axiosError = error as AxiosError<{message: string}>;
      console.error('Login error:', axiosError);
      setErrors({
        general: axiosError.response?.data?.message || 'Invalid email or password'
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
          <Text style={styles.welcomeText}>Welcome back.</Text>
        </View>

        <View style={styles.formContainer}>
          {errors.general && (
            <View style={styles.generalErrorContainer}>
              <Text style={styles.generalErrorText}>{errors.general}</Text>
            </View>
          )}

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

          <TouchableOpacity 
            style={[styles.loginButton, isLoading && styles.loginButtonDisabled]} 
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.loginButtonText}>LOGIN</Text>
            )}
          </TouchableOpacity>

          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')} disabled={isLoading}>
              <Text style={styles.signupLink}>Sign up</Text>
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
    marginTop: '20%',
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
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: '#fff',
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
  loginButton: {
    backgroundColor: '#ff3b30',
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#ff3b30',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 3,
  },
  loginButtonDisabled: {
    backgroundColor: 'rgba(255, 59, 48, 0.5)',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  signupText: {
    color: '#fff',
    fontSize: 14,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
  },
  signupLink: {
    color: '#ff3b30',
    fontSize: 14,
    fontWeight: '500',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
  },
});

export default LoginScreen; 