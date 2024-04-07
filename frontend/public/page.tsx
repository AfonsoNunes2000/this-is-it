'use client'

import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, off } from 'firebase/database';
import { DataSnapshot } from 'firebase/database';
import { Line } from 'react-chartjs-2';
import { CategoryScale, LinearScale, PointElement, LineElement,  Chart } from 'chart.js';
import { format, differenceInSeconds } from 'date-fns'; // Import date-fns for timestamp conversion


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
  const [updateInterval, setUpdateInterval] = useState<number>(1000);
  const [intervalDisplay, setIntervalDisplay] = useState<number>(1);
  const [warnings, setWarnings] = useState<string[]>([]); // State for warnings
  const [lastTimestamp, setLastTimestamp] = useState<number>(0);


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
          checkWarnings(mostRecentEntry.data); // Check warnings for latest data
        }
        setTimeout(() => {
          isUpdating = false;
        }, updateInterval);
      }
    };

    const checkWarnings = (data: SensorData[string]) => {
      const { x, y, z } = data;
      const xthreshold = 10; // Define your threshold here
      const ythreshold = 1; // Define your threshold here
      const zthreshold = 1; // Define your threshold here
      const newWarnings: string[] = [];

      if (x < -xthreshold || x > xthreshold) {
        newWarnings.push('X value is outside threshold');
      }
      if (y < -ythreshold || y > ythreshold) {
        newWarnings.push('Y value is outside threshold');
      }
      if (z < -zthreshold || z > zthreshold) {
        newWarnings.push('Z value is outside threshold');
      }

      setWarnings(newWarnings);
    };

    onValue(dbRef, handleDataChange, (error: Error) => {
      console.error('Error fetching data:', error);
      setError(error.message);
    });

    return () => {
      off(dbRef, 'value', handleDataChange);
    };
  }, [database, updateInterval]);

useEffect(() => {
    const intervalId = setInterval(() => {
        if (latestData && latestData.data.timestamp > lastTimestamp) {
            setXData(prevXData => [...prevXData, latestData.data.x]);
            setYData(prevYData => [...prevYData, latestData.data.y]);
            setZData(prevZData => [...prevZData, latestData.data.z]);
            setLastTimestamp(latestData.data.timestamp); // Update the last timestamp
        }
    }, updateInterval);

    return () => clearInterval(intervalId);
}, [latestData, updateInterval, lastTimestamp]);


  const handleIntervalChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newInterval = parseInt(event.target.value);
    setUpdateInterval(newInterval);
    setIntervalDisplay(newInterval / 1000);
  };

  const generateTimeLabels = (dataLength: number) => {
    return Array.from({ length: dataLength }, (_, i) => i * (updateInterval / 1000));
  };

  return (
    <div className="container">
      <header>
        <h1>Sensor Data</h1>
      </header>
      <main>
        <div className="content">
          <div className="latest-data">
            <h2><strong>Most Recent Data</strong></h2>
            {latestData && (
              <ul>
                <li><strong>Timestamp:</strong> {format(new Date(latestData.data.timestamp * 1000), 'MM/dd/yyyy HH:mm:ss')}</li>
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
                  labels: generateTimeLabels(xData.length),
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
                  scales: {
                    x: {
                      title: {
                        display: true,
                        text: 'Time (seconds)',
                      },
                    },
                  },
                }}
              />
            </div>
            <div className="chart">
              <h2>Y Axis</h2>
              <Line
                data={{
                  labels: generateTimeLabels(yData.length),
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
                  scales: {
                    x: {
                      title: {
                        display: true,
                        text: 'Time (seconds)',
                      },
                    },
                  },
                }}
              />
            </div>
            <div className="chart">
              <h2>Z Axis</h2>
              <Line
                data={{
                  labels: generateTimeLabels(zData.length),
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
                  scales: {
                    x: {
                      title: {
                        display: true,
                        text: 'Time (seconds)',
                      },
                    },
                  },
                }}
              />
            </div>
          </div>
          <div className="slider-container">
            <label htmlFor="update-interval-slider">Update Interval: {intervalDisplay} second(s)</label>
            <input
              type="range"
              id="update-interval-slider"
              min="1000"
              max="10000"
              step="1000"
              value={updateInterval}
              onChange={handleIntervalChange}
            />
          </div>
          <div className="warnings">
            <h2><strong>Warnings</strong></h2>
            <ul>
              {warnings.map((warning, index) => (
                <li key={index}>{warning}</li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Page;