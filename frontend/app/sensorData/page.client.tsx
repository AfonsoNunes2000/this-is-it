import React, { useState, useEffect } from 'react';

// Assuming you've defined the SensorData interface
interface SensorData {
  timestamp: number;
  x: number;
  y: number;
  z: number;
}

function Page() {
  // Initialize your state with a specific type
  const [data, setData] = useState<SensorData | null>(null);

  useEffect(() => {
    async function fetchData() {
      // Fetch the data and then set it
      // Ensure you parse or cast the response to SensorData
      const response = await fetch('your-data-source-url');
      const result: SensorData = await response.json();
      setData(result);
    }
    fetchData();
  }, []);

  // Now TypeScript knows the structure of `data` and won't throw the TS2339 error
  return (
    <div>
      {data && (
        <div>
          <p>Timestamp: {data.timestamp}</p>
          <p>X: {data.x}</p>
          <p>Y: {data.y}</p>
          <p>Z: {data.z}</p>
        </div>
      )}
    </div>
  );
}

export default Page;
