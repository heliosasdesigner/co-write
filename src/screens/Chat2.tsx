import { View, Text, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native'
import { collection, query, orderBy, where, onSnapshot, addDoc, setDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { db, auth } from '../../firebase/config'
import { onAuthStateChanged } from 'firebase/auth'
import React, { useEffect, useState, useRef } from 'react'

const ChatScreen = ({route}) => {
    const {chatId} = route.params
    const [messages, setMessages] = useState([])
    const [input, setInput] = useState('')
    const flatListRef = useRef(null)

    const user = auth.currentUser
    const [chats, setChats] = useState([])

    useEffect(() => {
        const messagesRef = collection(db, 'chats', chatId, 'messages')
        const q = query(messagesRef, orderBy('timestamp', 'asc'))
        
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }))
            setMessages(data)
        })

            return () => unsubscribe()
        }, [chatId])
    
    const handleSend = async() => {
        if(!input.trim()) return

        const messagesRef = collection(db, 'chats', chatId, 'messages')
        await addDoc(messagesRef, {
            senderId: updateCurrentUser.uid,
            text: input.trim(),
            timestamp: serverTimestamp(),
        })

        setInput('')
        flatListRef.current?.scrollToEnd({animated:true})
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={80}
        >
            <FlatList
                data={messages}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                <View
                    style={[
                    styles.messageBubble,
                    item.senderId === currentUser.uid
                        ? styles.myMessage
                        : styles.theirMessage
                    ]}
                >
                    <Text style={styles.messageText}>{item.text}</Text>
                </View>
                )}
                ref={flatListRef}
                contentContainerStyle={{ paddingVertical: 12 }}
                onContentSizeChange={() =>
                flatListRef.current?.scrollToEnd({ animated: true })
                }
            />

            <View style={styles.inputContainer}>
                <TextInput
                    placeholder="Type a message..."
                    value={input}
                    onChangeText={setInput}
                    style={styles.input}
                />
                <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
                    <Text style={styles.sendText}>Send</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    )
}

export default ChatScreen



const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    inputContainer: {
      flexDirection: 'row',
      padding: 10,
      borderTopColor: '#ddd',
      borderTopWidth: 1,
      backgroundColor: '#f9f9f9',
    },
    input: {
      flex: 1,
      backgroundColor: '#fff',
      paddingHorizontal: 10,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: '#ccc',
      height: 40,
    },
    sendButton: {
      marginLeft: 10,
      backgroundColor: '#007bff',
      borderRadius: 20,
      paddingHorizontal: 15,
      justifyContent: 'center',
    },
    sendText: {
      color: 'white',
      fontWeight: 'bold',
    },
    messageBubble: {
      marginHorizontal: 10,
      marginVertical: 5,
      padding: 10,
      maxWidth: '70%',
      borderRadius: 10,
    },
    myMessage: {
      backgroundColor: '#dcf8c6',
      alignSelf: 'flex-end',
    },
    theirMessage: {
      backgroundColor: '#eee',
      alignSelf: 'flex-start',
    },
    messageText: {
      fontSize: 16,
    },
  })