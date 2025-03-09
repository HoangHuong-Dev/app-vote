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
import api from '../services/api/api';

type EmailVerificationScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'EmailVerification'>;
  route: {
    params: {
      email: string;
    };
  };
};

const EmailVerificationScreen: React.FC<EmailVerificationScreenProps> = ({ navigation, route }) => {
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const { email } = route.params;

  const handleVerification = async () => {
    if (!verificationCode) {
      setError('Please enter the verification code');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await api.verifyEmail(email, verificationCode);
      navigation.replace('Login');
    } catch (error) {
      const axiosError = error as AxiosError<{message: string}>;
      setError(axiosError.response?.data?.message || 'Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    setError('');

    try {
      await api.resendVerificationCode(email);
      setError('A new verification code has been sent to your email.');
    } catch (error) {
      const axiosError = error as AxiosError<{message: string}>;
      setError(axiosError.response?.data?.message || 'Failed to resend code. Please try again.');
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
          <Text style={styles.welcomeText}>Verify Your Email</Text>
          <Text style={styles.subtitleText}>
            Please enter the verification code sent to {email}
          </Text>
        </View>

        <View style={styles.formContainer}>
          {error && (
            <View style={[styles.messageContainer, error.includes('sent to your email') ? styles.successContainer : styles.errorContainer]}>
              <Text style={styles.messageText}>{error}</Text>
            </View>
          )}

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter verification code"
              placeholderTextColor="#6c757d"
              value={verificationCode}
              onChangeText={(text) => {
                setVerificationCode(text);
                setError('');
              }}
              keyboardType="number-pad"
              editable={!isLoading}
            />
          </View>

          <TouchableOpacity 
            style={[styles.verifyButton, isLoading && styles.buttonDisabled]} 
            onPress={handleVerification}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>VERIFY</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.resendButton, isLoading && styles.buttonDisabled]} 
            onPress={handleResendCode}
            disabled={isLoading}
          >
            <Text style={styles.resendButtonText}>Resend Code</Text>
          </TouchableOpacity>
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
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
  },
  formContainer: {
    width: '100%',
  },
  messageContainer: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  errorContainer: {
    backgroundColor: 'rgba(220, 53, 69, 0.9)',
  },
  successContainer: {
    backgroundColor: 'rgba(40, 167, 69, 0.9)',
  },
  messageText: {
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
  },
  verifyButton: {
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
  resendButton: {
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resendButtonText: {
    color: '#ff3b30',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default EmailVerificationScreen; 