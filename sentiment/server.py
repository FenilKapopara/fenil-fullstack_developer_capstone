from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/analyze', methods=['GET', 'POST'])
def analyze_sentiment():
    # Handle both GET (query param) and POST (json body)
    text = ""
    if request.method == 'POST':
        data = request.get_json()
        text = data.get('text', '')
    else:
        text = request.args.get('text', '')
    
    # Simple rule-based sentiment for demonstration without heavy ML libs
    text_lower = text.lower()
    positive_keywords = ['good', 'great', 'fantastic', 'excellent', 'amazing', 'happy', 'love', 'best']
    negative_keywords = ['bad', 'poor', 'terrible', 'worst', 'hate', 'sad', 'angry']
    
    score = 0
    for word in positive_keywords:
        if word in text_lower:
            score += 1
    for word in negative_keywords:
        if word in text_lower:
            score -= 1
            
    sentiment = "neutral"
    if score > 0:
        sentiment = "positive"
    elif score < 0:
        sentiment = "negative"
        
    return jsonify({"sentiment": sentiment, "score": score})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
