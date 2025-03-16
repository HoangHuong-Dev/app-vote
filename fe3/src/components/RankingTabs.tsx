import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type RankingTabsProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, any>;
  activeTab: 'clubs' | 'countries' | 'cities';
};

const RankingTabs = ({ navigation, activeTab }: RankingTabsProps) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={[
          styles.tab, 
          activeTab === 'clubs' && styles.activeTab
        ]}
        onPress={() => navigation.navigate('GlobalRanking')}
      >
        <Text style={[
          styles.tabText,
          activeTab === 'clubs' && styles.activeTabText
        ]}>Clubs</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[
          styles.tab, 
          activeTab === 'countries' && styles.activeTab
        ]}
        onPress={() => navigation.navigate('CountryRanking')}
      >
        <Text style={[
          styles.tabText,
          activeTab === 'countries' && styles.activeTabText
        ]}>Countries</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[
          styles.tab, 
          activeTab === 'cities' && styles.activeTab
        ]}
        onPress={() => navigation.navigate('CityRanking')}
      >
        <Text style={[
          styles.tabText,
          activeTab === 'cities' && styles.activeTabText
        ]}>Cities</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#4361ee',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6c757d',
  },
  activeTabText: {
    color: '#4361ee',
    fontWeight: '700',
  },
});

export default RankingTabs; 