/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import { AuthProvider } from './src/context/AuthContext';
import VotingScreen from './src/screens/VotingScreen';
import CountriesScreen from './src/screens/CountriesScreen';
import RankingsScreen from './src/screens/RankingsScreen';
import EmailVerificationScreen from './src/screens/EmailVerificationScreen';
import GlobalRankingScreen from './src/screens/GlobalRankingScreen';
import CountryRankingScreen from './src/screens/CountryRankingScreen';
import CityRankingScreen from './src/screens/CityRankingScreen';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  EmailVerification: { email: string };
  Home: undefined;
  Topics: undefined;
  VotingScreen: { topicId: number };
  Ranking: undefined;
  Countries: undefined;
  Rankings: { countryId: number };
  GlobalRanking: undefined;
  CountryRanking: undefined;
  CityRanking: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function App(): React.JSX.Element {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="Login"
          screenOptions={{
            headerShown: false
          }}
        >
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="EmailVerification" component={EmailVerificationScreen} />
          <Stack.Screen 
            name="Home" 
            component={HomeScreen}
            options={{
              headerShown: true,
              headerBackVisible: false,
            }}
          />
          <Stack.Screen 
            name="VotingScreen" 
            component={VotingScreen}
            options={{ title: 'Vote' }}
          />
          <Stack.Screen name="Countries" component={CountriesScreen} />
          <Stack.Screen name="Rankings" component={RankingsScreen} />
          <Stack.Screen 
            name="GlobalRanking" 
            component={GlobalRankingScreen}
            options={{ title: 'Club Rankings' }}
          />
          <Stack.Screen 
            name="CountryRanking" 
            component={CountryRankingScreen}
            options={{ title: 'Country Rankings' }}
          />
          <Stack.Screen 
            name="CityRanking" 
            component={CityRankingScreen}
            options={{ title: 'City Rankings' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}

export default App;
