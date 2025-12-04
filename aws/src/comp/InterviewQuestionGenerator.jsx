import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, CheckCircle2, AlertCircle, ChevronDown, Moon, Sun, Home, ArrowRight } from 'lucide-react';

export default function InterviewQuestionGenerator() {
  const [page, setPage] = useState('home');
  const [darkMode, setDarkMode] = useState(true);
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    count: 5
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [expandedQuestion, setExpandedQuestion] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPage('loading');
    setError(null);
    setResult(null);

    try {
      const response = await fetch('https://9pi5rnxj92.execute-api.us-east-1.amazonaws.com/dev/interview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (data.ok) {
        setResult(data.data);
        setTimeout(() => setPage('results'), 1500);
      } else {
        setError('Failed to generate questions. Please try again.');
        setPage('home');
      }
    } catch (err) {
      setError('An error occurred. Please check your connection and try again.');
      setPage('home');
    }
  };

  const resetApp = () => {
    setPage('home');
    setResult(null);
    setError(null);
    setExpandedQuestion(null);
  };

  const getDifficultyColor = (difficulty) => {
    if (darkMode) {
      switch (difficulty) {
        case 'easy':
          return 'bg-green-900/50 text-green-300 border-green-700';
        case 'medium':
          return 'bg-yellow-900/50 text-yellow-300 border-yellow-700';
        case 'hard':
          return 'bg-red-900/50 text-red-300 border-red-700';
        default:
          return 'bg-gray-800 text-gray-300 border-gray-700';
      }
    } else {
      switch (difficulty) {
        case 'easy':
          return 'bg-green-100 text-green-800 border-green-200';
        case 'medium':
          return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case 'hard':
          return 'bg-red-100 text-red-800 border-red-200';
        default:
          return 'bg-gray-100 text-gray-800 border-gray-200';
      }
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-950' 
        : 'bg-gradient-to-br from-indigo-50 via-white to-purple-50'
    }`}>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setDarkMode(!darkMode)}
        className={`fixed top-6 right-6 z-50 p-3 rounded-full shadow-lg transition-colors ${
          darkMode ? 'bg-indigo-600 text-yellow-300' : 'bg-white text-indigo-600'
        }`}
      >
        {darkMode ? <Sun size={24} /> : <Moon size={24} />}
      </motion.button>

      <AnimatePresence mode="wait">
        {page === 'home' && (
          <HomePage
            formData={formData}
            setFormData={setFormData}
            handleSubmit={handleSubmit}
            error={error}
            darkMode={darkMode}
          />
        )}

        {page === 'loading' && (
          <LoadingPage darkMode={darkMode} />
        )}

        {page === 'results' && (
          <ResultsPage
            result={result}
            expandedQuestion={expandedQuestion}
            setExpandedQuestion={setExpandedQuestion}
            getDifficultyColor={getDifficultyColor}
            resetApp={resetApp}
            darkMode={darkMode}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function HomePage({ formData, setFormData, handleSubmit, error, darkMode }) {
  return (
    <motion.div
      key="home"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-4xl mx-auto px-4 py-12 min-h-screen flex flex-col justify-center"
    >
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center mb-12"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          className={`inline-block p-4 rounded-full mb-6 ${
            darkMode ? 'bg-indigo-900/50' : 'bg-indigo-100'
          }`}
        >
          <Search size={48} className={darkMode ? 'text-indigo-400' : 'text-indigo-600'} />
        </motion.div>
        
        <h1 className={`text-6xl font-bold mb-4 ${
          darkMode ? 'text-white' : 'bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent'
        }`}>
          Interview Prep AI
        </h1>
        <p className={`text-xl ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Generate tailored interview questions powered by AI
        </p>
      </motion.div>

      <motion.form
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        onSubmit={handleSubmit}
        className={`rounded-3xl shadow-2xl p-8 ${
          darkMode 
            ? 'bg-gray-900/50 backdrop-blur-xl border border-gray-800' 
            : 'bg-white'
        }`}
      >
        <div className="space-y-6 mb-8">
          <div>
            <label className={`block text-sm font-semibold mb-3 ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              🏢 Target Company
            </label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className={`w-full px-5 py-4 rounded-xl focus:outline-none transition-all text-lg ${
                darkMode 
                  ? 'bg-gray-800 border-2 border-gray-700 text-white focus:border-indigo-500' 
                  : 'border-2 border-gray-200 focus:border-indigo-500'
              }`}
              placeholder="e.g., Google, Microsoft, Amazon"
              required
            />
          </div>

          <div>
            <label className={`block text-sm font-semibold mb-3 ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              💼 Job Role
            </label>
            <input
              type="text"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className={`w-full px-5 py-4 rounded-xl focus:outline-none transition-all text-lg ${
                darkMode 
                  ? 'bg-gray-800 border-2 border-gray-700 text-white focus:border-indigo-500' 
                  : 'border-2 border-gray-200 focus:border-indigo-500'
              }`}
              placeholder="e.g., SDE Intern, Full Stack Developer"
              required
            />
          </div>

          <div>
            <label className={`block text-sm font-semibold mb-3 ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              🔢 Number of Questions
            </label>
            <input
              type="number"
              value={formData.count}
              onChange={(e) => setFormData({ ...formData, count: parseInt(e.target.value) })}
              className={`w-full px-5 py-4 rounded-xl focus:outline-none transition-all text-lg ${
                darkMode 
                  ? 'bg-gray-800 border-2 border-gray-700 text-white focus:border-indigo-500' 
                  : 'border-2 border-gray-200 focus:border-indigo-500'
              }`}
              min="1"
              max="20"
              required
            />
          </div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-xl p-4 mb-6 flex items-center gap-3 ${
              darkMode 
                ? 'bg-red-900/30 border-2 border-red-800' 
                : 'bg-red-50 border-2 border-red-200'
            }`}
          >
            <AlertCircle className="text-red-500" size={24} />
            <p className={darkMode ? 'text-red-300' : 'text-red-800'}>{error}</p>
          </motion.div>
        )}

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-5 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-shadow flex items-center justify-center gap-3"
        >
          Generate Questions
          <ArrowRight size={20} />
        </motion.button>
      </motion.form>
    </motion.div>
  );
}

