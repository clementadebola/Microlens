from typing import List
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import google.generativeai as genai
import os
from pydantic import BaseModel
from dotenv import load_dotenv
from geopy.geocoders import Nominatim
from geopy.distance import geodesic


geolocator = Nominatim(user_agent="virtual_diagnostic_agent")

class PatientInfo(BaseModel):
    age: int
    gender: str
    medical_history: List[str]
    current_symptoms: List[str]
    latitude: float
    longitude: float

class DiagnosisRequest(BaseModel):
    patient_info: PatientInfo
    user_input: str

class DiagnosisResponse(BaseModel):
    diagnosis: str
    prognosis: str
    medication: List[str]
    nearby_facilities: List[str]

@app.post("/diagnose", response_model=DiagnosisResponse)
async def diagnose(request: DiagnosisRequest):
    prompt = f"""
    Patient Information:
    Age: {request.patient_info.age}
    Gender: {request.patient_info.gender}
    Medical History: {', '.join(request.patient_info.medical_history)}
    Current Symptoms: {', '.join(request.patient_info.current_symptoms)}
    
    Patient's Input: {request.user_input}
    
    Based on the above information, provide a diagnosis, prognosis, and recommended medication.
    Format your response as follows:
    Diagnosis: [Your diagnosis here]
    Prognosis: [Your prognosis here]
    Medication: [List medications, separated by commas]
    """
    
    try:
        response = model.generate_content(prompt)
        
        diagnosis = response.text.split("Diagnosis:")[1].split("Prognosis:")[0].strip()
        prognosis = response.text.split("Prognosis:")[1].split("Medication:")[0].strip()
        medication = response.text.split("Medication:")[1].strip().split(", ")
        
        nearby_facilities = find_nearby_facilities(request.patient_info.latitude, request.patient_info.longitude)
        
        return DiagnosisResponse(
            diagnosis=diagnosis,
            prognosis=prognosis,
            medication=medication,
            nearby_facilities=nearby_facilities
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def find_nearby_facilities(latitude: float, longitude: float) -> List[str]:
    location = geolocator.reverse(f"{latitude}, {longitude}")
    query = f"hospitals near {location.raw['display_name']}"
    facilities = geolocator.geocode(query, exactly_one=False, limit=5)
    
    nearby = []
    for facility in facilities:
        distance = geodesic((latitude, longitude), (facility.latitude, facility.longitude)).miles
        nearby.append(f"{facility.address} ({distance:.2f} miles)")
    
    return nearby

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)