import React, { useState } from 'react';
import { AlertCircle, CheckCircle, Loader2, FileText, TrendingUp } from 'lucide-react';
import './App.css'

function App() {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const analyzeNews = async () => {
    if (!text.trim()) {
      setError('Please enter some text to analyze');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    //     try {
    //       // const response = await fetch('https://api.anthropic.com/v1/messages', {
    //       const response = await fetch('http://127.0.0.1:5000/predict', {
    //         method: 'POST',
    //         headers: {
    //           'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify({
    //           model: 'claude-sonnet-4-20250514',
    //           max_tokens: 1000,
    //           messages: [{
    //             role: 'user',
    //             content: `Analyze this news text and determine if it's likely REAL or FAKE news. Consider factors like: sensationalism, lack of sources, emotional manipulation, factual inconsistencies, and credibility indicators.

    // Text: "${text}"

    // Respond ONLY with a JSON object in this exact format (no markdown, no backticks):
    // {
    //   "prediction": "REAL" or "FAKE",
    //   "confidence": 0.0 to 1.0,
    //   "reasoning": "brief explanation",
    //   "indicators": ["indicator1", "indicator2", "indicator3"]
    // }`
    //           }]
    //         })
    //       });

    //       const data = await response.json();
    //       const content = data.content[0].text.trim();
    //       const cleanContent = content.replace(/```json|```/g, '').trim();
    //       const analysis = JSON.parse(cleanContent);

    //       setResult(analysis);

    // ------------------------------------------------------------------------------------

    try {
      const response = await fetch('http://127.0.0.1:5000/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text
        })
      });

      // const data = await response.json();
      // console.log(data);
      // const content = data.content[0].text.trim();
      // const cleanContent = content.replace(/```json|```/g, '').trim();
      // const analysis = JSON.parse(cleanContent);

      // setResult(analysis);

      if (!response.ok) {
        throw new Error('Server error');
      }

      const data = await response.json();
      console.log(data);

      setResult({
        prediction: data.prediction,  // "FAKE" or "REAL"
        confidence: data.confidence,  // 0.0 to 1.0
        reasoning: data.prediction === 'FAKE'
          ? 'ML model detected patterns associated with fake news'
          : 'ML model found patterns consistent with real news',
        indicators: [
          `Confidence: ${(data.confidence * 100).toFixed(1)}%`,
          `Probability FAKE: ${(data.probabilities.fake * 100).toFixed(1)}%`,
          `Probability REAL: ${(data.probabilities.real * 100).toFixed(1)}%`
        ]
      });

      // ------------------------------------------------------------------------------------

    } catch (err) {
      setError('Analysis failed. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const exampleNews = [
    {
      type: 'fake',
      text: 'BREAKING: Scientists discover that drinking 10 cups of coffee daily makes you immortal! Doctors are SHOCKED by this simple trick that pharmaceutical companies don\'t want you to know!'
    },
    {
      type: 'real',
      text: 'New study published in Nature journal suggests moderate coffee consumption may be associated with reduced risk of certain cardiovascular diseases, according to research conducted over 10 years with 500,000 participants.'
    }
  ];

  return (
    // <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            {/* <FileText className="w-12 h-12 text-blue-400" /> */}
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-pink-400 bg-clip-text text-transparent">
              Factify
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            AI-powered analysis to identify misinformation and fake news
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Enter News Text or Headline
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste the news article or headline you want to verify..."
            className="w-full h-40 p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none resize-none text-gray-800"
          />

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            onClick={analyzeNews}
            disabled={loading}
            className="mt-4 w-full bg-gradient-to-r from-blue-400 to-pink-400 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-blue-500 hover:to-pink-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <TrendingUp className="w-5 h-5" />
                Analyze News
              </>
            )}
          </button>
        </div>

        {/* Results */}
        {result && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-6 animate-in fade-in duration-500">
            <div className="flex items-center gap-4 mb-6">
              {result.prediction === 'REAL' ? (
                <div className="flex items-center gap-3 text-green-600">
                  <div className="p-3 bg-green-100 rounded-full">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold">Likely REAL</h2>
                    <p className="text-gray-600">This appears to be legitimate news</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 text-red-600">
                  <div className="p-3 bg-red-100 rounded-full">
                    <AlertCircle className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold">Likely FAKE</h2>
                    <p className="text-gray-600">This may be misinformation</p>
                  </div>
                </div>
              )}
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-gray-700">Confidence Score</span>
                <span className="text-sm font-bold text-gray-900">
                  {(result.confidence * 100).toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${result.prediction === 'REAL' ? 'bg-green-500' : 'bg-red-500'
                    }`}
                  style={{ width: `${result.confidence * 100}%` }}
                />
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg text-left font-semibold text-gray-800 mb-3">Analysis</h3>
              <p className="text-left text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">
                {result.reasoning}
              </p>
            </div>

            <div>
              <h3 className="text-lg text-left font-semibold text-gray-800 mb-3">Key Indicators</h3>
              <div className="space-y-2">
                {result.indicators.map((indicator, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 text-gray-700 bg-gray-50 p-3 rounded-lg"
                  >
                    <span className="text-blue-600 font-bold">•</span>
                    <span>{indicator}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Examples */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Try Example News</h3>
          <div className="space-y-8">
            {exampleNews.map((example, idx) => (
              <button
                key={idx}
                onClick={() => setText(example.text)}
                className="w-full text-left p-4 border-2 border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all"
              >
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-2 ${example.type === 'fake' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                  }`}>
                  Example : {example.type.toUpperCase()} News
                </span>
                <p className="text-gray-700 text-sm">{example.text}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-10 text-center text-sm text-gray-500">
          <p>⚠️ This is an AI-powered analysis tool. Always verify news from multiple credible sources.</p>
        </div>
      </div>
    </div>
  );
}
export default App
