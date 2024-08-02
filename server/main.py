from flask import Flask, request, jsonify, send_from_directory, abort
import base64
import io
import logging
from PIL import Image
import numpy as np
import os
from flask_cors import CORS
from pathlib import Path
from skimage import exposure
import json
from bot import respond_to_query, diagnose, generate_quiz
import pathlib
from pathlib import Path




if os.name == 'nt':  # 'nt' is the name for Windows operating systems
    temp = pathlib.PosixPath
    pathlib.PosixPath = pathlib.WindowsPath

logging.basicConfig(level=logging.INFO)
 
def preprocess_image(img: Image.Image) -> Image.Image:
    img_array = np.array(img)
    img_adapteq = exposure.equalize_adapthist(img_array, clip_limit=0.03)
    img_adapteq = (img_adapteq * 255).astype(np.uint8)
    return Image.fromarray(img_adapteq)

ENV = os.getenv("ENV", "development")


app = Flask(__name__, static_folder=Path('static'),static_url_path='',template_folder=Path('static'))
cors = CORS(app)

@app.route('/')
def serve_index():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    if os.path.exists(os.path.join(app.static_folder, path)): 
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, 'index.html')
 
 
@app.route('/predict', methods=['POST'])
def predict():

    try:
        data = request.json
        if 'image' not in data:
            abort(400, description="Image data is required.")
        
        # Decode base64 image
        img_data = data['image'].split(',')[1]  # Remove data URL prefix if present
        img_data = base64.b64decode(img_data)
        
        # Open image using PIL
        img = Image.open(io.BytesIO(img_data))
        
        if img.mode != 'RGB':
            img = img.convert('RGB')
            img = preprocess_image(img)
        
        
        pred = respond_to_query(None,img, False)
    
        cleaned_string = pred.strip('```json').strip()

        cleaned_string = cleaned_string.strip('```')

        data = json.loads(cleaned_string)
      
        response = {
            "prediction":data.get('prediction','N/A'),
            "metaInfo": data,
            "confidence":data.get('confidence','N/A'),
        }
        return jsonify(response)
    
    except Exception as e:
        logging.error(f"Error during prediction: {str(e)}")
        abort(500, description=str(e))


@app.route('/query', methods=['POST'])       
def get_response():
    data = request.json
    if 'query' not in data:
        abort(400, description="Query is required.")
    
    response = respond_to_query(data['query'], None, True)
    return jsonify({"response": response})

@app.route('/diagnose', methods=['POST'])
def get_diagnosis():
    data = request.json
    print(data)
    diagnosis,medication = diagnose(data)
    
    return jsonify({
        'diagnosis': diagnosis,
        'medication': medication
    })

@app.route('/generate-quiz', methods=['POST'])
def generate_questions():
    settings = request.json
    
    questions = generate_quiz(settings)
    cleaned_string = questions.strip('```json').strip()
    cleaned_string = cleaned_string.strip('```')
    data = json.loads(cleaned_string)

    return jsonify(data)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000,use_reloader=True)
       