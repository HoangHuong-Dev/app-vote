import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { WebView } from 'react-native-webview';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { useAuth } from '../context/AuthContext';
import TabBar from '../components/TabBar';

interface Club {
  id: number;
  name: string;
  location: [number, number];
  votes: number;
  color: string;
}

type GlobalRankingScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'GlobalRanking'>;
};

// Mock data - Thay thế bằng API call thực tế
const mockClubs: Club[] = [
  { id: 1, name: 'Milan', location: [45.4642, 9.1900], votes: 150, color: '#FF0000' },
  { id: 2, name: 'Juventus', location: [45.1096, 7.6413], votes: 120, color: '#000000' },
  { id: 3, name: 'Inter', location: [45.4785, 9.1240], votes: 100, color: '#0000FF' },
  { id: 4, name: 'Napoli', location: [40.8518, 14.2681], votes: 90, color: '#00BFFF' },
  { id: 5, name: 'Roma', location: [41.9028, 12.4964], votes: 85, color: '#FFA500' },
  { id: 6, name: 'Lazio', location: [41.9028, 12.4964], votes: 80, color: '#87CEEB' },
  { id: 7, name: 'Fiorentina', location: [43.7792, 11.2463], votes: 75, color: '#800080' },
  { id: 8, name: 'Atalanta', location: [45.7080, 9.6633], votes: 70, color: '#000080' },
  { id: 9, name: 'Torino', location: [45.0703, 7.6869], votes: 65, color: '#8B0000' },
  { id: 10, name: 'Sampdoria', location: [44.4056, 8.9463], votes: 60, color: '#4169E1' },
];

