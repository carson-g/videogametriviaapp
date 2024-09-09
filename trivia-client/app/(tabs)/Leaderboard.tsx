import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button, TouchableOpacity } from 'react-native';
import { firebase } from '../../config';

interface Score {
  id: string;
  name: string;
  score: string;
}

const Leaderboard = () => {
  const [scores, setScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchScores = async () => {
    setLoading(true);
    try {
      const leaderboardRef = firebase.firestore().collection('leaderboard');
      const snapshot = await leaderboardRef.orderBy('score', 'desc').limit(10).get();
      const scoresList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<Score, 'id'>),
      }));
      setScores(scoresList as Score[]);
    } catch (error) {
      console.error('Error fetching leaderboard scores: ', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScores();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Leaderboard</Text>
      <View style={styles.headerRow}>
        <Text style={[styles.headerItem, styles.rankHeader]}>Rank</Text>
        <Text style={[styles.headerItem, styles.nameHeader]}>Name</Text>
        <Text style={[styles.headerItem, styles.scoreHeader]}>Score</Text>
      </View>
      <FlatList
        data={scores}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <View style={styles.scoreItem}>
            <Text style={styles.rank}>{index + 1}</Text>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.score}>{item.score}</Text>
          </View>
        )}
      />
      <TouchableOpacity
        style={styles.refreshButton}
        onPress={fetchScores}
        disabled={loading}
      >
        <Text style={styles.refreshButtonText}>
          {loading ? 'Refreshing...' : 'Refresh'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 2,
    borderBottomColor: '#000',
    backgroundColor: '#f0f0f0',
  },
  headerItem: {
    fontSize: 18,
    fontWeight: 'bold',
    width: '33%',
    textAlign: 'center',
  },
  rankHeader: {
    flex: 1,
  },
  nameHeader: {
    flex: 1,
  },
  scoreHeader: {
    flex: 1,
  },
  scoreItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  rank: {
    fontSize: 18,
    fontWeight: 'bold',
    width: '33%',
    textAlign: 'center',
  },
  name: {
    fontSize: 18,
    width: '34%',
    textAlign: 'center',
  },
  score: {
    fontSize: 18,
    fontWeight: 'bold',
    width: '33%',
    textAlign: 'center',
  },
  refreshButton: {
    marginTop: 16,
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
    alignItems: 'center',
  },
  refreshButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Leaderboard;
