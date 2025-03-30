const getRandomWord = async () => {
  try {
    const response = await fetch('https://random-word-api.herokuapp.com/word?length=5');
    const [word] = await response.json();
    return word.toUpperCase();
  } catch (error) {
    // Fallback words in case API fails
    const fallbackWords = ['REACT', 'VITE', 'GAME', 'CODE', 'PLAY'];
    return fallbackWords[Math.floor(Math.random() * fallbackWords.length)];
  }
};

export { getRandomWord };