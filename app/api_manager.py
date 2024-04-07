import requests
import time
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from uvicorn import run

app = FastAPI()

# Define a Pydantic model for the data
class DataModel(BaseModel):
    x: Optional[float] = None
    y: Optional[float] = None
    z: Optional[float] = None
    timestamp: float

# A list to store the data
data_storage: List[DataModel] = []

# Firebase configuration
firebase_url = 'https://iscf-e2939-default-rtdb.europe-west1.firebasedatabase.app/sensor_data.json'

def send_to_firebase(data):
    try:
        response = requests.post(firebase_url, json=data)
        response.raise_for_status()  # Raise an exception if request fails
        print(f"Data sent to Firebase successfully, response: {response.text}")
    except Exception as e:
        print(f"Failed to send data to Firebase: {e}")

@app.post("/data")
async def receive_data(data: DataModel):
    # Store the incoming data
    data_storage.append(data)
    send_to_firebase(data.dict())  # Send data to Firebase
    return {"message": "Data received successfully"}

@app.get("/data")
async def get_data():
    # Return the stored data
    return data_storage

if __name__ == '__main__':
    # Run the FastAPI app
    run(app, host="127.0.0.1", port=8000)


'''
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from uvicorn import run
from typing import List, Optional
from fastapi import FastAPI, Depends

app = FastAPI()

# Define a Pydantic model for the data
class DataModel(BaseModel):
    x: Optional[float] = None
    y: Optional[float] = None
    z: Optional[float] = None
    timestamp: float

# A list to store the data
data_storage: List[DataModel] = []

@app.post("/data")
async def receive_data(data: DataModel):
    # Store the incoming data
    data_storage.append(data)
    return {"message": "Data received successfully"}

@app.get("/data")
async def get_data():
    # Return the stored data
    return data_storage

if __name__ == '__main__':
    # Run the FastAPI app
    run(app, host="127.0.0.1", port=8000)
'''