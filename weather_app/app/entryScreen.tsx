import { BlurView } from 'expo-blur';
import { useFonts } from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import LottieView from 'lottie-react-native';
import { fetchWeatherApi } from 'openmeteo';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

// Function to get weather-appropriate gradient colors
const getWeatherGradient = (weatherCode: number): readonly [string, string, string] => {
  // Clear sky
  if (weatherCode === 0) {
    return ['rgba(135, 206, 235, 1)', 'rgba(87, 154, 255, 1)', 'rgba(0, 123, 255, 1)'] as const; // Blue sky gradient
  }
  // Partly cloudy
  else if (weatherCode >= 1 && weatherCode <= 3) {
    return ['rgba(176, 196, 222, 1)', 'rgba(135, 206, 235, 1)', 'rgba(100, 149, 237, 1)'] as const; // Light blue with clouds
  }
  // Foggy
  else if (weatherCode === 45 || weatherCode === 48) {
    return ['rgba(192, 192, 192, 1)', 'rgba(169, 169, 169, 1)', 'rgba(128, 128, 128, 1)'] as const; // Gray fog
  }
  // Drizzle
  else if (weatherCode >= 51 && weatherCode <= 55) {
    return ['rgba(105, 105, 105, 1)', 'rgba(47, 79, 79, 1)', 'rgba(25, 25, 112, 1)'] as const; // Dark gray with blue
  }
  // Rain
  else if (weatherCode >= 61 && weatherCode <= 65) {
    return ['rgba(105, 105, 105, 1)', 'rgba(64, 64, 64, 1)', 'rgba(47, 47, 47, 1)'] as const; // Gloomy grey rain
  }
  // Snow
  else if (weatherCode >= 71 && weatherCode <= 75) {
    return ['rgba(240, 248, 255, 1)', 'rgba(176, 196, 222, 1)', 'rgba(135, 206, 235, 1)'] as const; // Light blue snow
  }
  // Thunderstorm
  else if (weatherCode > 75) {
    return ['rgba(47, 79, 79, 1)', 'rgba(25, 25, 112, 1)', 'rgba(0, 0, 0, 1)'] as const; // Dark storm
  }
  // Default gradient (night time or unknown)
  else {
    return ['rgba(2, 0, 36, 1)', 'rgba(9, 9, 121, 1)', 'rgba(0, 212, 255, 1)'] as const; // Original gradient
  }
};

// Function to get weather-appropriate JSON animation
const getWeatherAnimation = (weatherCode: number) => {
  // Clear sky
  if (weatherCode === 0) {
    return require('../assets/clear-sky.json');
  }
  // Partly cloudy
  else if (weatherCode >= 1 && weatherCode <= 3) {
    return require('../assets/partly-cloudy.json');
  }
  // Foggy
  else if (weatherCode === 45 || weatherCode === 48) {
    return require('../assets/Foggy.json');
  }
  // Drizzle
  else if (weatherCode >= 51 && weatherCode <= 55) {
    return require('../assets/drizzle.json');
  }
  // Rain
  else if (weatherCode >= 61 && weatherCode <= 65) {
    return require('../assets/Rain.json');
  }
  // Snow
  else if (weatherCode >= 71 && weatherCode <= 75) {
    return require('../assets/snow.json');
  }
  // Thunderstorm
  else if (weatherCode > 75) {
    return require('../assets/ThunderStorm.json');
  }
  // Default to clear sky for other conditions
  else {
    return require('../assets/clear-sky.json');
  }
};

export default function LocationScreen() {
  const [fontsLoaded] = useFonts({
    'TemperatureFont': require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const {cityName, latitude, longitude } = useLocalSearchParams();
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [weather, setWeather] = useState<{ time: Date; temperature2m: number; weatherCode: number } | null>(null);
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
      current: ['temperature_2m', 'weather_code'],
    };
    const url = 'https://api.open-meteo.com/v1/forecast';
    const responses = await fetchWeatherApi(url, params);
    // console.log('Weather API Response:', responses);
    const response = responses[0];
    const utcOffsetSeconds = response.utcOffsetSeconds();
    const current = response.current();
    
    if (current) {
      setWeather({
        time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
        temperature2m: current.variables(0)?.value() || 0,
        weatherCode: current.variables(1)?.value() || 0,
      });
    }
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
      colors={getWeatherGradient(weather?.weatherCode || 0)}
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
          <LottieView 
            source={getWeatherAnimation(weather.weatherCode)} 
            style={styles.weatherImage}
            autoPlay
            loop
          />
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
  weatherImage: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginBottom: 20,
    resizeMode: 'contain',
  },
});