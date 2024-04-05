'use client'

import React, { useState, useEffect } from 'react';

interface SensorData {
  [key: string]: {
    timestamp: number;
    x: number;
    y: number;
    z: number;
  };

}

function Page() {
  const [fetchedData, setFetchedData] = useState<SensorData | null>(null);
  const [error, setError] = useState<string | null>(null); // Specify the type of error as string

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('https://iscf-e2939-default-rtdb.europe-west1.firebasedatabase.app/sensor_data.json');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const result: SensorData = await response.json();
        setFetchedData(result);

      } catch (error: any) { // Use ': any' to cast the error to any type
        console.error('Error fetching data:', error);
        setError(error.message); // Set the error state
      }
    }

    fetchData(); // Call the fetchData function
  }, []);

  console.log(fetchedData)

  return (
    <div>
      <p>Hello</p>

      {error && <p>Error: {error}</p>}

      {fetchedData && (
        <div>
          {Object.keys(fetchedData).map((key) => (
            <div key={key}>
              <p>Name: {key}</p>
              <p>Timestamp: {fetchedData[key].timestamp}</p>
              <p>X: {fetchedData[key].x}</p>
              <p>Y: {fetchedData[key].y}</p>
              <p>Z: {fetchedData[key].z}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Page;


