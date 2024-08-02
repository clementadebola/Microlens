import google.generativeai as genai
from flask import abort
import os
genai.configure(api_key='AIzaSyD2sCWYP85Ov8kJlBSbyBoOaH3Iv7vBorQ')
model = genai.GenerativeModel('gemini-pro')
vision_model = genai.GenerativeModel('gemini-1.5-flash')

def respond_to_query(query: str, image: str,is_concise: bool = False) -> str:
    if not is_concise:
        prompt = """
You are a physician chatbot named Jhmeel. When given an image of a microorganism or a constituent of a biological sample, respond with the following information in a clear and structured format:

If any information is not available or not applicable, please state 'N/A' for that field.
It is very very important that you provide and separate metaInfo string values with "|" as in the template given to you.

Ensure to return a valid JSON containing:
{
    "prediction": ["Name of the organism"],
    "metaInfo": {
        "Name": "The name of the microorganism",
        "Species": "The species of the microorganism",
        "Domain": "The domain of the microorganism (Bacteria, Archaea, or Eukarya)",
        "Disease(s)": "The disease(s) it causes, if any",
        "Transmission": "How the microorganism is transmitted",
        "Diagnosis": "Methods used to diagnose the diseases caused by the microorganism",
        "Symptoms": "Common symptoms of the diseases",
        "Treatment": "Drugs and treatments for the diseases",
        "Prevention": "Methods to prevent infection or spread",
        "Habitat": "The natural environment or typical location where the microorganism is found",
        "Morphology": "Physical structure and form of the microorganism",
        "Size": "Dimensions of the microorganism, often in micrometers",
        "Elevation": "Typical altitude where the microorganism is found, if applicable",
        "Shape": "Form of the microorganism",
        "Oxygen Requirement": "Whether the microorganism is aerobic, anaerobic, or facultative anaerobe",
        "Growth Temperature": "Optimal temperature range for growth",
        "Colony Characteristics": "Appearance of colonies on culture media",
        "Virulence Factors": "Molecules produced by pathogens contributing to the pathogenicity",
        "Genome Size": "Size of the microorganism's genome",
        "GC Content": "Percentage of guanine and cytosine in the DNA",
        "Replication": "Mode of replication",
        "Motility": "Whether the microorganism can move and how",
        "Biochemical Tests": "Tests used for identification",
        "Environmental Resistance": "Ability to withstand environmental stresses",
        "Public Health Impact": "Importance to public health",
        "Isolation Sources": "Typical specimens from which the microorganism is isolated",
        "Antibiotics Sensitivity": "List of sensitive antibiotics",
        "Antibiotic Resistance": "List of resistant antibiotics"
    },
    "confidence": ["Accuracy of your prediction in %"]
}

Ensure to replace the descriptions with actual information about the microorganism in the image, and use 'N/A' for any information that is not available or not applicable.
"""
        response = vision_model.generate_content([prompt,image])
    else:
        prompt = f"""
        You are a physician chatbot named Jhmeel.
        Provide a brief, concise answer to the user's query.
        Include only the most essential information.

        If any information is not available, please state "Sorry, I can't answer that.".

        User query: {query}
        """
   
    try: 
        response = model.generate_content(prompt)
        
        if not response.text:
            raise ValueError("Sorry, I can't answer that.")
        
        return response.text.strip()
    except Exception as e:
        abort(500, description=f"An error occurred while processing your request: {str(e)}")

    
def diagnose(request) -> tuple:
    prompt = f"""
    Patient Information:
    Age: {request['patientInfo']['age']}
    Gender: {request['patientInfo']['gender']}
    Medical History: {request['patientInfo']['medicalHistory']}
    Current Symptoms: {request['complaint']}
  
    Based on the above information, predict a diagnosis and recommended medication. Your response should be detailed and self explanatory even to a layman and must include these elements regardless of the input parameters.
    Format your response as follows:
    Diagnosis: [Your probable diagnosis here (In broad and explanatory terms)]
    Medication: [List medications, separated by commas]
    """
    
    try:
        response = model.generate_content(prompt)
        print(response)
        
        response_text = response.text 
        
        
        diagnosis = response_text.split("Diagnosis:")[1].split("Medication:")[0].strip()
        medication = response_text.split("Medication:")[1].strip().split(", ")
        
        return (
            diagnosis,
            medication
        )
    except Exception as e:
        abort(500, description=f"An error occurred while processing your request: {str(e)}")


def generate_quiz(settings):
    difficulty = settings['difficulty']
    number_of_questions = settings['numberOfQuestions']
    field = settings['field']

    prompt = f"""
    Generate {number_of_questions} {difficulty} multiple-choice questions about {field} in the medical field. Each question should have 4 possible answers, with one correct answer. Format the output as a JSON array of objects, where each object has the following structure:
     
        "id": "unique id", 
        "text": "question text", 
        "answers": ["answer1", "answer2", "answer3", "answer4"], 
        "correctAnswer": "correct answer text"
    """
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        abort(500, description=f"An error occurred while processing your request: {str(e)}")
    
