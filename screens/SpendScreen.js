import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SpendScreen({ navigation }) {
  // State variables declared here
  const [balance, setBalance] = useState(0);
  const [totalSpending, setTotalSpending] = useState(0);
  const [regularExpenses, setRegularExpenses] = useState(0);
  const [dailyLimit, setDailyLimit] = useState(100);
  const [inputAmount, setInputAmount] = useState('');
  const [dailyLimitInput, setDailyLimitInput] = useState('');
  const [balanceInput, setBalanceInput] = useState('');

  // Load data from AsyncStorage when component mounts
  useEffect(() => {
    loadSpendingData();
  }, []);

  // Save data to AsyncStorage whenever spending data changes
  useEffect(() => {
    saveSpendingData();
  }, [balance, totalSpending, regularExpenses, dailyLimit]);

  const loadSpendingData = async () => {
    try {
      const savedData = await AsyncStorage.getItem('spendingData');
      if (savedData !== null) {
        const data = JSON.parse(savedData);
        setBalance(data.balance || 0);
        setTotalSpending(data.totalSpending || 0);
        setRegularExpenses(data.regularExpenses || 0);
        setDailyLimit(data.dailyLimit || 100);
      }
    } catch (error) {
      console.error('Error loading spending data:', error);
    }
  };

  const saveSpendingData = async () => {
    try {
      const dataToSave = {
        balance,
        totalSpending,
        regularExpenses,
        dailyLimit
      };
      await AsyncStorage.setItem('spendingData', JSON.stringify(dataToSave));
    } catch (error) {
      console.error('Error saving spending data:', error);
    }
  };

  const addExpense = () => {
    const amount = parseFloat(inputAmount);
    if (!isNaN(amount) && amount > 0) {
      setTotalSpending(prev => prev + amount);
      setRegularExpenses(prev => prev + amount);
      setBalance(prev => prev - amount);
      setInputAmount('');
    }
  };

  const addIncome = () => {
    const amount = parseFloat(inputAmount);
    if (!isNaN(amount) && amount > 0) {
      setBalance(prev => prev + amount);
      setInputAmount('');
    }
  };

  const addOtherExpense = () => {
    const amount = parseFloat(inputAmount);
    if (!isNaN(amount) && amount > 0) {
      setTotalSpending(prev => prev + amount);
      setBalance(prev => prev - amount);
      setInputAmount('');
    }
  };

  const resetData = async () => {
    try {
      await AsyncStorage.removeItem('spendingData');
      setBalance(0);
      setTotalSpending(0);
      setRegularExpenses(0);
      setDailyLimit(100);
      setInputAmount('');
      setDailyLimitInput('');
      setBalanceInput('');
    } catch (error) {
      console.error('Error clearing spending data:', error);
    }
  };

  const updateDailyLimit = () => {
    const amount = parseFloat(dailyLimitInput);
    if (!isNaN(amount) && amount > 0) {
      setDailyLimit(amount);
      setDailyLimitInput('');
    }
  };

  const updateBalance = () => {
    const amount = parseFloat(balanceInput);
    if (!isNaN(amount)) {
      setBalance(amount);
      setBalanceInput('');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Spend Analysis</Text>
      
      {/* Display Variables */}
      <View style={styles.statsContainer}>
        <Text style={styles.statText}>Balance: {balance.toFixed(2)}</Text>
        <Text style={styles.statText}>Total Spending: {totalSpending.toFixed(2)}</Text>
        <Text style={styles.statText}>Daily Limit: {dailyLimit.toFixed(2)}</Text>
        <Text style={[styles.statText, regularExpenses > dailyLimit && styles.warningText]}>
          Remaining: {(dailyLimit - regularExpenses).toFixed(2)}
        </Text>
      </View>

      {/* Input Section */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Enter amount"
          placeholderTextColor="#888"
          value={inputAmount}
          onChangeText={setInputAmount}
          keyboardType="numeric"
        />
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.addButton} onPress={addExpense}>
            <Text style={styles.buttonText}>Add Expense</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.incomeButton} onPress={addIncome}>
            <Text style={styles.buttonText}>Add Income</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.otherExpenseButton} onPress={addOtherExpense}>
            <Text style={styles.buttonText}>Other Expenses</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Spacer to push adjustment sections to bottom */}
      <View style={styles.spacer} />

      {/* Daily Limit Section - Smaller */}
      <View style={styles.adjustmentContainerSmall}>
        <Text style={styles.adjustmentTitleSmall}>Adjust Daily Limit</Text>
        <View style={styles.adjustmentRow}>
          <TextInput
            style={styles.adjustmentInputSmall}
            placeholder="New daily limit"
            placeholderTextColor="#888"
            value={dailyLimitInput}
            onChangeText={setDailyLimitInput}
            keyboardType="numeric"
          />
          <TouchableOpacity style={styles.adjustmentButtonSmall} onPress={updateDailyLimit}>
            <Text style={styles.buttonTextSmall}>Update</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Balance Section - Smaller */}
      <View style={styles.adjustmentContainerSmall}>
        <Text style={styles.adjustmentTitleSmall}>Adjust Balance</Text>
        <View style={styles.adjustmentRow}>
          <TextInput
            style={styles.adjustmentInputSmall}
            placeholder="New balance"
            placeholderTextColor="#888"
            value={balanceInput}
            onChangeText={setBalanceInput}
            keyboardType="numeric"
          />
          <TouchableOpacity style={styles.adjustmentButtonSmall} onPress={updateBalance}>
            <Text style={styles.buttonTextSmall}>Update</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Reset Button at Bottom */}
      <View style={styles.resetContainer}>
        <TouchableOpacity style={styles.resetButtonSmall} onPress={resetData}>
          <Text style={styles.resetButtonText}>Reset All</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    marginBottom: 40,
    textAlign: 'center',
  },
  statsContainer: {
    backgroundColor: '#1a1a1a',
    padding: 20,
    borderRadius: 10,
    marginBottom: 30,
  },
  statText: {
    color: 'white',
    fontSize: 18,
    marginBottom: 10,
    fontWeight: '600',
  },
  warningText: {
    color: '#ff4444',
  },
  inputContainer: {
    marginBottom: 30,
  },
  textInput: {
    backgroundColor: '#1a1a1a',
    color: 'white',
    padding: 15,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#333',
  },
  buttonContainer: {
    gap: 15,
  },
  addButton: {
    backgroundColor: '#4a90e2',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
  },
  incomeButton: {
    backgroundColor: '#4a90e2',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
  },
  otherExpenseButton: {
    backgroundColor: '#4a90e2',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  spacer: {
    flex: 1,
    minHeight: 50,
  },
  adjustmentContainerSmall: {
    backgroundColor: '#1a1a1a',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  adjustmentTitleSmall: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  adjustmentRow: {
    flexDirection: 'row',
    gap: 8,
  },
  adjustmentInputSmall: {
    flex: 1,
    backgroundColor: '#333',
    color: 'white',
    padding: 8,
    borderRadius: 6,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#555',
  },
  adjustmentButtonSmall: {
    backgroundColor: '#4a90e2',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonTextSmall: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  resetContainer: {
    marginTop: 15,
    alignItems: 'center',
    paddingBottom: 30,
  },
  resetButtonSmall: {
    backgroundColor: '#666',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 6,
    alignItems: 'center',
  },
  resetButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
});