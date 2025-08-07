import { Image } from 'expo-image';
import React, { useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function ChatBot() {
  const [messages, setMessages] = useState<{ text: string; sender: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const API_URL = 'https://api.swaram.ai/v1/chat/completions'; // Replace if endpoint differs
  const API_KEY = 'sk_q65n79mf_U8WCPL6VF3ps0dCPufSjTE4N';

  const handleSend = async () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage = { text: input, sender: 'user' };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    setLoading(true);
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gemini-pro', // Or the correct model for Swaram
          messages: [{ role: 'user', content: userMessage.text }],
        }),
      });

      const data = await response.json();
      console.log('API Response:', data);

      const aiText = data?.choices?.[0]?.message?.content || 'Sorry, I could not understand that.';

      const aiResponse = { text: aiText, sender: 'bot' };
      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [...prev, { text: 'Error: Unable to connect to AI service.', sender: 'bot' }]);
    } finally {
      setLoading(false);
    }
  };

  const renderMessage = ({ item }: { item: { text: string; sender: string } }) => (
    <View style={[styles.messageContainer, item.sender === 'user' ? styles.userMsg : styles.botMsg]}>
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* GIF Background */}
      <Image
        source={require('../assets/chatbot.gif')}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
      />

      {/* Overlay for messages */}
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.overlay}>
        <FlatList
          data={messages}
          keyExtractor={(_, index) => index.toString()}
          renderItem={renderMessage}
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingVertical: 20 }}
        />

        {/* Input Box */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Ask me anything..."
            placeholderTextColor="#ccc"
            value={input}
            onChangeText={setInput}
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSend} disabled={loading}>
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>{loading ? '...' : 'Send'}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 10,
  },
  messageContainer: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 12,
    marginVertical: 6,
  },
  userMsg: {
    backgroundColor: '#6a11cb',
    alignSelf: 'flex-end',
  },
  botMsg: {
    backgroundColor: '#2575fc',
    alignSelf: 'flex-start',
  },
  messageText: {
    color: '#fff',
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: '#6a11cb',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    marginLeft: 10,
  },
});