const GlobalRankingScreen: React.FC<GlobalRankingScreenProps> = ({ navigation }) => {
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [filteredClubs, setFilteredClubs] = useState<Club[]>(mockClubs);
  const webViewRef = useRef<WebView>(null);

  // Mock user's selected club - Thay thế bằng dữ liệu thực từ API
  const userClub: Club = mockClubs[0]; // Milan

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

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
          
          const clubs = ${JSON.stringify(mockClubs)};
          const userClub = ${JSON.stringify(userClub)};
          const filteredClubs = ${JSON.stringify(filteredClubs)};
          const searchActive = ${searchQuery.length > 0 ? 'true' : 'false'};
          
          // Add markers for all clubs
          clubs.forEach(club => {
            if (club.id !== userClub.id) {
              // If search is active, only show filtered clubs with reduced opacity for non-matches
              const isInFilter = !searchActive || filteredClubs.some(fc => fc.id === club.id);
              const opacity = searchActive && !isInFilter ? 0.4 : 1;
              
              const marker = L.marker(club.location, {
                icon: createClubIcon(club, false),
                opacity: opacity
              })
              .bindPopup(\`
                <div style="text-align: center; padding: 5px;">
                  <div style="font-weight: bold; font-size: 16px; margin-bottom: 5px;">\${club.name}</div>
                  <div style="color: #666; font-size: 14px;">\${club.votes} votes</div>
                </div>
              \`)
              .addTo(map);
              
              window.markers.push(marker);
            }
          });
          
          // Add user's club marker
          const userMarker = L.marker(userClub.location, {
            icon: createClubIcon(userClub, true)
          })
          .bindPopup(\`
            <div style="text-align: center; padding: 5px;">
              <div style="font-weight: bold; font-size: 16px; margin-bottom: 5px;">\${userClub.name}</div>
              <div style="background-color: #e9f7ef; color: #27ae60; padding: 3px 8px; border-radius: 10px; display: inline-block; margin-bottom: 5px;">Your Club</div>
              <div style="color: #666; font-size: 14px;">\${userClub.votes} votes</div>
            </div>
          \`)
          .addTo(map);
          window.markers.push(userMarker);
          
          // Fit bounds to show all markers
          const bounds = L.latLngBounds(clubs.map(club => club.location));
          map.fitBounds(bounds, { padding: [50, 50] });
          
          // Log for debugging
          console.log('Updated map with clubs:', clubs.map(c => c.name).join(', '));
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
    const timer = setTimeout(() => {
      updateMapMarkers();
    }, 1000); // Delay to ensure WebView is fully loaded
    
    return () => clearTimeout(timer);
  }, [filteredClubs, searchQuery]);

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
            map = L.map('map').setView([42.5, 12.5], 5);
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
            
            // Initial markers
            const clubs = ${JSON.stringify(mockClubs)};
            const userClub = ${JSON.stringify(userClub)};
            
            // Add all clubs to map
            clubs.forEach(club => {
              if (club.id !== userClub.id) {
                const marker = L.marker(club.location, {
                  icon: createClubIcon(club, false)
                })
                .bindPopup(\`
                  <div style="text-align: center; padding: 5px;">
                    <div style="font-weight: bold; font-size: 16px; margin-bottom: 5px;">\${club.name}</div>
                    <div style="color: #666; font-size: 14px;">\${club.votes} votes</div>
                  </div>
                \`)
                .addTo(map);
                
                window.markers.push(marker);
              }
            });
            
            // Add user's club
            const userMarker = L.marker(userClub.location, {
              icon: createClubIcon(userClub, true)
            })
            .bindPopup(\`
              <div style="text-align: center; padding: 5px;">
                <div style="font-weight: bold; font-size: 16px; margin-bottom: 5px;">\${userClub.name}</div>
                <div style="background-color: #e9f7ef; color: #27ae60; padding: 3px 8px; border-radius: 10px; display: inline-block; margin-bottom: 5px;">Your Club</div>
                <div style="color: #666; font-size: 14px;">\${userClub.votes} votes</div>
              </div>
            \`)
            .addTo(map);
            window.markers.push(userMarker);
            
            // Open user club popup by default
            setTimeout(() => {
              userMarker.openPopup();
            }, 1000);
            
            // Fit bounds to show all markers
            const bounds = L.latLngBounds(clubs.map(club => club.location));
            map.fitBounds(bounds, { padding: [50, 50] });
            
            // Log for debugging
            console.log('Map initialized with clubs:', clubs.map(c => c.name).join(', '));
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

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text.trim() === '') {
      setFilteredClubs(mockClubs);
    } else {
      const filtered = mockClubs.filter(club => 
        club.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredClubs(filtered);
    }
  };

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
        item.id === userClub.id && styles.userClubItem
      ]}
      onPress={() => {
        setSelectedClub(item);
        // Inject JavaScript to focus on selected club
        if (webViewRef.current) {
          const jsCode = `
            try {
              const selectedClub = ${JSON.stringify(item)};
              map.setView(selectedClub.location, 8);
              
              // Find and open popup for this club
              window.markers.forEach(marker => {
                const markerLatLng = marker.getLatLng();
                if (markerLatLng.lat === selectedClub.location[0] && 
                    markerLatLng.lng === selectedClub.location[1]) {
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
      <Text style={styles.voteCount}>{item.votes} votes</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.mainContainer}>
      <View style={styles.contentContainer}>
        <View style={styles.mapContainer}>
          <WebView
            ref={webViewRef}
            source={{ html: htmlContent }}
            style={styles.map}
            onMessage={handleWebViewMessage}
            javaScriptEnabled={true}
            onLoad={() => {
              console.log('WebView loaded');
              // Give it a moment to initialize
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
              data={filteredClubs.sort((a, b) => b.votes - a.votes)}
              renderItem={renderClubItem}
              keyExtractor={item => item.id.toString()}
              contentContainerStyle={styles.rankingListContent}
              scrollEnabled={true}
              nestedScrollEnabled={true}
              showsVerticalScrollIndicator={true}
              initialNumToRender={5}
              maxToRenderPerBatch={10}
              windowSize={10}
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
});

export default GlobalRankingScreen; 