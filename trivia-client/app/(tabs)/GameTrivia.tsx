import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, StyleSheet, Alert, ActivityIndicator, TextInput, TouchableOpacity } from 'react-native';
import { firebase } from '../../config';


const fetchGames = async () => {
  try {
    const response = await fetch("https://games-duqziddcsa-uc.a.run.app", { method: 'GET' });
    const data = await response.json();
    console.log(data);
    return data;
  } catch (err) {
    console.error(err);
    return [];
  }
};

const getRandomGames = (games: { id: any; aggregated_rating: any; name?: string; }[]) => {
  let game1, game2;
  do {
    game1 = games[Math.floor(Math.random() * games.length)];
    game2 = games[Math.floor(Math.random() * games.length)];
  } while (game1.aggregated_rating === game2.aggregated_rating);
  return [game1, game2];
};

const GameTrivia = () => {
  const Ref = useRef<number | null>(null);
  const [timer, setTimer] = useState(5);
  const [games, setGames] = useState([]);
  const [selectedGames, setSelectedGames] = useState<{ id: any; aggregated_rating: any; name?: string; }[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const startTimer = () => {
    const startTime = Date.now();
    if (Ref.current) clearInterval(Ref.current);
  
    setTimer(5000);
  
    const id = window.setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      const timeLeft = 5000 - elapsedTime;
  
      if (timeLeft <= 0) {
        clearInterval(id);
        setGameOver(true);
        setTimer(0);
      } else {
        setTimer(timeLeft);
      }
    }, 10);
  
    Ref.current = id;
  };
  

  const initializeGame = async () => {
    setLoading(true);
    const fetchedGames = await fetchGames();
    setGames(fetchedGames);
    if (fetchedGames.length > 1) {
      setSelectedGames(getRandomGames(fetchedGames));
    }
    setLoading(false);
    startTimer();
  };

  useEffect(() => {
    initializeGame();
    startTimer();
  }, []);

  const handleSelection = (selectedGame: { id: any; aggregated_rating: any; name?: string; }) => {
    const otherGame = selectedGames.find(game => game.id !== selectedGame.id);

    if (!otherGame) {
      Alert.alert('Error', 'Could not find the other game. Please try again.');
      return;
    }

    if (selectedGame.aggregated_rating > otherGame.aggregated_rating) {
      setScore(score + 1);
      setSelectedGames(getRandomGames(games));
      startTimer();
    } else {
      setGameOver(true);
    }
  };

  const restartGame = async () => {
    await initializeGame();
    setScore(0);
    setGameOver(false);
  };

  const submitScore = async () => {
    if (name.trim() === '') {
      Alert.alert('Error', 'Please enter your name.');
      return;
    }

    setSubmitting(true);
    try {
      await firebase.firestore().collection('leaderboard').add({
        name,
        score,
      });
      Alert.alert('Success', 'Score submitted!');
      setName('');
      restartGame();
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to submit score. Please try again.');
    }
    setSubmitting(false);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (gameOver) {
    return (
      <View style={styles.container}>
        <Text style={styles.gameOverText}>Game Over</Text>
        <Text style={styles.scoreText}>Your Score: {score}</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Enter your name"
          value={name}
          onChangeText={setName}
        />
        <TouchableOpacity
          style={[styles.button, styles.submitButton]}
          onPress={submitScore}
          disabled={submitting}
        >
          <Text style={styles.buttonText}>{submitting ? "Submitting..." : "Submit Score"}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.restartButton]}
          onPress={restartGame}
        >
          <Text style={styles.buttonText}>Restart</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.scoreText}>{(timer / 1000).toFixed(2)}s</Text>
      <Text style={styles.scoreText}>Score: {score}</Text>
      <Text style={styles.scoreText}>Which game has the higher rating?</Text>
      {selectedGames.map(game => (
        <TouchableOpacity
          key={game.id}
          style={styles.button}
          onPress={() => handleSelection(game)}
        >
          <Text style={styles.buttonText}>{game.name as string}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  scoreText: {
    fontSize: 24,
    marginBottom: 20,
    color: '#333',
  },
  gameOverText: {
    fontSize: 32,
    color: 'red',
    marginBottom: 20,
  },
  textInput: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    width: '80%',
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginVertical: 10,
    alignItems: 'center',
    width: '80%',
    backgroundColor: '#007bff',
  },
  submitButton: {
    backgroundColor: '#28a745',
  },
  restartButton: {
    backgroundColor: '#dc3545',
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default GameTrivia;
