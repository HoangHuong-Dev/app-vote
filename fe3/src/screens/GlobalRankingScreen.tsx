import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { WebView } from 'react-native-webview';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { useAuth } from '../context/AuthContext';
import TabBar from '../components/TabBar';
import { getClubRankings, searchClubs } from '../services/api/rankings';
import { AxiosResponse } from 'axios';
import RankingTabs from '../components/RankingTabs';

// Define the Club interface based on the API response from RankingController
interface Club {
  id: number;
  name: string;
  city: {
    id: number;
    name: string;
    country: {
      id: number;
      name: string;
    };
  };
  latitude: string;
  longitude: string;
  votes_count: number;
  color: string;
  is_user_voted: boolean;
  logo: string | null;
}

type GlobalRankingScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'GlobalRanking'>;
};

const GlobalRankingScreen: React.FC<GlobalRankingScreenProps> = ({ navigation }) => {
  const { logout, token } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [filteredClubs, setFilteredClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const webViewRef = useRef<WebView>(null);
  const flatListRef = useRef<FlatList>(null);

  // Fetch clubs data from API
  const fetchClubs = async () => {
    try {
      if (!token) {
        console.error('No token available');
        setError('Authentication required');
        navigation.replace('Login');
        return;
      }

      setLoading(true);
      setError(null);
      
      console.log('Token:', token);
      console.log('Fetching clubs...');
      
      // Call the API and handle the response
      const response = await getClubRankings() as AxiosResponse;
      
      // Kiểm tra cấu trúc dữ liệu trả về
      if (response && response.data) {
        // Kiểm tra nếu response.data là một mảng trực tiếp
        if (Array.isArray(response.data)) {
          setClubs(response.data as Club[]);
          setFilteredClubs(response.data as Club[]);
        } 
        // Kiểm tra nếu response.data.data là một mảng (cấu trúc lồng nhau)
        else if (response.data.data && Array.isArray(response.data.data)) {
          setClubs(response.data.data as Club[]);
          setFilteredClubs(response.data.data as Club[]);
        } 
        else {
          console.error('Unexpected response structure:', response.data);
          throw new Error('Invalid response format: Data is not an array');
        }
      }
    } catch (err: any) {
      console.error('Error fetching clubs:', err);
      const errorMessage = err?.message || 'Failed to fetch clubs';
      setError(errorMessage);
      
      if (err?.response?.status === 401) {
        navigation.replace('Login');
      }
    } finally {
      setLoading(false);
    }
  };

  // Search clubs from API
  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text.trim() === '') {
      setFilteredClubs(clubs);
    } else {
      // Perform search locally instead of calling the API
      const searchTerm = text.toLowerCase();
      const filtered = clubs.filter(club => 
        // Search by club name
        club.name.toLowerCase().includes(searchTerm) ||
        // Search by city name
        club.city.name.toLowerCase().includes(searchTerm) ||
        // Search by country name
        club.city.country.name.toLowerCase().includes(searchTerm)
      );
      setFilteredClubs(filtered);
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });

    if (!token) {
      navigation.replace('Login');
      return;
    }

    fetchClubs();
  }, [token]);

  const handleLogout = () => {
    logout();
    navigation.replace('Login');
  };

  // Function to inject JavaScript into WebView to update markers
  const updateMapMarkers = () => {
    if (webViewRef.current) {
      const jsCode = `
        try {
          // Clear existing markers
          if (window.markers) {
            window.markers.forEach(marker => marker.remove());
          }
          window.markers = [];
          
          const clubs = ${JSON.stringify(clubs)};
          const userVotedClub = ${JSON.stringify(clubs.find(club => club.is_user_voted))};
          const filteredClubs = ${JSON.stringify(filteredClubs)};
          const searchActive = ${searchQuery.length > 0 ? 'true' : 'false'};
          
          // Add markers for clubs with valid coordinates
          clubs.forEach(club => {
            if (club.latitude && club.longitude) {
              const isInFilter = !searchActive || filteredClubs.some(fc => fc.id === club.id);
              const opacity = searchActive && !isInFilter ? 0.4 : 1;
              
              const marker = L.marker([parseFloat(club.latitude), parseFloat(club.longitude)], {
                icon: createClubIcon(club, club.is_user_voted),
                opacity: opacity
              })
              .bindPopup(\`
                <div style="text-align: center; padding: 5px;">
                  <div style="font-weight: bold; font-size: 16px; margin-bottom: 5px;">\${club.name}</div>
                  \${club.is_user_voted ? '<div style="background-color: #e9f7ef; color: #27ae60; padding: 3px 8px; border-radius: 10px; display: inline-block; margin-bottom: 5px;">Your Vote</div>' : ''}
                  <div style="color: #666; font-size: 14px;">\${club.votes_count} votes</div>
                </div>
              \`)
              .addTo(map);
              
              window.markers.push(marker);
            }
          });
          
          // Fit bounds to show all markers if there are any valid coordinates
          const validCoordinates = clubs
            .filter(club => club.latitude && club.longitude)
            .map(club => [parseFloat(club.latitude), parseFloat(club.longitude)]);
            
          if (validCoordinates.length > 0) {
            const bounds = L.latLngBounds(validCoordinates);
            map.fitBounds(bounds, { padding: [50, 50] });
          } else {
            // If no valid coordinates, show default view of Italy
            map.setView([41.9028, 12.4964], 6);
          }
          
          true;
        } catch (error) {
          console.error('Error updating markers:', error);
          false;
        }
      `;
      webViewRef.current.injectJavaScript(jsCode);
    }
  };

  // Update markers when filtered clubs change
  useEffect(() => {
    if (!loading && clubs.length > 0) {
      const timer = setTimeout(() => {
        updateMapMarkers();
        
        // Tự động chọn club đã được user vote khi vừa vào màn hình
        const userVotedClub = clubs.find(club => club.is_user_voted);
        if (userVotedClub) {
          setSelectedClub(userVotedClub);
          
          // Focus vào club đã vote trên bản đồ
          if (webViewRef.current && userVotedClub.latitude && userVotedClub.longitude) {
            const jsCode = `
              try {
                const selectedClub = ${JSON.stringify(userVotedClub)};
                map.setView([parseFloat(selectedClub.latitude), parseFloat(selectedClub.longitude)], 8);
                
                // Find and open popup for this club
                setTimeout(() => {
                  window.markers.forEach(marker => {
                    const markerLatLng = marker.getLatLng();
                    if (markerLatLng.lat === parseFloat(selectedClub.latitude) && 
                        markerLatLng.lng === parseFloat(selectedClub.longitude)) {
                      marker.openPopup();
                    }
                  });
                }, 500);
                true;
              } catch (error) {
                console.error('Error focusing user voted club:', error);
                false;
              }
            `;
            webViewRef.current.injectJavaScript(jsCode);
          }
          
          // Scroll đến club đã vote trong danh sách
          const votedClubIndex = filteredClubs.findIndex(club => club.is_user_voted);
          if (votedClubIndex !== -1) {
            setTimeout(() => {
              flatListRef.current?.scrollToIndex({
                index: votedClubIndex,
                animated: true,
                viewPosition: 0.5
              });
            }, 500);
          }
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [filteredClubs, searchQuery, clubs, loading]);

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@600&display=swap');
          
          .marker-container {
            position: relative;
            width: 40px;
            height: 50px;
          }
          
          .marker-base {
            position: absolute;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background-color: white;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1;
          }
          
          .marker-inner {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Poppins', sans-serif;
            font-weight: 600;
            color: white;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
            font-size: 16px;
          }
          
          .marker-shadow {
            position: absolute;
            bottom: 0;
            left: 10px;
            width: 20px;
            height: 10px;
            background-color: rgba(0, 0, 0, 0.2);
            border-radius: 50%;
            filter: blur(2px);
            z-index: 0;
          }
          
          .marker-pointer {
            position: absolute;
            top: 30px;
            left: 15px;
            width: 10px;
            height: 10px;
            background-color: white;
            transform: rotate(45deg);
            box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.2);
            z-index: 0;
          }
          
          .user-marker .marker-base {
            width: 48px;
            height: 48px;
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.4);
          }
          
          .user-marker .marker-inner {
            width: 40px;
            height: 40px;
            font-size: 18px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          }
          
          .user-marker .marker-shadow {
            width: 24px;
            height: 12px;
            left: 12px;
          }
          
          .user-marker .marker-pointer {
            top: 36px;
            left: 19px;
          }
          
          .pulse {
            animation: pulse 2s infinite;
          }
          
          @keyframes pulse {
            0% {
              transform: scale(1);
              opacity: 1;
            }
            50% {
              transform: scale(1.1);
              opacity: 0.8;
            }
            100% {
              transform: scale(1);
              opacity: 1;
            }
          }
        </style>
      </head>
      <body>
        <div id="map" style="height: 100vh; width: 100%;"></div>
        <script>
          // Global variables
          let map;
          window.markers = [];
          
          // Initialize map
          function initMap() {
            map = L.map('map').setView([41.9028, 12.4964], 6);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              attribution: '© OpenStreetMap contributors'
            }).addTo(map);
            
            // Create custom icon function
            window.createClubIcon = function(club, isUserClub = false) {
              const className = isUserClub ? 'user-marker' : '';
              const pulseClass = isUserClub ? 'pulse' : '';
              
              return L.divIcon({
                className: 'custom-div-icon',
                html: \`
                  <div class="marker-container \${className}">
                    <div class="marker-base">
                      <div class="marker-inner \${pulseClass}" style="background-color: \${club.color};">
                        \${club.name.charAt(0)}
                      </div>
                    </div>
                    <div class="marker-pointer"></div>
                    <div class="marker-shadow"></div>
                  </div>
                \`,
                iconSize: isUserClub ? [48, 60] : [40, 50],
                iconAnchor: isUserClub ? [24, 60] : [20, 50],
                popupAnchor: [0, -50]
              });
            }
          }
          
          // Initialize map when page loads
          document.addEventListener('DOMContentLoaded', initMap);
          
          // Fallback initialization if DOMContentLoaded already fired
          if (document.readyState === 'complete' || document.readyState === 'interactive') {
            setTimeout(initMap, 100);
          }
        </script>
      </body>
    </html>
  `;

  const handleWebViewMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'log') {
        console.log('WebView log:', data.message);
      } else if (data.type === 'error') {
        console.error('WebView error:', data.message);
      }
    } catch (error) {
      console.error('Error parsing WebView message:', error);
    }
  };

  const renderClubItem = ({ item }: { item: Club }) => (
    <TouchableOpacity 
      style={[
        styles.clubItem,
        item.is_user_voted && styles.userClubItem
      ]}
      onPress={() => {
        setSelectedClub(item);
        // Inject JavaScript to focus on selected club
        if (webViewRef.current && item.latitude && item.longitude) {
          const jsCode = `
            try {
              const selectedClub = ${JSON.stringify(item)};
              map.setView([parseFloat(selectedClub.latitude), parseFloat(selectedClub.longitude)], 8);
              
              // Find and open popup for this club
              window.markers.forEach(marker => {
                const markerLatLng = marker.getLatLng();
                if (markerLatLng.lat === parseFloat(selectedClub.latitude) && 
                    markerLatLng.lng === parseFloat(selectedClub.longitude)) {
                  marker.openPopup();
                }
              });
              true;
            } catch (error) {
              console.error('Error focusing club:', error);
              false;
            }
          `;
          webViewRef.current.injectJavaScript(jsCode);
        }
      }}
    >
      <View style={[styles.clubColor, { backgroundColor: item.color }]} />
      <Text style={styles.clubName}>{item.name}</Text>
      <Text style={styles.voteCount}>{item.votes_count} votes</Text>
    </TouchableOpacity>
  );

  if (loading && clubs.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchClubs}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <View style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Rankings</Text>
        </View>
        
        <RankingTabs navigation={navigation} activeTab="clubs" />

        <View style={styles.mapContainer}>
          <WebView
            ref={webViewRef}
            source={{ html: htmlContent }}
            style={styles.map}
            onMessage={handleWebViewMessage}
            javaScriptEnabled={true}
            onLoad={() => {
              console.log('WebView loaded');
              setTimeout(updateMapMarkers, 500);
            }}
          />
        </View>

        <View style={styles.searchContainer}>
          <Text style={styles.searchLabel}>Search Clubs</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Enter club name..."
            value={searchQuery}
            onChangeText={handleSearch}
            placeholderTextColor="#6c757d"
          />
        </View>

        <View style={styles.rankingOuterContainer}>
          <Text style={styles.rankingTitle}>Club Rankings</Text>
          <View style={styles.rankingContainer}>
            <FlatList
              ref={flatListRef}
              data={filteredClubs.sort((a, b) => b.votes_count - a.votes_count)}
              renderItem={renderClubItem}
              keyExtractor={item => item.id.toString()}
              contentContainerStyle={styles.rankingListContent}
              scrollEnabled={true}
              nestedScrollEnabled={true}
              showsVerticalScrollIndicator={true}
              initialNumToRender={5}
              maxToRenderPerBatch={10}
              windowSize={10}
              refreshing={loading}
              onRefresh={fetchClubs}
              onScrollToIndexFailed={(info) => {
                const wait = new Promise(resolve => setTimeout(resolve, 500));
                wait.then(() => {
                  if (flatListRef.current) {
                    flatListRef.current.scrollToIndex({ index: info.index, animated: true });
                  }
                });
              }}
            />
          </View>
        </View>
      </View>
      <TabBar navigation={navigation} onLogout={handleLogout} />
    </View>
  );
};

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  headerContainer: {
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginTop: 30,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212529',
  },
  mapContainer: {
    height: height * 0.35, // 35% của chiều cao màn hình
    backgroundColor: '#fff',
  },
  map: {
    flex: 1,
  },
  searchContainer: {
    padding: 15,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  searchLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 10,
  },
  searchInput: {
    height: 45,
    borderWidth: 1.5,
    borderColor: '#dee2e6',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
    color: '#212529',
  },
  rankingOuterContainer: {
    backgroundColor: '#fff',
    flex: 1,
  },
  rankingTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212529',
    padding: 15,
    paddingBottom: 5,
  },
  rankingContainer: {
    flex: 1,
  },
  rankingListContent: {
    paddingBottom: 10,
  },
  clubItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  userClubItem: {
    backgroundColor: '#f0f0f0',
  },
  clubColor: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 10,
  },
  clubName: {
    flex: 1,
    fontSize: 16,
    color: '#212529',
  },
  voteCount: {
    fontSize: 14,
    color: '#6c757d',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#dc3545',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default GlobalRankingScreen; 