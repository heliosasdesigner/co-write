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
} from 'react-native';
import {
  signInWithEmailAndPassword,
  setPersistence,
  inMemoryPersistence,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase/config';

const backImage = require('../../assets/backImage.png');

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onHandleLogin = async () => {
    if (email !== '' && password !== '') {
      try {
        await setPersistence(auth, inMemoryPersistence);

        const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password
        );
        const user = userCredential.user;

        // ✅ Add/update user data in Firestore
        await setDoc(
            doc(db, 'users', user.uid),
            {
              lastLogin: new Date(),
            },
            { merge: true }
        );

        console.log('Login success');
        Alert.alert('Success', 'Logged in successfully!');
      } catch (err) {
        console.error('Login error:', err);
        Alert.alert('Login error', err.message);
      }
    } else {
      Alert.alert('Missing Fields', 'Please enter both email and password.');
    }
  };

  return (
      <View>
        <Image source={backImage} style={styles.backImage} />
        <View style={styles.whiteSheet} />
        <SafeAreaView style={styles.form}>
          <Text style={styles.title}>Log In</Text>
          <TextInput
              style={styles.input}
              placeholder="Enter email"
              autoCapitalize="none"
              keyboardType="email-address"
              textContentType="emailAddress"
              autoFocus={true}
              value={email}
              onChangeText={(text) => setEmail(text)}
          />
          <TextInput
              style={styles.input}
              placeholder="Enter password"
              autoCapitalize="none"
              autoCorrect={false}
              secureTextEntry={true}
              textContentType="password"
              value={password}
              onChangeText={(text) => setPassword(text)}
          />
          <TouchableOpacity style={styles.button} onPress={onHandleLogin}>
            <Text style={{ fontWeight: 'bold', color: '#fff', fontSize: 18 }}>
              {' '}
              Log In
            </Text>
          </TouchableOpacity>
          <View
              style={{
                marginTop: 20,
                flexDirection: 'row',
                alignItems: 'center',
                alignSelf: 'center',
              }}
          >
            <Text style={{ color: 'gray', fontWeight: '600', fontSize: 14 }}>
              Don't have an account?{' '}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text style={{ color: '#f57c00', fontWeight: '600', fontSize: 14 }}>
                {' '}
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
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
  button: {
    backgroundColor: '#f57c00',
    height: 58,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
});
