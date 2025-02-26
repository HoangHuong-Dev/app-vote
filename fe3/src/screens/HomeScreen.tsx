import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ScrollView,
} from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { useAuth } from '../context/AuthContext';

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { user, logout } = useAuth();
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
  }, []);

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
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Welcome to FootballVote</Text>
          <Text style={styles.nameText}>{user?.name || 'User'}</Text>
        </View>

        {/* Stats Overview */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>24</Text>
            <Text style={styles.statLabel}>Teams</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>1.2K</Text>
            <Text style={styles.statLabel}>Votes</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>5</Text>
            <Text style={styles.statLabel}>Leagues</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('Topics')}
          >
            <Text style={styles.actionButtonText}>Vote Topics</Text>
            <Text style={styles.actionDescription}>Browse and vote on football topics</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('Topics')}
          >
            <Text style={styles.actionButtonText}>Global Rankings</Text>
            <Text style={styles.actionDescription}>View worldwide team rankings</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('Topics')}
          >
            <Text style={styles.actionButtonText}>My Votes</Text>
            <Text style={styles.actionDescription}>See your voting history</Text>
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>LOGOUT</Text>
        </TouchableOpacity>
      </Animated.View>
    </ScrollView>
  );
};

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
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#2a2a2a',
    borderRadius: 15,
    padding: 15,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6C47FF',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#888',
  },
  actionsContainer: {
    marginBottom: 30,
  },
  actionButton: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#6C47FF',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
  },
  actionDescription: {
    color: '#888',
    fontSize: 14,
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