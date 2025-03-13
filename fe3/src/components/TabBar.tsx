import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type TabBarProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, any>;
  onLogout: () => void;
};

const TabBar = ({ navigation, onLogout }: TabBarProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {/* <TouchableOpacity 
          style={styles.tabItem} 
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.tabText}>Home</Text>
        </TouchableOpacity> */}

        <TouchableOpacity 
          style={styles.tabItem}
          onPress={() => navigation.navigate('GlobalRanking')}
        >
          <Text style={styles.tabText}>Global</Text>
        </TouchableOpacity>
        
        {/* <TouchableOpacity 
          style={styles.tabItem}
          onPress={() => navigation.navigate('Countries')}
        >
          <Text style={styles.tabText}>Rankings</Text>
        </TouchableOpacity> */}
        
        <TouchableOpacity 
          style={styles.tabItem}
          onPress={onLogout}
        >
          <Text style={styles.tabText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8f9fa',
  },
  tabBar: {
    flexDirection: 'row',
    height: 65,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    paddingHorizontal: 10,
    paddingBottom: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
    paddingVertical: 10,
    borderRadius: 12,
  },
  tabText: {
    color: '#4361ee',
    fontSize: 15,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});

export default TabBar; 