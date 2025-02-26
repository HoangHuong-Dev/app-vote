import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
} from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { useAuth } from '../context/AuthContext';
import TabBar from '../components/TabBar';

type Team = {
  id: string;
  name: string;
  votes: number;
  logo: string;
  rank: number;
};

const MOCK_DATA: Team[] = [
  {
    id: '1',
    name: 'Manchester City',
    votes: 1250,
    logo: 'https://upload.wikimedia.org/wikipedia/vi/1/1d/Manchester_City_FC_logo.svg',
    rank: 1
  },
  {
    id: '2',
    name: 'Juventus',
    votes: 1100,
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Juventus_FC_2017_icon.svg/1200px-Juventus_FC_2017_icon.svg.png',
    rank: 2
  },
  {
    id: '3',
    name: 'Real Madrid',
    votes: 1000,
    logo: 'https://upload.wikimedia.org/wikipedia/vi/thumb/c/c7/Logo_Real_Madrid.svg/1200px-Logo_Real_Madrid.svg.png',
    rank: 3
  },
  {
    id: '4',
    name: 'Barcelona',
    votes: 950,
    logo: 'https://upload.wikimedia.org/wikipedia/vi/thumb/9/91/FC_Barcelona_logo.svg/1200px-FC_Barcelona_logo.svg.png',
    rank: 4
  },
  {
    id: '5',
    name: 'Liverpool',
    votes: 900,
    logo: 'https://upload.wikimedia.org/wikipedia/vi/thumb/0/0c/Liverpool_FC.svg/1200px-Liverpool_FC.svg.png',
    rank: 5
  }
];

type RankingScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Ranking'>;
};

const RankingScreen: React.FC<RankingScreenProps> = ({ navigation }) => {
  const { logout } = useAuth();
  const [teams, setTeams] = useState<Team[]>(MOCK_DATA);

  const handleLogout = () => {
    logout();
    navigation.replace('Login');
  };

  const renderTeamItem = ({ item }: { item: Team }) => (
    <View style={styles.teamItem}>
      <Text style={styles.rankText}>#{item.rank}</Text>
      <View style={styles.teamInfo}>
        <Image 
          style={styles.teamLogo}
          source={{ uri: item.logo }}
          onError={(error) => console.log('Error loading image:', error)}
        />
        <Text style={styles.teamName}>{item.name}</Text>
      </View>
      <View style={styles.votesContainer}>
        <Text style={styles.votesText}>{item.votes}</Text>
        <Text style={styles.votesLabel}>votes</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.mainContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Bảng Xếp Hạng Câu Lạc Bộ</Text>
        <FlatList
          data={teams}
          renderItem={renderTeamItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
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
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  listContainer: {
    padding: 16,
  },
  teamItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  rankText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6C47FF',
    width: 40,
  },
  teamInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  teamLogo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    backgroundColor: '#3a3a3a',
  },
  teamName: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  votesContainer: {
    alignItems: 'flex-end',
  },
  votesText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6C47FF',
  },
  votesLabel: {
    fontSize: 12,
    color: '#888',
  },
});

export default RankingScreen; 