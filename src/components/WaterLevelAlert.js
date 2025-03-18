import React, { useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';

// Water level thresholds (in centimeters or your preferred unit)
const WATER_LEVELS = {
  LOW: 15,      // 15cm - Low water level
  HIGH: 25,     // 25cm - High water level
  CRITICAL: 35  // 35cm - Critical water level
};

// Alert messages for different levels
const ALERT_MESSAGES = {
  LOW: "Water level is low but within safe limits.",
  HIGH: "Warning: Water level is rising. Please stay alert.",
  CRITICAL: "EMERGENCY: Water level has reached critical levels. Immediate action required!"
};

function WaterLevelAlert() {
  const checkWaterLevel = async (currentLevel) => {
    try {
      // Get all residents to notify
      const residentsSnapshot = await getDocs(collection(db, 'residents'));
      const residents = [];
      residentsSnapshot.forEach((doc) => {
        residents.push({ id: doc.id, ...doc.data() });
      });

      let alertType = null;
      let alertMessage = "";

      // Determine alert type based on water level
      if (currentLevel >= WATER_LEVELS.CRITICAL) {
        alertType = "CRITICAL";
        alertMessage = ALERT_MESSAGES.CRITICAL;
      } else if (currentLevel >= WATER_LEVELS.HIGH) {
        alertType = "HIGH";
        alertMessage = ALERT_MESSAGES.HIGH;
      } else if (currentLevel <= WATER_LEVELS.LOW) {
        alertType = "LOW";
        alertMessage = ALERT_MESSAGES.LOW;
      }

      // If we need to send an alert
      if (alertType) {
        // Store the alert in Firestore
        await addDoc(collection(db, 'alerts'), {
          type: alertType,
          message: alertMessage,
          waterLevel: currentLevel,
          timestamp: serverTimestamp()
        });

        // Notify all residents
        residents.forEach(async (resident) => {
          // Send email notification
          if (resident.email) {
            await sendEmailAlert(resident.email, alertType, alertMessage, currentLevel);
          }

          // Send SMS for critical alerts only
          if (alertType === "CRITICAL" && resident.contact) {
            await sendSMSAlert(resident.contact, alertMessage);
          }
        });
      }
    } catch (error) {
      console.error('Error processing water level alert:', error);
    }
  };

  const sendEmailAlert = async (email, alertType, message, waterLevel) => {
    try {
      await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: email,
          subject: `Water Level Alert: ${alertType}`,
          html: `
            <h2>Water Level Alert</h2>
            <p><strong>Status: ${alertType}</strong></p>
            <p><strong>Current Water Level: ${waterLevel}cm</strong></p>
            <p>${message}</p>
            ${alertType === 'CRITICAL' ? '<p style="color: red; font-weight: bold;">Please take immediate action!</p>' : ''}
            <p>Stay safe and follow local authorities' instructions.</p>
          `
        }),
      });
    } catch (error) {
      console.error('Error sending email alert:', error);
    }
  };

  const sendSMSAlert = async (phoneNumber, message) => {
    try {
      await fetch('/api/send-sms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: phoneNumber,
          message: `EMERGENCY ALERT: ${message}`
        }),
      });
    } catch (error) {
      console.error('Error sending SMS alert:', error);
    }
  };

  return null; // This component doesn't render anything
}

export default WaterLevelAlert; 