import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

class NotificationService {
  // Push notification support
  static async requestPushPermission() {
    try {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch (error) {
      console.error('Error requesting push permission:', error);
      return false;
    }
  }

  // Email notification
  static async sendEmailNotification(email, subject, message) {
    try {
      // Add to notifications collection
      await addDoc(collection(db, 'notifications'), {
        type: 'email',
        recipient: email,
        subject,
        message,
        timestamp: new Date(),
        status: 'pending'
      });
      return true;
    } catch (error) {
      console.error('Error sending email notification:', error);
      return false;
    }
  }

  // SMS notification
  static async sendSMSNotification(phoneNumber, message) {
    try {
      // Add to notifications collection
      await addDoc(collection(db, 'notifications'), {
        type: 'sms',
        recipient: phoneNumber,
        message,
        timestamp: new Date(),
        status: 'pending'
      });
      return true;
    } catch (error) {
      console.error('Error sending SMS notification:', error);
      return false;
    }
  }

  // Push notification
  static async sendPushNotification(title, message) {
    try {
      if (Notification.permission === 'granted') {
        new Notification(title, {
          body: message,
          icon: '/logo192.png'
        });
      }
      return true;
    } catch (error) {
      console.error('Error sending push notification:', error);
      return false;
    }
  }

  // Hybrid notification (sends through multiple channels)
  static async sendHybridNotification(userId, title, message) {
    try {
      // Get user preferences
      const userDoc = await getDocs(query(collection(db, 'users'), where('id', '==', userId)));
      const userData = userDoc.docs[0]?.data();

      if (userData) {
        const notifications = [];

        // Email notification if enabled
        if (userData.emailNotifications && userData.email) {
          notifications.push(this.sendEmailNotification(userData.email, title, message));
        }

        // SMS notification if enabled
        if (userData.smsNotifications && userData.phoneNumber) {
          notifications.push(this.sendSMSNotification(userData.phoneNumber, message));
        }

        // Push notification if enabled
        if (userData.pushNotifications) {
          notifications.push(this.sendPushNotification(title, message));
        }

        // Wait for all notifications to be sent
        await Promise.all(notifications);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error sending hybrid notification:', error);
      return false;
    }
  }

  // Get notification history
  static async getNotificationHistory(userId) {
    try {
      const notificationsQuery = query(
        collection(db, 'notifications'),
        where('recipient', '==', userId)
      );
      const querySnapshot = await getDocs(notificationsQuery);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting notification history:', error);
      return [];
    }
  }
}

export default NotificationService; 