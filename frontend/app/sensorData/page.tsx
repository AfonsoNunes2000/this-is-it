'use client'

import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, off } from 'firebase/database';
import { DataSnapshot } from 'firebase/database';
import { Line } from 'react-chartjs-2';
import { CategoryScale, LinearScale, PointElement, LineElement,  Chart } from 'chart.js';

Chart.register(CategoryScale);
Chart.register(LinearScale);
Chart.register(PointElement);
Chart.register(LineElement);




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
const Page: React.FC = () => {
  const [latestData, setLatestData] = useState<{ name: string; data: SensorData[string] } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [xData, setXData] = useState<number[]>([]);
  const [yData, setYData] = useState<number[]>([]);
  const [zData, setZData] = useState<number[]>([]);
  const [updateInterval, setUpdateInterval] = useState<number>(2000); // Default to 2 seconds

  useEffect(() => {
    const dbRef = ref(database, 'sensor_data');
    let isUpdating = false;

    const handleDataChange = (snapshot: DataSnapshot) => {
      if (!isUpdating) {
        isUpdating = true;
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
        if (mostRecentEntry) {
          setLatestData(mostRecentEntry);
          setXData(prevXData => [...prevXData, mostRecentEntry.data.x]);
          setYData(prevYData => [...prevYData, mostRecentEntry.data.y]);
          setZData(prevZData => [...prevZData, mostRecentEntry.data.z]);
        }
        setTimeout(() => {
          isUpdating = false;
        }, updateInterval);
      }
    };

    onValue(dbRef, handleDataChange, (error: Error) => {
      console.error('Error fetching data:', error);
      setError(error.message);
    });

    return () => {
      off(dbRef, 'value', handleDataChange);
    };
  }, [updateInterval]);

  const handleIntervalChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUpdateInterval(parseInt(event.target.value));
  };

  return (
    <div className="container">
      <header>
        <h1>Sensor Data</h1>
      </header>
      <main>
        <div className="content">
          <div className="latest-data">
            <h2>Most Recent Data</h2>
            {latestData && (
              <ul>
                <li><strong>Name:</strong> {latestData.name}</li>
                <li><strong>Timestamp:</strong> {latestData.data.timestamp}</li>
                <li><strong>X:</strong> {latestData.data.x}</li>
                <li><strong>Y:</strong> {latestData.data.y}</li>
                <li><strong>Z:</strong> {latestData.data.z}</li>
              </ul>
            )}
            {error && <p className="error">Error: {error}</p>}
          </div>
          <div className="charts">
            <div className="chart">
              <h2>X Axis</h2>
              <Line
                data={{
                  labels: xData.map((_, index) => index),
                  datasets: [
                    {
                      label: '',
                      data: xData,
                      borderColor: 'rgba(255, 99, 132, 1)',
                      fill: false,
                    },
                  ],
                }}
                options={{
                  aspectRatio: 1.5,
                }}
              />
            </div>
            <div className="chart">
              <h2>Y Axis</h2>
              <Line
                data={{
                  labels: yData.map((_, index) => index),
                  datasets: [
                    {
                      label: '',
                      data: yData,
                      borderColor: 'rgba(54, 162, 235, 1)',
                      fill: false,
                    },
                  ],
                }}
                options={{
                  aspectRatio: 1.5,
                }}
              />
            </div>
            <div className="chart">
              <h2>Z Axis</h2>
              <Line
                data={{
                  labels: zData.map((_, index) => index),
                  datasets: [
                    {
                      label: '',
                      data: zData,
                      borderColor: 'rgba(75, 192, 192, 1)',
                      fill: false,
                    },
                  ],
                }}
                options={{
                  aspectRatio: 1.5,
                }}
              />
            </div>
          </div>
          <div className="slider-container">
            <label htmlFor="update-interval-slider">Update Interval (ms):</label>
            <input
              type="range"
              id="update-interval-slider"
              min="1000"
              max="10000" // Adjust max based on your preference
              step="1000" // Adjust step based on your preference
              value={updateInterval}
              onChange={handleIntervalChange}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default Page;