// ChatbotFAB.jsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const ChatbotFAB = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.fab} onPress={onPress}>
      <Text style={styles.fabText}>Chat</Text>
    </TouchableOpacity>
  );
};

export default ChatbotFAB;

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 20,
    left: 20, // Positioned at bottom left
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    zIndex: 100,
  },
  fabText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
