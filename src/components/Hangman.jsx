import { useState, useEffect } from 'react';
import { getRandomWord } from '../services/wordService';
import './Hangman.css';

function Hangman() {
  const [gameMode, setGameMode] = useState(null); // 'single' or 'two-player'
  const [word, setWord] = useState('');
  const [guessedLetters, setGuessedLetters] = useState(new Set());
  const [mistakes, setMistakes] = useState(0);
  const [customWord, setCustomWord] = useState('');
  const [isSettingWord, setIsSettingWord] = useState(false);
  const maxMistakes = 6;

  useEffect(() => {
    if (gameMode === 'single') {
      fetchWord();
    }
  }, [gameMode]);

  const fetchWord = async () => {
    const newWord = await getRandomWord();
    setWord(newWord);
  };

  const startTwoPlayerGame = () => {
    if (customWord.trim()) {
      setWord(customWord.toUpperCase());
      setIsSettingWord(false);
    }
  };

  const guessedWord = word
    .split('')
    .map(letter => (guessedLetters.has(letter) ? letter : '_'))
    .join(' ');

  const handleGuess = (letter) => {
    if (!guessedLetters.has(letter)) {
      const newGuessedLetters = new Set([...guessedLetters, letter]);
      setGuessedLetters(newGuessedLetters);
      
      if (!word.includes(letter)) {
        setMistakes(mistakes + 1);
      }
    }
  };

  const resetGame = () => {
    setGameMode(null);
    setWord('');
    setGuessedLetters(new Set());
    setMistakes(0);
    setCustomWord('');
    setIsSettingWord(false);
  };

  const isWinner = !guessedWord.includes('_');
  const isGameOver = mistakes >= maxMistakes;

  const keyboard = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(letter => (
    <button
      key={letter}
      onClick={() => handleGuess(letter)}
      disabled={guessedLetters.has(letter) || isWinner || isGameOver}
    >
      {letter}
    </button>
  ));

  if (!gameMode) {
    return (
      <div className="hangman">
        <h1>Hangman</h1>
        <div className="mode-selection">
          <button onClick={() => setGameMode('single')}>Single Player</button>
          <button onClick={() => {setGameMode('two-player'); setIsSettingWord(true)}}>Two Players</button>
        </div>
      </div>
    );
  }

  if (gameMode === 'two-player' && isSettingWord) {
    return (
      <div className="hangman">
        <h1>Hangman</h1>
        <div className="word-input">
          <input
            type="password"
            value={customWord}
            onChange={(e) => setCustomWord(e.target.value)}
            placeholder="Enter a word..."
          />
          <button onClick={startTwoPlayerGame}>Start Game</button>
        </div>
      </div>
    );
  }

  return (
    <div className="hangman">
      <h1>Hangman</h1>
      <div className="game-status">
        <p>Mistakes: {mistakes} of {maxMistakes}</p>
        <div className="word">{guessedWord}</div>
      </div>
      
      {isWinner && <p className="message">Congratulations! You won!</p>}
      {isGameOver && <p className="message">Game Over! The word was: {word}</p>}
      
      <div className="keyboard">
        {!isWinner && !isGameOver && keyboard}
      </div>

      {(isWinner || isGameOver) && (
        <button className="reset-button" onClick={resetGame}>
          Play Again
        </button>
      )}
    </div>
  );
}

export default Hangman;