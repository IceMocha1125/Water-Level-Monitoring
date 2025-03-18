const functions = require('firebase-functions');
const admin = require('firebase-admin');
const twilio = require('twilio');

admin.initializeApp();

// Your Twilio Account SID and Auth Token
const accountSid = 'YOUR_TWILIO_ACCOUNT_SID';
const authToken = 'YOUR_TWILIO_AUTH_TOKEN';
const twilioPhoneNumber = 'YOUR_TWILIO_PHONE_NUMBER';

const client = twilio(accountSid, authToken);

// Function to handle water level updates from Arduino
exports.updateWaterLevel = functions.https.onRequest(async (req, res) => {
  try {
    const { level, location } = req.body;
    
    // Add water level reading to database
    await admin.firestore().collection('waterLevels').add({
      level,
      location,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });

    // Check water level and send alerts if necessary
    if (level >= 14) { // High or Critical level
      await sendAlerts(level, location);
    }

    res.status(200).send({ success: true });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send({ error: error.message });
  }
});

// Function to send SMS alerts
async function sendAlerts(level, location) {
  try {
    // Get the last alert timestamp
    const lastAlertRef = await admin.firestore().collection('system').doc('lastAlert').get();
    const lastAlertTime = lastAlertRef.exists ? lastAlertRef.data().timestamp : 0;
    const now = Date.now();

    // Check if enough time has passed since the last alert (30 minutes)
    if (now - lastAlertTime < 30 * 60 * 1000) {
      console.log('Alert cooldown period not elapsed');
      return;
    }

    // Get all residents
    const residentsSnapshot = await admin.firestore().collection('residents').get();
    const residents = [];
    residentsSnapshot.forEach(doc => {
      residents.push({ id: doc.id, ...doc.data() });
    });

    // Determine alert level
    let alertLevel = level >= 19 ? 'CRITICAL' : 'HIGH';
    
    // Prepare alert message
    const message = `ALERT: Water level at ${location} is ${level} inches (${alertLevel}). Please take necessary precautions.`;

    // Send SMS to each resident
    for (const resident of residents) {
      if (resident.contact) {
        try {
          // Send SMS using Twilio
          const smsResponse = await client.messages.create({
            body: message,
            to: resident.contact,
            from: twilioPhoneNumber
          });

          // Log the alert
          await admin.firestore().collection('alerts').add({
            recipient: resident.contact,
            message: message,
            level: level,
            status: alertLevel,
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
            twilioSid: smsResponse.sid,
            delivered: true
          });

        } catch (error) {
          console.error(`Error sending SMS to ${resident.contact}:`, error);
          
          // Log failed alert attempt
          await admin.firestore().collection('alerts').add({
            recipient: resident.contact,
            message: message,
            level: level,
            status: alertLevel,
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
            error: error.message,
            delivered: false
          });
        }
      }
    }

    // Update last alert timestamp
    await admin.firestore().collection('system').doc('lastAlert').set({
      timestamp: now
    });

  } catch (error) {
    console.error('Error in sendAlerts:', error);
  }
}

// Function to manually trigger alerts (for testing)
exports.triggerAlert = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  try {
    await sendAlerts(data.level, data.location);
    return { success: true };
  } catch (error) {
    throw new functions.https.HttpsError('internal', error.message);
  }
}); 