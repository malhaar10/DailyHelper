import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, Linking } from 'react-native';
import { NotificationService } from '../services/NotificationService';

export default function SettingsScreen({ navigation }) {
  const [notificationEnabled, setNotificationEnabled] = useState(false);

  useEffect(() => {
    checkPermissionStatus();
  }, []);

  const checkPermissionStatus = async () => {
    const status = await NotificationService.getPermissionStatus();
    setNotificationEnabled(status);
  };

  const handleEnableNotifications = async () => {
    await NotificationService.requestPermissions();
    checkPermissionStatus();
  };

  const handleOpenSettings = () => {
    Alert.alert(
      '🔔 Notification Listener Setup',
      'For automatic transaction detection:\n\n1. Go to Settings\n2. Apps → Special app access\n3. Notification access\n4. Enable for DailyHelper\n\nThis allows the app to detect payment notifications.',
      [{ text: 'OK' }]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      
      {/* Notification Status */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📱 Notifications</Text>
        
        <View style={styles.statusCard}>
          <Text style={styles.statusLabel}>Status:</Text>
          <Text style={[styles.statusValue, notificationEnabled ? styles.enabled : styles.disabled]}>
            {notificationEnabled ? '✅ Enabled' : '❌ Disabled'}
          </Text>
        </View>

        {!notificationEnabled && (
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleEnableNotifications}
          >
            <Text style={styles.buttonText}>Enable Notifications</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Transaction Detection Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>💸 Transaction Detection</Text>
        
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>How it works:</Text>
          <Text style={styles.infoText}>
            • Detects payment notifications from UPI apps{'\n'}
            • Sends reminder to update expenses{'\n'}
            • Tap notification to open Spending page{'\n'}
            • All processing is local and private
          </Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Supported Apps:</Text>
          <Text style={styles.infoText}>
            • Google Pay, PhonePe, Paytm{'\n'}
            • Bank SMS notifications{'\n'}
            • WhatsApp Pay, Amazon Pay{'\n'}
            • BHIM, Freecharge{'\n'}
            • Major bank apps
          </Text>
        </View>

        <TouchableOpacity 
          style={styles.secondaryButton}
          onPress={handleOpenSettings}
        >
          <Text style={styles.buttonText}>Setup Instructions</Text>
        </TouchableOpacity>
      </View>

      {/* Privacy Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🔒 Privacy</Text>
        
        <View style={styles.privacyCard}>
          <Text style={styles.privacyText}>
            ✓ Only detects transaction notifications{'\n'}
            ✓ No data is extracted or saved{'\n'}
            ✓ No internet connection required{'\n'}
            ✓ All processing is on-device{'\n'}
            ✓ You control what expenses to add
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>DailyHelper v1.0.0</Text>
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
    marginBottom: 30,
    textAlign: 'center',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
  },
  statusCard: {
    backgroundColor: '#1a1a1a',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  statusLabel: {
    fontSize: 18,
    color: 'white',
    fontWeight: '600',
  },
  statusValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  enabled: {
    color: '#44ff44',
  },
  disabled: {
    color: '#ff4444',
  },
  infoCard: {
    backgroundColor: '#1a1a1a',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#333',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#ccc',
    lineHeight: 22,
  },
  privacyCard: {
    backgroundColor: '#1a3a1a',
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#2a5a2a',
  },
  privacyText: {
    fontSize: 14,
    color: '#88ff88',
    lineHeight: 22,
  },
  actionButton: {
    backgroundColor: '#4a90e2',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  secondaryButton: {
    backgroundColor: '#444',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 20,
    marginBottom: 40,
    alignItems: 'center',
  },
  footerText: {
    color: '#666',
    fontSize: 14,
  },
});
