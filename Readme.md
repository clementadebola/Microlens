from flask import Flask, request, jsonify
import google.generativeai as genai

app = Flask(__name__)

# Configure the Gemini AI model (replace with actual configuration)
genai.configure(api_key="YOUR_API_KEY")
model = genai.GenerativeModel('gemini-pro')

@app.route('/api/generate-questions', methods=['POST'])
def generate_questions():
    settings = request.json
    difficulty = settings['difficulty']
    number_of_questions = settings['numberOfQuestions']
    field = settings['field']

    # Construct a prompt for the Gemini AI model
    prompt = f"Generate {number_of_questions} {difficulty} multiple-choice questions about {field} in the medical field. Each question should have 4 possible answers, with one correct answer. Format the output as a JSON arrayprompt = f"Generate {number_of_questions} {difficulty} multiple-choice questions about {field} in the medical field. Each question should have 4 possible answers, with one correct answer. Format the output as a JSON array of objects, where each object has the following structure: {{\"id\": number, \"text\": \"question text\", \"answers\": [\"answer1\", \"answer2\", \"answer3\", \"answer4\"], \"correctAnswer\": \"correct answer text\"}}."

    # Generate questions using the Gemini AI model
    response = model.generate_content(prompt)

    # Parse the generated content as JSON
    questions = json.loads(response.text)

    return jsonify(questions)

if __name__ == '__main__':
    app.run(debug=True)