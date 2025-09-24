import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

import LaundryScreen from './screens/LaundryScreen';
import AttendanceScreen from './screens/AttendanceScreen';
import SpendScreen from './screens/SpendScreen';

const Stack = createStackNavigator();

function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome!</Text>

      <View style={styles.buttonSection}>
        <TouchableOpacity
          style={styles.customButton}
          onPress={() => navigation.navigate('Laundry')}
        >
          <Text style={styles.buttonText}>Laundry</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.customButton}
          onPress={() => navigation.navigate('Attendance')}
        >
          <Text style={styles.buttonText}>Attendance</Text>
        </TouchableOpacity>

        <View style={styles.buttonSection}>
          <TouchableOpacity
            style={styles.customButton}
            onPress={() => navigation.navigate('Spending')}
          >
            <Text style={styles.buttonText}>Spending</Text>
          </TouchableOpacity>
        </View>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#000000',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Daily Helper' }}
        />
        <Stack.Screen
          name="Laundry"
          component={LaundryScreen}
          options={{ title: 'Laundry' }}
        />
        <Stack.Screen
          name="Attendance"
          component={AttendanceScreen}
          options={{ title: 'Attendance' }}
        />
        <Stack.Screen
          name="Spending"
          component={SpendScreen}
          options={{ title: 'Spending' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 40,
  },
  buttonSection: {
    width: '100%',
    alignItems: 'center',
  },
  customButton: {
    backgroundColor: '#4a90e2',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});