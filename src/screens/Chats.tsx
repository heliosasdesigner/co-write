import React, { useState, useEffect, useRef } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import {
  View,
  Text,
  Button,
  Alert,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  FlatList,
  TextInput,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import type { ChatsFlowParamList } from '../navigation/ChatsFlowStack';
import { chatWithLLM } from '../../LLMs/config';
import {
  query,
  orderBy,
  collection,
  onSnapshot,
  addDoc,
} from 'firebase/firestore';
import { db, auth } from '../../firebase/config';
import PageLayout from '../components/PageLayout';

type ChatScreenRouteProp = RouteProp<ChatsFlowParamList, 'ChatConversation'>;

export default function Chats() {
  const route = useRoute<ChatScreenRouteProp>();
  const {
    topic = 'Untitled',
    aiAssistant = false,
    wordLimit = '100',
    numberOfPages = '6',
  } = route.params || {};

  const [messages, setMessages] = useState<any[]>([]);
  const [composerText, setComposerText] = useState('');
  const [input, setInput] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [hintText, setHintText] = useState('');
  const [loadingHint, setLoadingHint] = useState(false);
  const flatListRef = useRef(null);

  const storySettings = {
    _id: 1,
    text:
      `Welcome to a story about "${topic}".\n` +
      `AI: ${aiAssistant}\n` +
      `Word Limit: ${wordLimit}\n` +
      `Pages: ${numberOfPages}`,
    createdAt: new Date(),
    user: { _id: 'System' },
  };

  useEffect(() => {
    const collectionRef = collection(db, 'chats');
    const q = query(collectionRef, orderBy('createdAt', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedMessages = snapshot.docs
        .map((doc) => {
          const data = doc.data();

          if (!data.text || !data.user || !data.createdAt) {
            console.warn('Invalid message skipped:', doc.id, data);
            return null;
          }

          return {
            _id: doc.id,
            text: data.text,
            createdAt: data.createdAt?.toDate?.() || new Date(),
            user: data.user,
          };
        })
        .filter(Boolean);
      const messagesWithSettingsAtTop = [storySettings, ...loadedMessages];
      setMessages(messagesWithSettingsAtTop);
    });

    return () => unsubscribe();
  }, []);

  const handleHint = async () => {
    if (!composerText.trim()) {
      setHintText(
        'Please type a bit of your story first, and then I can help you brainstorm!'
      );
      setShowHint(true);
      return;
    }
    setLoadingHint(true);
    try {
      const promptHint =
        `I’m writing a story but I’m stuck for ideas. ` +
        `Here’s my current draft:\n\n${composerText}`;
      const aiResponse = await chatWithLLM(promptHint);
      setHintText(aiResponse);
      setShowHint(true);
    } catch (err: any) {
      Alert.alert('AI Hint Error', err.message);
    } finally {
      setLoadingHint(false);
    }
  };

  const onSend = (newMessages: any[] = []) => {
    const pagesAllowed = parseInt(numberOfPages, 10);
    const userPages = messages.filter((m) => m.user._id === 1).length;
    if (userPages >= pagesAllowed) {
      Alert.alert(
        'Page limit reached',
        `You’ve already used all ${pagesAllowed} pages of the story.`
      );
      return;
    }

    const limitNum = parseInt(wordLimit, 10);
    const incomingText = newMessages[0]?.text?.trim() || '';
    const wordCount = incomingText.split(/\s+/).filter(Boolean).length;
    if (wordCount > limitNum) {
      Alert.alert(
        'Word limit exceeded',
        `Your message is ${wordCount} words; limit is ${limitNum}.`
      );
      return;
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage = {
      _id: Date.now().toString(),
      text: input.trim(),
      createdAt: new Date(),
      user: { _id: auth?.currentUser?.email },
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput('');
    flatListRef.current?.scrollToEnd({ animated: true });
    addDoc(collection(db, 'chats'), newMessage);
  };

  const limitNum = parseInt(wordLimit, 10);
  const wordsUsed = composerText.trim().split(/\s+/).filter(Boolean).length;
  const remaining = Math.max(limitNum - wordsUsed, 0);

  return (
    <View style={(styles.container, { flex: 1 })}>
      {aiAssistant && (
        <View style={styles.hintButtonContainer}>
          {loadingHint ? (
            <ActivityIndicator size="small" />
          ) : (
            <Button
              title={showHint ? 'Hide AI Hint' : 'Get AI Hint'}
              onPress={() => (showHint ? setShowHint(false) : handleHint())}
            />
          )}
        </View>
      )}

      {showHint && (
        <View style={styles.hintBox}>
          <Text style={styles.hintText}>{hintText}</Text>
        </View>
      )}

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={100}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.messageContainer}>
              <Text style={styles.messageAuthor}>
                {item.user._id === auth.currentUser.email
                  ? 'You'
                  : item.user._id}
              </Text>
              <Text style={styles.messageText}>{item.text}</Text>
              <Text style={styles.messageTimestamp}>
                {new Date(item.createdAt).toLocaleString()}
              </Text>
            </View>
          )}
          contentContainerStyle={{ padding: 16 }}
          showsVerticalScrollIndicator={true}
        />

        <View style={styles.inputContainer}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Write your message..."
            style={styles.input}
            multiline
          />
          <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
            <Text style={{ color: '#fff' }}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  hintButtonContainer: {
    padding: 8,
  },
  hintBox: {
    backgroundColor: '#f0f0f0',
    marginHorizontal: 8,
    marginBottom: 8,
    padding: 10,
    borderRadius: 6,
  },
  hintText: {
    color: '#333',
  },
  accessory: {
    paddingHorizontal: 12,
    paddingBottom: 4,
  },
  counter: {
    alignSelf: 'flex-end',
    fontSize: 12,
    color: '#666',
  },
  messageContainer: {
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 12,
  },
  messageAuthor: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
    fontWeight: '600',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    color: '#111',
  },
  messageTimestamp: {
    fontSize: 12,
    color: '#aaa',
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    fontSize: 16,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#f1f1f1',
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginLeft: 8,
  },
});
