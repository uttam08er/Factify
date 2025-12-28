import os
import json
from openai import OpenAI
from dotenv import load_dotenv
from bytez import Bytez

load_dotenv()

api_key=Bytez(os.getenv("OPENAI_API_KEY"))
client = OpenAI(api_key=api_key)

def predict_news(text):
    prompt = f"""
Analyze this news text and determine if it's likely REAL or FAKE news. Consider factors like: sensationalism, lack of sources, emotional manipulation, factual inconsistencies, and credibility indicators.

Return ONLY valid JSON in this exact format (no markdown, no backticks):
{{
  "prediction": "REAL" or "FAKE",
  "confidence": 0.0 to 1.0,
  "reasoning": "short explanation",
  "indicators": ["indicator1", "indicator2", "indicator3"]
}}

Text:
\"\"\"{text}\"\"\"
"""

    response = client.chat.completions.create(
        # model="gpt-4.1-mini",  # fast + accurate
        model="gpt-5.1",  # new
        # sdk = Bytez(api_key)
        # choose gpt-5.1
        # model = sdk.model("openai/gpt-5.1")
        max_tokens=1000,
        messages=[
            {"role": "system", "content": "You are a fake news detection expert."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.2
    )

    raw_output = response.choices[0].message.content.strip()
    
    return json.loads(raw_output)

if __name__ == '__main__':
    text = "IndiGo flight status live highlights: IndiGo CEO grilled by DGCA for 2 days amid subsiding disruptions | India News"
    result = predict_news(text)
    print(result)