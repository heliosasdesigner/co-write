import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Button,
  ActivityIndicator,
} from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../firebase/config';
import { doc, setDoc } from 'firebase/firestore';

const backImage = require('../../assets/backImage.png');

export default function Signup({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onHandleSignup = async () => {
    if (!email || !password) {
      return Alert.alert('Missing Fields', 'Please enter email and password.');
    }

    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;


      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        createdAt: new Date(),
      });

      console.log('Signup success');
    } catch (err) {
      console.error('Signup error:', err);
      Alert.alert('Signup Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
      <View>
        <Image source={backImage} style={styles.backImage} />
        <View style={styles.whiteSheet} />
        <SafeAreaView style={styles.form}>
          <Text style={styles.title}>Sign Up</Text>

          <TextInput
              style={styles.input}
              placeholder="Enter email"
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
          />
          <TextInput
              style={styles.input}
              placeholder="Enter password"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              value={password}
              onChangeText={setPassword}
          />

          {loading ? (
              <ActivityIndicator size="large" color="#f57c00" style={{ marginTop: 20 }} />
          ) : (
              <View style={styles.buttonContainer}>
                <Button title="Sign Up" onPress={onHandleSignup} color="#f57c00" />
              </View>
          )}

          <View style={styles.switch}>
            <Text style={styles.switchText}>Have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.switchLink}> Login</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'orange',
    alignSelf: 'center',
    paddingBottom: 24,
  },
  input: {
    backgroundColor: '#F6F7FB',
    height: 58,
    marginBottom: 20,
    fontSize: 16,
    borderRadius: 10,
    padding: 12,
  },
  backImage: {
    width: '100%',
    height: 340,
    position: 'absolute',
    top: 0,
    resizeMode: 'cover',
  },
  whiteSheet: {
    width: '100%',
    height: '75%',
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 60,
  },
  form: {
    justifyContent: 'center',
    marginHorizontal: 30,
  },
  buttonContainer: {
    marginTop: 40,
    borderRadius: 10,
    overflow: 'hidden',
  },
  switch: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
  },
  switchText: {
    color: 'gray',
    fontWeight: '600',
    fontSize: 14,
  },
  switchLink: {
    color: '#f57c00',
    fontWeight: '600',
    fontSize: 14,
  },
});
