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
import TopicsScreen from './src/screens/TopicsScreen';
import VotingScreen from './src/screens/VotingScreen';
import RankingScreen from './src/screens/RankingScreen';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
  Topics: undefined;
  VotingScreen: { topicId: number };
  Ranking: undefined;
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
          <Stack.Screen 
            name="Home" 
            component={HomeScreen}
            options={{
              headerShown: true,
              headerBackVisible: false,
            }}
          />
          <Stack.Screen 
            name="Topics" 
            component={TopicsScreen}
            options={{ title: 'Topics' }}
          />
          <Stack.Screen 
            name="VotingScreen" 
            component={VotingScreen}
            options={{ title: 'Vote' }}
          />
          <Stack.Screen name="Ranking" component={RankingScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}

export default App;
