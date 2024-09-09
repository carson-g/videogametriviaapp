import React from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity } from 'react-native';

const HomePage = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Video Game Trivia!</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>How the Game Works</Text>
        <Text style={styles.sectionDescription}>
          Test your knowledge with my trivia game! 
          Pick which game you think has the higher ranking! If you're right,
          you'll add to your score. If you're wrong, it's Game Over!
          Compete with friends or challenge yourself to beat your own high score!
        </Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Leaderboard</Text>
        <Text style={styles.sectionDescription}>
          Check out the leaderboard to see the top scores and find out who the best trivia players are!
        </Text>
        <Text style={styles.sectionDescription}>
          Use the navigation bar below to explore the app!
        </Text>
      </View>
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  sectionDescription: {
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    marginVertical: 10,
    padding: 12,
    backgroundColor: '#007bff',
    borderRadius: 5,
    alignItems: 'center',
    width: '80%',
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default HomePage;
