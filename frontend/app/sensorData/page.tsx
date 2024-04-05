'use client'

import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, off } from 'firebase/database';
import { DataSnapshot } from 'firebase/database';


// Your Firebase configuration
const firebaseConfig = {
 apiKey: "AIzaSyBHcmOa0BfjkaOzF_afetF50msVma3gjIQ",
 authDomain: "iscf-e2939.firebaseapp.com",
 databaseURL: "https://iscf-e2939-default-rtdb.europe-west1.firebasedatabase.app/",
 projectId: "iscf-e2939",
 storageBucket: "iscf-e2939.appspot.com",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

interface SensorData {
 [key: string]: {
    timestamp: number;
    x: number;
    y: number;
    z: number;
 };
}

function Page() {
 const [latestData, setLatestData] = useState<{name: string; data: SensorData[string] }| null>(null);
 const [error, setError] = useState<string | null>(null);

 useEffect(() => {
    const dbRef = ref(database, 'sensor_data');

    const handleDataChange = (snapshot: DataSnapshot) => {
      const data: SensorData = snapshot.val();
      let mostRecentEntry: { name: string; data: SensorData[string] } | null = null;
      let mostRecentTimestamp = 0;
      for (const name in data) {
        if (data.hasOwnProperty(name)) {
          const sensorData = data[name];
          if (sensorData.timestamp > mostRecentTimestamp) {
            mostRecentTimestamp = sensorData.timestamp;
            mostRecentEntry = { name, data: sensorData };
          }
        }
      }
      setLatestData(mostRecentEntry);
    };

    onValue(dbRef, handleDataChange, (error: Error) => {
      console.error('Error fetching data:', error);
      setError(error.message);
    });

    // Cleanup function to remove the listener when the component unmounts
    return () => {
      off(dbRef, 'value', handleDataChange);
    };
 }, []);

 return (
    <div>
      <p>Hello</p>
      {error && <p>Error: {error}</p>}
      {latestData && (
        <div>
          <p>Most Recent Data:</p>
          <p>Name: {latestData.name}</p>
          <p>Timestamp: {latestData.data.timestamp}</p>
          <p>X: {latestData.data.x}</p>
          <p>Y: {latestData.data.y}</p>
          <p>Z: {latestData.data.z}</p>
        </div>
      )}
    </div>
 );
}

export default Page;

