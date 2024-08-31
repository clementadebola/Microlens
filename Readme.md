
# Microlens

**Microlens** is a progressive web app designed to empower both healthcare providers and everyday users by offering accurate diagnosis and health education at your fingertips.

## Model Performance

This project includes a train.ipynb file containing a model trained with DenseNet121 on the DiBas dataset. While this model exhibits strong performance, particularly in improving the accuracy of microbial classification for diagnostic purposes, it is generally outperformed by the Gemini bacteria classification benchmark.

## Tech Stack

The following technologies were used in the development of Microlens:

- **Frontend:**
  - React, Styled-component, Typescript
  - Firebase Auth, Storage and Firestore
  - react-i18next

- **Backend:**
  - Python
  - Flask

- **Machine Learning:**
  - Python
  - TensorFlow/PyTorch
  - DiBas Dataset
  - Gemini Benchmark

- **Database:**
  - Firebase

- **Other Tools:**
  - Docker

## Getting Started

To get started with Microlens, clone the repository and follow the instructions below.

### Running the Client

1. Navigate to the `client` directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

### Running the Server

1. Navigate to the `server` directory:
   ```bash
   cd server
   ```

2. Activate the Python virtual environment:
   ```bash
   source venv/bin/activate   # On Linux/MacOS
   venv\Scripts\activate      # On Windows
   ```

3. Install the required Python packages:
   ```bash
   pip install -r requirements.txt
   ```

4. Run the Python server:
   ```bash
   python main.py
   ```
