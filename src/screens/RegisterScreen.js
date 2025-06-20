import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, StyleSheet } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';
import { useNavigation } from "@react-navigation/native";
import { doc, setDoc } from "firebase/firestore";
import { db } from '../../firebase';

const RegisterScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    const navigation = useNavigation();
    

    const handleSignUp = async () => {
      try {
        const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredentials.user;

        await setDoc(doc(db, 'users', user.uid), {
          name: name,
          email: email
        });

        console.log('Registered with:', user.email);
      } catch (error) {
          alert(error.message);
      }
    };

     return(
        <KeyboardAvoidingView style={styles.container}>
            <View style={styles.inputContainer}>
                <TextInput placeholder="Email" value={email} 
                  onChangeText={Text => setEmail(Text)} style={styles.input}/>
                <TextInput placeholder="Password" value={password} 
                  onChangeText={Text => setPassword(Text)} style={styles.input} secureTextEntry/>
                <TextInput placeholder="Nombre completo" value={name} 
                  onChangeText={text => setName(text)} style={styles.input}/>
            </View>
            
            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={(handleSignUp)} style={[styles.button, styles.buttonOutLine]}>
                    <Text style={styles.buttonOutLineText}>Register</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    )
}

export default RegisterScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F0',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  inputContainer: {
    width: '100%',
    marginTop: 20,
  },
  input: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 14,
    marginBottom: 15,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  buttonContainer: {
    width: '100%',
    marginTop: 30,
  },
  button: {
    padding: 15,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 3,
  },
  buttonOutLine: {
    backgroundColor: '#FF7F50',
  },
  buttonOutLineText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});

