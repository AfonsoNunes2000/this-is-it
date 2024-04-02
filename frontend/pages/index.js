import { useEffect, useState } from 'react';

export default function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('https://iscf-e2939-default-rtdb.europe-west1.firebasedatabase.app/sensor_data.json');
      const data = await response.json();
      setData(data);
    };

    fetchData().catch(console.error);
  }, []);

  return (
    <div>
      <h1>Data from Firebase</h1>
      <div>
        {data ? (
          <ul>
            {Object.entries(data).map(([key, value]) => (
              <li key={key}>{JSON.stringify(value)}</li>
            ))}
          </ul>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}



/*import { useEffect, useState } from 'react';
import firebase from 'firebase/app';
import 'firebase/database';

// Initialize Firebase (replace with your Firebase config)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  databaseURL: "YOUR_DATABASE_URL",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
    // Reference to your Firebase database
    const dbRef = firebase.database().ref('sensor_data');

    // Listen for changes in the database
    dbRef.on('value', (snapshot) => {
      const newData = snapshot.val();
      setData(newData);
    });

    // Unsubscribe from database updates when component unmounts
    return () => dbRef.off('value');
  }, []);

  return (
    <div>
      <h1>Data from Firebase</h1>
      <div>
        {data ? (
          <ul>
            {Object.entries(data).map(([key, value]) => (
              <li key={key}>{JSON.stringify(value)}</li>
            ))}
          </ul>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}*/