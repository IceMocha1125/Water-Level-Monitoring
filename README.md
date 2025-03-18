# Water Level Monitoring System

A real-time water level monitoring system with Firebase integration, featuring user authentication, resident management, and water level tracking with map visualization.

## Features

- User Authentication
- Real-time Water Level Monitoring
- Interactive Dashboard with Charts
- Google Maps Integration
- Resident Management
- PDF Report Generation
- Responsive Design

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase account
- Google Maps API key

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd water-level-monitoring
```

2. Install dependencies:
```bash
npm install
```

3. Configure Firebase:
   - Create a new Firebase project
   - Enable Authentication and Firestore
   - Copy your Firebase configuration to `src/firebase.js`

4. Configure Google Maps:
   - Get a Google Maps API key
   - Replace `YOUR_GOOGLE_MAPS_API_KEY` in `src/components/WaterLevelMonitoring.js`

5. Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:3000`

## Project Structure

```
src/
  ├── components/
  │   ├── Dashboard.js
  │   ├── Login.js
  │   ├── Residents.js
  │   └── WaterLevelMonitoring.js
  ├── contexts/
  │   └── AuthContext.js
  ├── firebase.js
  ├── App.js
  ├── index.js
  └── index.css
```

## Firebase Collections

- `users`: User authentication data
- `waterLevels`: Water level readings with timestamps
- `residents`: Resident information

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License. 