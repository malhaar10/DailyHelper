import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LaundryScreen({ navigation }) {
  const [clothType, setClothType] = useState('');
  const [clothCount, setClothCount] = useState('');
  const [laundryItems, setLaundryItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Calculate total items count
  const totalItems = laundryItems.reduce((sum, item) => sum + item.count, 0);

  // Load data on component mount
  useEffect(() => {
    loadLaundryData();
  }, []);

  // Save data whenever laundryItems changes
  useEffect(() => {
    if (!isLoading) {
      saveLaundryData();
    }
  }, [laundryItems, isLoading]);

  const loadLaundryData = async () => {
    try {
      const savedData = await AsyncStorage.getItem('laundryItems');
      if (savedData) {
        setLaundryItems(JSON.parse(savedData));
      }
    } catch (error) {
      console.error('Error loading laundry data:', error);
      Alert.alert('Error', 'Failed to load saved data');
    } finally {
      setIsLoading(false);
    }
  };

  const saveLaundryData = async () => {
    try {
      await AsyncStorage.setItem('laundryItems', JSON.stringify(laundryItems));
    } catch (error) {
      console.error('Error saving laundry data:', error);
      Alert.alert('Error', 'Failed to save data');
    }
  };

  const addLaundryItem = () => {
    if (clothType.trim() === '' || clothCount.trim() === '') {
      Alert.alert('Error', 'Please enter both cloth type and count');
      return;
    }

    const newItem = {
      id: Date.now(),
      type: clothType.trim(),
      count: parseInt(clothCount) || 1,
    };

    setLaundryItems([...laundryItems, newItem]);
    setClothType('');
    setClothCount('');
  };

  const removeItem = (id) => {
    setLaundryItems(laundryItems.filter(item => item.id !== id));
  };

  const clearAllItems = () => {
    Alert.alert(
      'Clear All Items',
      'Are you sure you want to remove all laundry items?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear All', 
          style: 'destructive',
          onPress: () => setLaundryItems([])
        }
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Laundry Management</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Cloth Type:</Text>
        <TextInput
          style={styles.textInput}
          placeholder="e.g., Shirts, Pants, Socks"
          placeholderTextColor="#666"
          value={clothType}
          onChangeText={setClothType}
        />
        
        <Text style={styles.inputLabel}>Count:</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Number of items"
          placeholderTextColor="#666"
          value={clothCount}
          onChangeText={setClothCount}
          keyboardType="numeric"
        />
        
        <TouchableOpacity style={styles.addButton} onPress={addLaundryItem}>
          <Text style={styles.buttonText}>Add Item</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.counterContainer}>
        <Text style={styles.counterText}>
          Total Items: {totalItems}
        </Text>
        {laundryItems.length > 0 && (
          <TouchableOpacity style={styles.clearButton} onPress={clearAllItems}>
            <Text style={styles.clearButtonText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.itemsList}>
        <Text style={styles.listTitle}>Laundry Items:</Text>
        {laundryItems.length === 0 ? (
          <Text style={styles.emptyText}>No items added yet</Text>
        ) : (
          laundryItems.map((item) => (
            <View key={item.id} style={styles.itemRow}>
              <Text style={styles.itemText}>
                {item.type}: {item.count} {item.count === 1 ? 'item' : 'items'}
              </Text>
              <TouchableOpacity 
                style={styles.removeButton} 
                onPress={() => removeItem(item.id)}
              >
                <Text style={styles.removeButtonText}>Remove</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    padding: 20,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    fontSize: 18,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    marginBottom: 30,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    color: 'white',
    fontSize: 16,
    marginBottom: 5,
    marginTop: 10,
  },
  textInput: {
    backgroundColor: '#333',
    color: 'white',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#555',
  },
  addButton: {
    backgroundColor: '#4a90e2',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 15,
    alignItems: 'center',
  },
  counterContainer: {
    backgroundColor: '#1a1a1a',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  counterText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  clearButton: {
    backgroundColor: '#ff4444',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  clearButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  itemsList: {
    flex: 1,
    marginBottom: 20,
  },
  listTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 20,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#222',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  itemText: {
    color: 'white',
    fontSize: 16,
    flex: 1,
  },
  removeButton: {
    backgroundColor: '#ff4444',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  removeButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});