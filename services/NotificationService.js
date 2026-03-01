import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { TransactionDetector } from './TransactionDetector';

/**
 * Notification Service
 * Handles notification permissions and listening
 */
export class NotificationService {
  static notificationListener = null;
  static responseListener = null;

  /**
   * Initialize notification service
   */
  static async initialize() {
    // Configure how notifications should be handled
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });

    // Request permissions
    await this.requestPermissions();

    // Set up notification categories
    await TransactionDetector.setupNotificationCategories();

    console.log('Notification service initialized');
  }

  /**
   * Request notification permissions
   */
  static async requestPermissions() {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.warn('Notification permission not granted');
        return false;
      }

      console.log('Notification permissions granted');
      return true;
    } catch (error) {
      console.error('Error requesting permissions:', error);
      return false;
    }
  }

  /**
   * Set up notification listeners
   * @param {Function} onNotificationTap - Callback when user taps notification
   */
  static setupListeners(onNotificationTap) {
    // Listen for notifications received while app is in foreground
    this.notificationListener = Notifications.addNotificationReceivedListener(
      notification => {
        console.log('📱 Notification received:', notification.request.content.title);
      }
    );

    // Listen for user tapping on notifications
    this.responseListener = Notifications.addNotificationResponseReceivedListener(
      response => {
        const data = response.notification.request.content.data;
        
        console.log('Notification tapped:', data);
        
        // Call the callback with the target screen
        if (onNotificationTap && data.screen) {
          onNotificationTap(data.screen, data);
        }
      }
    );

    console.log('Notification listeners set up');
  }

  /**
   * Remove notification listeners
   */
  static removeListeners() {
    if (this.notificationListener) {
      Notifications.removeNotificationSubscription(this.notificationListener);
      this.notificationListener = null;
    }

    if (this.responseListener) {
      Notifications.removeNotificationSubscription(this.responseListener);
      this.responseListener = null;
    }

    console.log('🗑️ Notification listeners removed');
  }

  /**
   * Get notification permission status
   */
  static async getPermissionStatus() {
    const { status } = await Notifications.getPermissionsAsync();
    return status === 'granted';
  }
}
