import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ 
      headerShown: false,
      tabBarStyle: { display: 'none' }  // This hides the tab bar
    }}>
      <Tabs.Screen
        name="entryScreen"
        options={{
          title: 'View Location',
        }}
      />
    </Tabs>
  );
} 