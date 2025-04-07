import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import {
  Modal, View, Text, TouchableOpacity,
  TextInput, StyleSheet, ScrollView, ActivityIndicator
} from 'react-native';
import Config from 'react-native-config';

// Add forwardRef to accept a ref from parent component
const ChatbotOverlay = forwardRef(({ visible, onClose }, ref) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Get API Key from environment variables or set directly (not recommended for production)
  const GEMINI_API_KEY = Config.API_KEY;
  
  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    setError('');

    try {
      // Format messages for Gemini API
      const formattedMessages = newMessages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }));

      // Make request to Gemini API
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: formattedMessages,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 800,
          }
        }),
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message || 'API returned an error');
      }

      // Extract the response text
      let reply = '';
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        reply = data.candidates[0].content.parts[0].text || '';
      } else {
        throw new Error('Unexpected API response format');
      }

      setMessages([...newMessages, { role: 'assistant', content: reply }]);
    } catch (err) {
      console.error('Chatbot error:', err);
      setError(err.message || 'Failed to get response');
      setMessages([...newMessages, { 
        role: 'assistant', 
        content: `Sorry, I encountered an error: ${err.message || 'Unknown error'}` 
      }]);
    } finally {
      setLoading(false);
    }
  };

  // You can add context about the course here
  const addCourseContext = async (courseContent) => {
    // This function would be called externally to provide course context
    // For example, when loading a specific course section
    if (!courseContent) return;
    
    setMessages([
      { role: 'system', content: `You are an educational assistant for EduX. Here is the course content to reference: ${courseContent}` },    
      { role: 'assistant', content: "Hi there! I'm your EduX learning assistant. I have information about your current course. What questions can I help you with?" }
    ]);
  };

  // Correctly expose functions to parent component via ref
  useImperativeHandle(ref, () => ({
    addCourseContext
  }));

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.overlayContainer}>
        <View style={styles.chatbotContainer}>
          <View style={styles.header}>
            <Text style={styles.headerText}>EduX Assistant</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeText}>X</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            {messages.length === 0 ? (
              <Text style={{ color: '#aaa', textAlign: 'center', marginTop: 20 }}>
                Hi! I am your EduX learning assistant. How can I help you today?
              </Text>
            ) : (
              messages.filter(msg => msg.role !== 'system').map((msg, i) => (
                <View key={i} style={[styles.messageBubble, 
                  msg.role === 'user' ? styles.userBubble : styles.botBubble]}>
                  <Text style={styles.messageText}>
                    {msg.content}
                  </Text>
                </View>
              ))
            )}
            {loading && <ActivityIndicator color="#fff" style={{ marginVertical: 10 }} />}
          </ScrollView>

          <View style={styles.inputContainer}>
            <TextInput
              value={input}
              onChangeText={setInput}
              style={styles.input}
              placeholder="Ask about your course..."
              placeholderTextColor="#999"
              onSubmitEditing={sendMessage}
            />
            <TouchableOpacity onPress={sendMessage} style={styles.sendButton} disabled={loading}>
              <Text style={styles.sendText}>{loading ? '...' : 'Send'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
});

export default ChatbotOverlay;

const styles = StyleSheet.create({
  overlayContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  chatbotContainer: {
    height: '70%',
    backgroundColor: '#0E0325',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
    paddingBottom: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#7E57C2', // Purple theme for education
    padding: 12,
  },
  headerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: { padding: 5 },
  closeText: { color: '#fff', fontSize: 20 },
  content: {
    flex: 1,
    padding: 15,
  },
  messageBubble: {
    borderRadius: 18,
    padding: 12,
    marginVertical: 5,
    maxWidth: '80%',
  },
  userBubble: {
    backgroundColor: '#673AB7', // Darker purple for user
    alignSelf: 'flex-end',
  },
  botBubble: {
    backgroundColor: '#222',
    alignSelf: 'flex-start',
  },
  messageText: {
    color: '#fff',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopColor: '#222',
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    color: '#fff',
    borderColor: '#555',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    marginRight: 10,
    paddingVertical: 8,
  },
  sendButton: {
    backgroundColor: '#7E57C2',
    paddingHorizontal: 20,
    borderRadius: 20,
    justifyContent: 'center',
  },
  sendText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});