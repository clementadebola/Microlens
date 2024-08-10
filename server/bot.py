import google.generativeai as genai
from flask import abort
import os
genai.configure(api_key='AIzaSyD2sCWYP85Ov8kJlBSbyBoOaH3Iv7vBorQ')
model = genai.GenerativeModel('gemini-pro')
vision_model = genai.GenerativeModel('gemini-1.5-flash')

def respond_to_query(query: str, image: str,is_concise: bool = False, lang:str ='en') -> str:
    if not is_concise:
        prompt = """
        NB: Ensure to return the information in a beautifully formatted markdown, with each field on a new line
        
        For the provided microorganism image, follow these steps:
        
        Ensure to return:
    confidence: Accuracy of your prediction in % 
    Imaging Type:  Microorganism
    prediction: Name of the organism, biological entity, or type of medical imaging,
    metaInfo: 
        Species: The species of the organism
        Domain: The domain of the organism (Bacteria, Archaea, or Eukarya)
        Disease(s): The disease(s) it causes, if any
        Transmission: How the organism is transmitted
        Diagnosis: Methods used to diagnose the diseases caused by the organism
        Symptoms: Common symptoms of the diseases
        Treatment: Drugs and treatments for the diseases
        Prevention: Methods to prevent infection or spread
        Habitat: The natural environment or typical location where the organism is found
        Morphology: Physical structure and form of the organism
        Size: Dimensions of the organism, often in micrometers
        Shape: Form of the organism"
        Oxygen Requirement: Whether the organism is aerobic, anaerobic, or facultative anaerobe
        Growth Temperature: Optimal temperature range for growth
        Colony Characteristics: Appearance of colonies on culture media
        Virulence Factors: Molecules produced by pathogens contributing to the pathogenicity
        Genome Size: Size of the organism's genome
        GC Content: Percentage of guanine and cytosine in the DNA
        Replication: Mode of replication
        Motility: Whether the organism can move and how
        Biochemical Tests: "Tests used for identification
        Environmental Resistance: Ability to withstand environmental stresses
        Public Health Impact: Importance to public health
        Isolation Sources: Typical specimens from which the organism is isolated
        Antibiotics Sensitivity: List of sensitive antibiotics
        Antibiotic Resistance: List of resistant antibiotics

"""
        response = vision_model.generate_content([prompt,image])
    else:
        prompt = f"""
        You are a physician chatbot named Jhmeel.
        Provide a brief, concise answer to the user's query in {lang} language.
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
    language: {request['language'] or 'en'}
  
    Based on the above information (my personal information), predict a diagnosis and recommended medication. Your response should be detailed and self explanatory even to a layman and must include these elements regardless of the input parameters.
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
    language = settings['language'] or 'en'

    prompt = f"""
    Generate {number_of_questions} {difficulty} multiple-choice questions about {field} in the medical field in {language} language. Question should be clinical word problem essentially diagnostic, for  Each question should have 4 possible answers, with one correct answer. Format the output as a JSON array of objects, where each object has the following structure:
     
        "id: "unique id", 
        "text: "question text", 
        "answers: ["answer1", "answer2", "answer3", "answer4"], 
        "correctAnswer: "correct answer text"
    """
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        abort(500, description=f"An error occurred while processing your request: {str(e)}")
    
