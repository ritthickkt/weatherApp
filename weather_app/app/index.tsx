import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { Stack, useRouter } from 'expo-router';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}> 
      <Stack.Screen options={{ headerShown: false }} />
      <Text className="text-white text-2xl mb-5">
        Welcome to the weather app
      </Text> 
      <Pressable 
        style={styles.button}
        onPress={() => router.push('/location')}
      >
        <Text style={styles.buttonText}>Continue</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
  },
  text: {
    color: 'white',
    fontSize: 24,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    marginTop:10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  }
}); 