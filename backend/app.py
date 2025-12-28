from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import re
from nltk.corpus import stopwords
from predict import predict_news

app = Flask(__name__)
CORS(app)

# Load model and vectorizer
model = joblib.load('models/model.pkl')
vectorizer = joblib.load('models/vectorizer.pkl')

def preprocess_text(text):
    text = str(text).lower()
    text = re.sub(r'http\S+|www\S+|https\S+', '', text)
    text = re.sub(r'[^a-zA-Z\s]', '', text)
    stop_words = set(stopwords.words('english'))
    text = ' '.join([word for word in text.split() if word not in stop_words])
    return text

@app.route('/', methods=['POST'])
def predict():
    data = request.json
    text = data.get('text', '')
    
    if not text:
        return jsonify({'error': 'No news text provided'}), 400
    
    # Preprocess and vectorize
    cleaned_text = preprocess_text(text)
    text_vec = vectorizer.transform([cleaned_text])
    
    # Predict
    prediction = model.predict(text_vec)[0]
    probability = model.predict_proba(text_vec)[0]
    
    result = {
        'prediction': 'FAKE' if prediction == 0 else 'REAL',
        'confidence': float(max(probability)),
        'probabilities': {
            'real': float(probability[1]),
            'fake': float(probability[0])
        }
    }
    
    # result = predict_news(text)
    # print(result)
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True, port=5000)