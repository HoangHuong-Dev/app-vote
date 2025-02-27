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
    <View style={styles.tabBar}>
      <TouchableOpacity 
        style={styles.tabItem} 
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.tabText}>Home</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.tabItem}
        onPress={() => navigation.navigate('Countries')}
      >
        <Text style={styles.tabText}>Football</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.tabItem}
        onPress={onLogout}
      >
        <Text style={styles.tabText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: '#2a2a2a',
    borderTopWidth: 1,
    borderTopColor: '#3a3a3a',
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabText: {
    color: '#fff',
    fontSize: 14,
  },
});

export default TabBar; 