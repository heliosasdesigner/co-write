import React, {useState} from 'react'
import {Modal, View, Text, TextInput, StyleSheet, TouchableOpacity,} from 'react-native'

type Props = {
    visible: boolean;
    onClose: () => void;
    onCreateChat: (
        otherUserId: string,
        topic: string,
        wordLimit: number,
    ) => void;
}

const NewChatModal: React.FC<Props> = ({visible, onClose, onCreateChat}) => {
    const [otherUserId, setOtherUserId] = useState('')
    const [topic, setTopic] = useState('')
    const [wordLimit, setWordLimit] = useState('')

    const handleCreate = () => {
        const limit = parseInt(wordLimit)
        if(!otherUserId || !topic || isNaN(limit) || limit <1) return
        onCreateChat(otherUserId.trim(), topic.trim(), limit)
        setOtherUserId('')
        setTopic('')
        setWordLimit('')
        onClose()
    }

    return (
        <Modal visible={visible} animationType="slide" transparent>
        <View style={styles.overlay}>
            <View style={styles.modal}>
            <Text style={styles.title}>New Chat</Text>
            <TextInput
                placeholder="Other User ID"
                value={otherUserId}
                onChangeText={setOtherUserId}
                style={styles.input}
            />
            <TextInput
                placeholder="Chat Topic"
                value={topic}
                onChangeText={setTopic}
                style={styles.input}
            />
            <TextInput
                placeholder="Word Limit"
                value={wordLimit}
                onChangeText={setWordLimit}
                style={styles.input}
                keyboardType="number-pad"
            />
            <View style={styles.buttonRow}>
                <TouchableOpacity onPress={onClose} style={styles.cancel}>
                <Text>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleCreate} style={styles.create}>
                <Text style={{ color: 'white' }}>Create</Text>
                </TouchableOpacity>
            </View>
            </View>
        </View>
        </Modal>
    )
}

export default NewChatModal


const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: '#00000099',
        justifyContent: 'center',
        alignItems: 'center',
      },
      modal: {
        width: '85%',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 12,
      },
      title: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12,
      },
      input: {
        borderBottomWidth: 1,
        borderColor: '#ccc',
        paddingVertical: 8,
        marginBottom: 12,
      },
      buttonRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
      },
      cancel: {
        marginRight: 16,
        padding: 8,
      },
      create: {
        backgroundColor: '#007bff',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 6,
      },
})