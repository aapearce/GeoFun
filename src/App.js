import React, { useState, useEffect } from 'react';
import './App.css';
import { countriesData } from './countriesData';

function App() {
  const [gameState, setGameState] = useState('menu'); // menu, regionSelect, quiz, results
  const [selectedQuizType, setSelectedQuizType] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [timer, setTimer] = useState(30);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [timeBonus, setTimeBonus] = useState(0);

  const quizTypes = [
    {
      id: 'flags',
      title: 'Identify Flags',
      description: 'Match flags to their countries',
      icon: '🚩'
    },
    {
      id: 'capitals',
      title: 'Capital Cities',
      description: 'Name the capital of each country',
      icon: '🏛️'
    },
    {
      id: 'landmarks',
      title: 'Famous Landmarks',
      description: 'Match landmarks to countries',
      icon: '🗼'
    },
    {
      id: 'neighbors',
      title: 'Neighboring Countries',
      description: 'Identify which countries border each other',
      icon: '🗺️'
    },
    {
      id: 'currencies',
      title: 'World Currencies',
      description: 'Match currencies to their countries',
      icon: '💰'
    },
    {
      id: 'population',
      title: 'Population Quiz',
      description: 'Order countries by population',
      icon: '👥'
    }
  ];

  const regions = [
    { id: 'all', name: 'All Regions' },
    { id: 'Europe', name: 'Europe' },
    { id: 'Asia', name: 'Asia' },
    { id: 'Africa', name: 'Africa' },
    { id: 'North America', name: 'North America' },
    { id: 'South America', name: 'South America' },
    { id: 'Oceania', name: 'Oceania' }
  ];

  // Timer effect
  useEffect(() => {
    if (gameState === 'quiz' && !showFeedback && timer > 0) {
      const interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (timer === 0 && gameState === 'quiz' && !showFeedback) {
      handleAnswer(null, true);
    }
  }, [gameState, timer, showFeedback]);

// Clear focus when question changes
useEffect(() => {
  if (document.activeElement) {
    document.activeElement.blur();
  }
}, [currentQuestion]);

  const handleQuizTypeSelect = (quizType) => {
    setSelectedQuizType(quizType);
    setGameState('regionSelect');
  };

  const handleRegionSelect = (region) => {
    setSelectedRegion(region);
  };

  const startQuiz = () => {
    const filteredCountries = selectedRegion === 'all' 
      ? countriesData 
      : countriesData.filter(c => c.continent === selectedRegion);

    const generatedQuestions = generateQuestions(selectedQuizType, filteredCountries, 10);
    setQuestions(generatedQuestions);
    setCurrentQuestion(0);
    setScore(0);
    setCorrectAnswers(0);
    setTimeBonus(0);
    setGameState('quiz');
    setTimer(30);
  };

  const generateQuestions = (quizType, countries, count) => {
    const shuffled = [...countries].sort(() => Math.random() - 0.5);
    const selectedCountries = shuffled.slice(0, Math.min(count, countries.length));
    
    return selectedCountries.map(country => {
      switch(quizType) {
        case 'flags':
          return generateFlagQuestion(country, countries);
        case 'capitals':
          return generateCapitalQuestion(country, countries);
        case 'landmarks':
          return generateLandmarkQuestion(country, countries);
        case 'neighbors':
          return generateNeighborQuestion(country, countries);
        case 'currencies':
          return generateCurrencyQuestion(country, countries);
        case 'population':
          return generatePopulationQuestion(country, countries);
        default:
          return generateFlagQuestion(country, countries);
      }
    });
  };

  const generateFlagQuestion = (country, allCountries) => {
    const options = getRandomOptions(country, allCountries, 3);
    return {
      type: 'flags',
      question: 'Which country does this flag belong to?',
      flag: country.flag,
      correctAnswer: country.name,
      options: shuffleArray([country.name, ...options.map(c => c.name)])
    };
  };

  const generateCapitalQuestion = (country, allCountries) => {
    const options = getRandomOptions(country, allCountries, 3);
    return {
      type: 'capitals',
      question: `What is the capital of ${country.name}?`,
      correctAnswer: country.capital,
      options: shuffleArray([country.capital, ...options.map(c => c.capital)])
    };
  };

  const generateLandmarkQuestion = (country, allCountries) => {
    const landmark = country.landmarks[Math.floor(Math.random() * country.landmarks.length)];
    const options = getRandomOptions(country, allCountries, 3);
    return {
      type: 'landmarks',
      question: `Which country is ${landmark} located in?`,
      correctAnswer: country.name,
      options: shuffleArray([country.name, ...options.map(c => c.name)])
    };
  };

  const generateNeighborQuestion = (country, allCountries) => {
    if (country.neighbors.length === 0) {
      return {
        type: 'neighbors',
        question: `Does ${country.name} have any neighboring countries?`,
        correctAnswer: 'No, it is an island nation',
        options: shuffleArray(['No, it is an island nation', 'Yes, it has neighbors', 'It is landlocked', 'It shares one border'])
      };
    }
    
    const neighbor = country.neighbors[Math.floor(Math.random() * country.neighbors.length)];
    const wrongCountries = allCountries
      .filter(c => c.name !== country.name && !country.neighbors.includes(c.name))
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(c => c.name);
    
    return {
      type: 'neighbors',
      question: `Which of these countries borders ${country.name}?`,
      correctAnswer: neighbor,
      options: shuffleArray([neighbor, ...wrongCountries])
    };
  };

  const generateCurrencyQuestion = (country, allCountries) => {
    const options = getRandomOptions(country, allCountries, 3);
    return {
      type: 'currencies',
      question: `What currency is used in ${country.name}?`,
      correctAnswer: country.currency,
      options: shuffleArray([country.currency, ...options.map(c => c.currency)])
    };
  };

  const generatePopulationQuestion = (country, allCountries) => {
    const closePopulation = allCountries
      .filter(c => c.name !== country.name)
      .sort((a, b) => Math.abs(a.population - country.population) - Math.abs(b.population - country.population))
      .slice(0, 3);
    
    return {
      type: 'population',
      question: `Which country has a larger population?`,
      correctAnswer: country.name,
      options: shuffleArray([country.name, ...closePopulation.map(c => c.name)]),
      populations: {
        [country.name]: country.population,
        ...Object.fromEntries(closePopulation.map(c => [c.name, c.population]))
      }
    };
  };

  const getRandomOptions = (correctCountry, allCountries, count) => {
    return allCountries
      .filter(c => c.name !== correctCountry.name)
      .sort(() => Math.random() - 0.5)
      .slice(0, count);
  };

  const shuffleArray = (array) => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  const handleAnswer = (answer, timeout = false) => {
    setSelectedAnswer(answer);
    setShowFeedback(true);

    const currentQ = questions[currentQuestion];
    const isCorrect = !timeout && answer === currentQ.correctAnswer;
    
    if (isCorrect) {
      const bonus = Math.floor(timer * 10);
      setScore(prev => prev + 100 + bonus);
      setCorrectAnswers(prev => prev + 1);
      setTimeBonus(prev => prev + bonus);
    }

  setTimeout(() => {
  // Remove focus from any active button
  if (document.activeElement) {
    document.activeElement.blur();
  }
  
  if (currentQuestion < questions.length - 1) {
    setCurrentQuestion(prev => prev + 1);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setTimer(30);
  } else {
    setGameState('results');
  }
}, 2000);
  
  };

  const restartQuiz = () => {
    setGameState('menu');
    setSelectedQuizType(null);
    setSelectedRegion('all');
    setCurrentQuestion(0);
    setScore(0);
    setQuestions([]);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setCorrectAnswers(0);
    setTimeBonus(0);
  };

  const playAgain = () => {
    startQuiz();
  };

  const renderMenu = () => (
    <div className="menu-screen">
      <h1 className="menu-title">GeoFun! 🌍</h1>
      <p className="menu-subtitle">Test your geography knowledge with fun quizzes!</p>
      
      <div className="quiz-types">
        {quizTypes.map(quiz => (
          <div 
            key={quiz.id}
            className="quiz-card"
            onClick={() => handleQuizTypeSelect(quiz.id)}
          >
            <span className="quiz-icon">{quiz.icon}</span>
            <h3>{quiz.title}</h3>
            <p>{quiz.description}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderRegionSelect = () => (
    <div className="menu-screen">
      <h1 className="menu-title">Choose Your Region</h1>
      
      <div className="region-selector">
        <h3>Select a region to focus on:</h3>
        <div className="region-buttons">
          {regions.map(region => (
            <button
              key={region.id}
              className={`region-btn ${selectedRegion === region.id ? 'selected' : ''}`}
              onClick={() => handleRegionSelect(region.id)}
            >
              {region.name}
            </button>
          ))}
        </div>
      </div>

      <div className="button-group">
        <button className="btn-primary" onClick={startQuiz}>
          Start Quiz! 🚀
        </button>
        <button className="btn-secondary" onClick={() => setGameState('menu')}>
          Back
        </button>
      </div>
    </div>
  );

  const renderQuiz = () => {
    if (!questions.length) return <div className="loading">Loading questions...</div>;
    
    const question = questions[currentQuestion];
    const progress = ((currentQuestion + 1) / questions.length) * 100;

    return (
      <div className="quiz-container">
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${progress}%` }}></div>
        </div>

        <div className="quiz-header">
          <span className="question-number">
            Question {currentQuestion + 1} of {questions.length}
          </span>
          <span className="timer">⏱️ {timer}s</span>
        </div>

        <h2 className="question-text">{question.question}</h2>

        {question.flag && (
          <div className="flag-display">{question.flag}</div>
        )}

        <div className="options-grid">
          {question.options.map((option, index) => {
            let btnClass = 'option-btn';
            if (showFeedback) {
              if (option === question.correctAnswer) {
                btnClass += ' correct';
              } else if (option === selectedAnswer && selectedAnswer !== question.correctAnswer) {
                btnClass += ' incorrect';
              }
            }

            return (
              <button
                key={index}
                className={btnClass}
                onClick={() => handleAnswer(option)}
                disabled={showFeedback}
                onMouseEnter={(e) => e.target.blur()}
                autoFocus={false}
              >
                {option}
              </button>
            );
          })}
        </div>

        {showFeedback && (
          <div className={`feedback ${selectedAnswer === question.correctAnswer ? 'correct' : 'incorrect'}`}>
            {selectedAnswer === question.correctAnswer ? '🎉 Correct! Amazing!' : `❌ Oops! The answer was: ${question.correctAnswer}`}
          </div>
        )}
      </div>
    );
  };

  const renderResults = () => {
    const percentage = (correctAnswers / questions.length) * 100;
    let trophy = '🏆';
    let message = 'Great job!';

    if (percentage === 100) {
      trophy = '🏆';
      message = 'Perfect Score! You\'re a Geography Master!';
    } else if (percentage >= 80) {
      trophy = '🥇';
      message = 'Excellent! You know your geography!';
    } else if (percentage >= 60) {
      trophy = '🥈';
      message = 'Good job! Keep learning!';
    } else if (percentage >= 40) {
      trophy = '🥉';
      message = 'Not bad! Practice makes perfect!';
    } else {
      trophy = '📚';
      message = 'Keep studying! You\'ll improve!';
    }

    return (
      <div className="results-screen">
        <div className="results-trophy">{trophy}</div>
        <h1 className="results-title">{message}</h1>
        <p className="results-score">Final Score: {score} points</p>

        <div className="results-stats">
          <div className="stat-row">
            <span className="stat-label">Correct Answers:</span>
            <span className="stat-value">{correctAnswers} / {questions.length}</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Accuracy:</span>
            <span className="stat-value">{percentage.toFixed(1)}%</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Time Bonus:</span>
            <span className="stat-value">+{timeBonus} points</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Quiz Type:</span>
            <span className="stat-value">{quizTypes.find(q => q.id === selectedQuizType)?.title}</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Region:</span>
            <span className="stat-value">{regions.find(r => r.id === selectedRegion)?.name}</span>
          </div>
        </div>

        <div className="button-group">
          <button className="btn-primary" onClick={playAgain}>
            Play Again 🔄
          </button>
          <button className="btn-secondary" onClick={restartQuiz}>
            Main Menu 🏠
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <h1 className="logo">GeoFun!</h1>
          {gameState === 'quiz' && (
            <div className="score-board">
              <span className="score-text">Score:</span>
              <span className="score-number">{score}</span>
            </div>
          )}
        </div>
      </header>

      <main className="main-content">
        {gameState === 'menu' && renderMenu()}
        {gameState === 'regionSelect' && renderRegionSelect()}
        {gameState === 'quiz' && renderQuiz()}
        {gameState === 'results' && renderResults()}
      </main>
    </div>
  );
}

export default App;
