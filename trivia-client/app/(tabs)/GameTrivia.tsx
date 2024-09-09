import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert, ActivityIndicator, TextInput } from 'react-native';
import { firebase } from '../../config'

const fetchGames = async () => {
  try {
    const response = await fetch(
      "https://games-duqziddcsa-uc.a.run.app",
      { method: 'GET' }
    );
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
  const [games, setGames] = useState([]);
  const [selectedGames, setSelectedGames] = useState<{ id: any; aggregated_rating: any; name?: string; }[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const initializeGame = async () => {
    setLoading(true);
    const fetchedGames = await fetchGames();
    setGames(fetchedGames);
    if (fetchedGames.length > 1) {
      setSelectedGames(getRandomGames(fetchedGames));
    }
    setLoading(false);
  };

  useEffect(() => {
    initializeGame();
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
          placeholder="Enter your name"
          value={name}
          onChangeText={setName}
        />
        <Button
          title={submitting ? "Submitting..." : "Submit Score"}
          onPress={submitScore}
          disabled={submitting}
        />
        <Button title="Restart" onPress={restartGame} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.scoreText}>Score: {score}</Text>
      {selectedGames.map(game => (
        <Button
          key={game.id}
          title={game.name as string}
          onPress={() => handleSelection(game)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 24,
    marginBottom: 20,
  },
  gameOverText: {
    fontSize: 32,
    color: 'red',
    marginBottom: 20,
  },
});

export default GameTrivia;