function LoadingPage({ darkMode }) {
  return (
    <motion.div
      key="loading"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col items-center justify-center px-4"
    >
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className={`w-24 h-24 rounded-2xl mb-8 ${
          darkMode 
            ? 'bg-gradient-to-br from-indigo-500 to-purple-500' 
            : 'bg-gradient-to-br from-indigo-400 to-purple-400'
        }`}
      />
      
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`text-3xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}
      >
        Generating Questions...
      </motion.h2>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}
      >
        AI is crafting personalized questions for you
      </motion.p>

      <div className="flex gap-2 mt-8">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -20, 0],
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.2,
            }}
            className={`w-3 h-3 rounded-full ${
              darkMode ? 'bg-indigo-400' : 'bg-indigo-600'
            }`}
          />
        ))}
      </div>
    </motion.div>
  );
}

function ResultsPage({ result, expandedQuestion, setExpandedQuestion, getDifficultyColor, resetApp, darkMode }) {
  if (!result || !result.metadata || !result.questions) {
    return (
      <motion.div
        key="results"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen flex items-center justify-center"
      >
        <div className={`text-center ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          <p className="text-xl">No results to display</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      key="results"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-6xl mx-auto px-4 py-12"
    >
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={resetApp}
        className={`mb-8 flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
          darkMode 
            ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
            : 'bg-white text-gray-700 hover:bg-gray-100'
        }`}
      >
        <Home size={20} />
        New Search
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-3xl shadow-xl p-8 mb-8 ${
          darkMode 
            ? 'bg-gradient-to-r from-indigo-900/80 to-purple-900/80 backdrop-blur-xl border border-indigo-800' 
            : 'bg-gradient-to-r from-indigo-600 to-purple-600'
        }`}
      >
        <div className="flex items-center gap-3 mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <CheckCircle2 size={32} className="text-white" />
          </motion.div>
          <h2 className="text-3xl font-bold text-white">Questions Generated!</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/10 backdrop-blur rounded-xl p-5">
            <p className="text-sm text-white/70 mb-2">Company</p>
            <p className="text-2xl font-bold text-white">{result.metadata.company}</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl p-5">
            <p className="text-sm text-white/70 mb-2">Role</p>
            <p className="text-2xl font-bold text-white">{result.metadata.role}</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl p-5">
            <p className="text-sm text-white/70 mb-2">Questions</p>
            <p className="text-2xl font-bold text-white">{result.metadata.count}</p>
          </div>
        </div>
      </motion.div>

      <div className="space-y-5">
        {result.questions && result.questions.length > 0 ? (
          result.questions.map((question, index) => (
            <motion.div
              key={question.id}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`rounded-2xl shadow-xl overflow-hidden ${
                darkMode 
                  ? 'bg-gray-900/50 backdrop-blur-xl border border-gray-800' 
                  : 'bg-white'
              }`}
            >
              <div
                className={`p-6 cursor-pointer transition-colors ${
                  darkMode ? 'hover:bg-gray-800/50' : 'hover:bg-gray-50'
                }`}
                onClick={() => setExpandedQuestion(expandedQuestion === question.id ? null : question.id)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3 flex-wrap">
                      <span className={`font-bold px-4 py-2 rounded-full text-sm ${
                        darkMode 
                          ? 'bg-indigo-900/50 text-indigo-300' 
                          : 'bg-indigo-100 text-indigo-800'
                      }`}>
                        Question {question.id}
                      </span>
                      <span className={`px-4 py-2 rounded-full text-xs font-semibold border ${getDifficultyColor(question.difficulty)}`}>
                        {question.difficulty.toUpperCase()}
                      </span>
                    </div>
                    <h3 className={`text-xl font-bold mb-2 ${
                      darkMode ? 'text-white' : 'text-gray-800'
                    }`}>
                      {question.text}
                    </h3>
                  </div>
                  <motion.div
                    animate={{ rotate: expandedQuestion === question.id ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className={darkMode ? 'text-gray-500' : 'text-gray-400'} size={24} />
                  </motion.div>
                </div>
              </div>

              <AnimatePresence>
                {expandedQuestion === question.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className={darkMode ? 'border-t border-gray-800' : 'border-t border-gray-100'}
                  >
                    <div className={`p-6 space-y-5 ${
                      darkMode ? 'bg-gray-800/30' : 'bg-gray-50'
                    }`}>
                      <div>
                        <h4 className={`text-sm font-bold mb-3 uppercase tracking-wide ${
                          darkMode ? 'text-gray-400' : 'text-gray-700'
                        }`}>
                          ✓ Ideal Answer
                        </h4>
                        <p className={`leading-relaxed p-4 rounded-xl ${
                          darkMode 
                            ? 'bg-gray-900/50 text-gray-300' 
                            : 'bg-white text-gray-700'
                        }`}>
                          {question.ideal_answer}
                        </p>
                      </div>

                      <div>
                        <h4 className={`text-sm font-bold mb-3 uppercase tracking-wide ${
                          darkMode ? 'text-gray-400' : 'text-gray-700'
                        }`}>
                          📖 Explanation
                        </h4>
                        <p className={`leading-relaxed p-4 rounded-xl ${
                          darkMode 
                            ? 'bg-gray-900/50 text-gray-300' 
                            : 'bg-white text-gray-700'
                        }`}>
                          {question.explanation}
                        </p>
                      </div>

                      {question.follow_ups && question.follow_ups.length > 0 && (
                        <div>
                          <h4 className={`text-sm font-bold mb-3 uppercase tracking-wide ${
                            darkMode ? 'text-gray-400' : 'text-gray-700'
                          }`}>
                            💡 Follow-up Questions
                          </h4>
                          <ul className="space-y-3">
                            {question.follow_ups.map((followUp, idx) => (
                              <li
                                key={idx}
                                className={`p-4 rounded-xl flex items-start gap-3 ${
                                  darkMode 
                                    ? 'bg-gray-900/50 text-gray-300' 
                                    : 'bg-white text-gray-700'
                                }`}
                              >
                                <span className="text-indigo-500 font-bold text-lg">→</span>
                                <span>{followUp}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))
        ) : (
          <div className={`text-center p-8 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            <p>No questions available</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}