import {useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, Pressable, ActivityIndicator, SafeAreaView, BackHandler, Animated } from 'react-native';
import { fetchWeatherApi } from 'openmeteo';
import { useFonts } from 'expo-font';
import { BlurView } from 'expo-blur';
import { useSharedValue, withTiming, useAnimatedStyle, Easing } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';


export default function LocationScreen() {
  const [fontsLoaded] = useFonts({
    'TemperatureFont': require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const {cityName, latitude, longitude } = useLocalSearchParams();
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [weather, setWeather] = useState<{ time: Date; temperature2m: number } | null>(null);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (cityName && latitude && longitude) {
      getWeather(cityName as string);
    }
  }, [cityName, latitude, longitude]);

  const getWeather = async (cityName: string) => {
    setSelectedCity(cityName);
    setLoading(true);
    setWeather(null);
    const params = {
      latitude: latitude,
      longitude: longitude,
      current: 'temperature_2m',
    };
    const url = 'https://api.open-meteo.com/v1/forecast';
    const responses = await fetchWeatherApi(url, params);
    // console.log('Weather API Response:', responses);
    const response = responses[0];
    const utcOffsetSeconds = response.utcOffsetSeconds();
    const current = response.current();
    setWeather({
      time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
      temperature2m: current.variables(0).value(),
    });
    setLoading(false);
  };

  const randomWidth = useSharedValue(10);

  const config = {
    duration: 500,
    easing: Easing.bezier(0.5, 0.01, 0, 1),
  };
  
  const style = useAnimatedStyle(() => {
    return {
      width: withTiming(randomWidth.value, config),
    };
  });

  return (
    <LinearGradient
      colors={[
        'rgba(2, 0, 36, 1)',       
        'rgba(9, 9, 121, 1)',      
        'rgba(0, 212, 255, 1)'     
      ]}
      start={{ x: 0, y: 1 }}
      end={{ x: 0, y: 0 }}
      style={styles.container}
    >
      <View style={styles.cityName}>
        <Animated.View style={[styles.cityName, style]} />
        <Text style={styles.buttonText}>{selectedCity}</Text>
      </View>
      {loading && <ActivityIndicator color="white" />}
      {weather && (
        <View>
          <Text style={styles.temperature}>{weather.temperature2m.toFixed(0)}</Text>
          <Text style={styles.text}>{weather.time.toDateString()}</Text>
        </View>
      )}
      <View style={styles.backButtonContainer}>
        <BlurView intensity={50} tint="dark" style={styles.blurWrapper}>
          <Pressable onPress={() => router.push('/')}>
            <Text style={styles.backButtonText}>Back</Text>
          </Pressable>
        </BlurView>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  cityName: {
    position: 'absolute',
    top: 70,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    fontFamily: 'TemperatureFont',
    fontSize: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
    minWidth: 120,
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'TemperatureFont',
    color: 'white',
    fontSize: 25,
  },
  temperature: {
    fontSize: 120,
    fontFamily: 'TemperatureFont',
    fontWeight: 'bold',
    shadowColor: 'black',
    color: 'white',
    marginTop: 10,
    textAlign: 'center',
  },
  blurWrapper: {
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: 'red',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  backButtonText: {
    paddingVertical: 10,
    paddingHorizontal: 150,
    backgroundColor: 'black',
    borderRadius: 30,
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  backButtonContainer: {
    position: 'absolute',
    bottom: 40,
  },
});