import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View } from 'react-native';

import { SearchScreen } from './src/screens/SearchScreen';
import { BrowseScreen } from './src/screens/BrowseScreen';
import { DetailScreen } from './src/screens/DetailScreen';
import { FilterScreen } from './src/screens/FilterScreen';

import { Colors, Typography } from './src/theme';
import { RootStackParamList, TabParamList } from './src/types';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const TabIcon: React.FC<{ name: string; focused: boolean }> = ({ name, focused }) => (
  <Text style={{
    fontFamily: Typography.monoFamily,
    fontSize: Typography.size.xxs,
    letterSpacing: 1.5,
    color: focused ? Colors.textPrimary : Colors.textTertiary,
  }}>
    {name}
  </Text>
);

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.bg0,
          borderTopWidth: 1,
          borderTopColor: Colors.border0,
          height: 60,
          paddingBottom: 10,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon name="SEARCH" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Browse"
        component={BrowseScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon name="BROWSE" focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer
      theme={{
        dark: true,
        colors: {
          primary: Colors.textPrimary,
          background: Colors.bg0,
          card: Colors.bg0,
          text: Colors.textPrimary,
          border: Colors.border0,
          notification: Colors.textPrimary,
        },
        fonts: {
          regular: { fontFamily: 'System', fontWeight: '400' },
          medium: { fontFamily: 'System', fontWeight: '500' },
          bold: { fontFamily: 'System', fontWeight: '600' },
          heavy: { fontFamily: 'System', fontWeight: '700' },
        },
      }}
    >
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen
          name="Detail"
          component={DetailScreen}
          options={{
            presentation: 'card',
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="Filter"
          component={FilterScreen}
          options={{
            presentation: 'modal',
            animation: 'slide_from_bottom',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
