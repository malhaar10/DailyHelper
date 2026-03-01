import * as Notifications from 'expo-notifications';

/**
 * Simple Transaction Detector
 * Detects payment notifications and sends reminder to update expenses
 * No parsing or autofill - just detection and notification
 */
export class TransactionDetector {
  // Common payment app package names (Android)
  static PAYMENT_APPS = [
    'com.google.android.apps.nbu.paisa.user', // Google Pay
    'com.phonepe.app',                         // PhonePe
    'net.one97.paytm',                         // Paytm
    'in.amazon.mShop.android.shopping',        // Amazon Pay
    'com.whatsapp',                            // WhatsApp Pay
    'in.org.npci.upiapp',                      // BHIM
    'com.freecharge.android',                  // Freecharge
    // Bank apps
    'com.sbi.lotusintouch',                    // SBI
    'com.icicibank.pockets',                   // ICICI
    'com.axis.mobile',                         // Axis
    'com.hdfc.mobile',                         // HDFC
    'com.snapwork.hdfc',                       // HDFC
    'com.csam.icici.bank.imobile',            // ICICI iMobile
  ];

  // Simple transaction keywords (successful payments only)
  static TRANSACTION_KEYWORDS = {
    success: [
      'paid',
      'debited',
      'sent',
      'payment successful',
      'transaction successful',
      'payment completed',
      'transfer successful',
      'transaction complete',
    ],
    // Ignore these
    ignore: [
      'pending',
      'processing',
      'failed',
      'declined',
      'rejected',
      'unsuccessful',
      'initiated',
      'request',
      'reminder',
    ],
  };

  /**
   * Check if notification text indicates a completed transaction
   */
  static isSuccessfulTransaction(text) {
    if (!text) return false;
    
    const lowerText = text.toLowerCase();
    
    // Check if it contains success keywords
    const hasSuccessKeyword = this.TRANSACTION_KEYWORDS.success.some(
      keyword => lowerText.includes(keyword)
    );
    
    // Make sure it doesn't contain ignore keywords
    const hasIgnoreKeyword = this.TRANSACTION_KEYWORDS.ignore.some(
      keyword => lowerText.includes(keyword)
    );
    
    return hasSuccessKeyword && !hasIgnoreKeyword;
  }

  /**
   * Check if notification is from a payment app or bank SMS
   */
  static isPaymentNotification(packageName) {
    if (!packageName) return false;
    
    // Check if it's from a known payment app
    const isPaymentApp = this.PAYMENT_APPS.some(
      pkg => packageName.includes(pkg)
    );
    
    // Also check for SMS/messaging apps (for bank SMS)
    const isSMSApp = 
      packageName.includes('com.android.messaging') ||
      packageName.includes('com.google.android.apps.messaging') ||
      packageName.includes('com.samsung.android.messaging');
    
    return isPaymentApp || isSMSApp;
  }

  /**
   * Process incoming notification
   * Returns true if it's a transaction and notification was sent
   */
  static async processNotification(notification) {
    try {
      const { packageName, title, body } = notification;
      
      // Check if it's from a payment source
      if (!this.isPaymentNotification(packageName)) {
        return false;
      }
      
      // Check if it's a successful transaction
      const fullText = `${title || ''} ${body || ''}`;
      if (!this.isSuccessfulTransaction(fullText)) {
        return false;
      }
      
      // Send reminder notification
      await this.sendExpenseReminder();
      
      console.log('Transaction detected - notification sent');
      return true;
      
    } catch (error) {
      console.error('Error processing notification:', error);
      return false;
    }
  }

  /**
   * Send a simple notification with action to open expenses
   */
  static async sendExpenseReminder() {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Transaction Detected',
          body: 'Tap to update your expenses',
          data: { 
            screen: 'Spending',
            action: 'open_expenses',
          },
          sound: true,
          priority: 'high',
          badge: 1,
        },
        trigger: null, // Send immediately
      });
      
      return true;
    } catch (error) {
      console.error('Error sending reminder:', error);
      return false;
    }
  }

  /**
   * Configure notification categories with actions (iOS)
   */
  static async setupNotificationCategories() {
    try {
      await Notifications.setNotificationCategoryAsync('transaction', [
        {
          identifier: 'open_expenses',
          buttonTitle: 'Add Expense',
          options: {
            opensAppToForeground: true,
          },
        },
        {
          identifier: 'dismiss',
          buttonTitle: 'Dismiss',
          options: {
            opensAppToForeground: false,
          },
        },
      ]);
      
      console.log('Notification categories configured');
    } catch (error) {
      console.error('Error setting up notification categories:', error);
    }
  }
}
