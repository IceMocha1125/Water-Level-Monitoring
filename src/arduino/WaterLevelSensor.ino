#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <ArduinoJson.h>

// Ultrasonic sensor pins
const int trigPin = D1;
const int echoPin = D2;

// WiFi credentials
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// Firebase function URL (you'll need to create a Cloud Function)
const char* serverUrl = "YOUR_FIREBASE_FUNCTION_URL";

// Measurement interval (10 seconds)
const long interval = 10000;
unsigned long previousMillis = 0;

void setup() {
  Serial.begin(115200);
  
  // Initialize ultrasonic sensor pins
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  
  // Connect to WiFi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected");
}

float measureWaterLevel() {
  // Clear the trigger pin
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  
  // Send 10μs pulse
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  
  // Measure the response
  long duration = pulseIn(echoPin, HIGH);
  
  // Calculate distance in inches
  // Speed of sound = 343m/s = 13503.937 inches/s
  // distance = (duration/2) * (13503.937/1000000)
  float distance = duration * 0.0067519685; // Simplified calculation
  
  return distance;
}

void sendToFirebase(float waterLevel) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    WiFiClient client;
    
    // Create JSON document
    StaticJsonDocument<200> doc;
    doc["level"] = waterLevel;
    doc["location"] = "Cupang Proper";
    
    String jsonString;
    serializeJson(doc, jsonString);
    
    // Send POST request to Firebase function
    http.begin(client, serverUrl);
    http.addHeader("Content-Type", "application/json");
    
    int httpResponseCode = http.POST(jsonString);
    
    if (httpResponseCode > 0) {
      String response = http.getString();
      Serial.println("HTTP Response code: " + String(httpResponseCode));
      Serial.println(response);
    } else {
      Serial.println("Error on sending POST: " + String(httpResponseCode));
    }
    
    http.end();
  }
}

void loop() {
  unsigned long currentMillis = millis();
  
  if (currentMillis - previousMillis >= interval) {
    previousMillis = currentMillis;
    
    // Measure water level
    float waterLevel = measureWaterLevel();
    
    // Print to Serial for debugging
    Serial.print("Water Level: ");
    Serial.print(waterLevel);
    Serial.println(" inches");
    
    // Send to Firebase
    sendToFirebase(waterLevel);
  }
} 