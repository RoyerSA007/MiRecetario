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
                <TextInput placeholder="Email" 
                value={email} onChangeText={Text => setEmail(Text)} 
                style={styles.input}/>
                <TextInput placeholder="Password" 
                value={password} onChangeText={Text => setPassword(Text)}
                style={styles.input} secureTextEntry/>
                <TextInput placeholder="Nombre completo"
                value={name} onChangeText={text => setName(text)}
                style={styles.input}/>
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
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  inputContainer: {
    width: '80%',
  },
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
  },
  buttonContainer: {
    width: '60%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  button: {
    backgroundColor: '#0782F9',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonOutLine: {
    backgroundColor: 'white',
    marginTop: 5,
    borderColor: '#0782F9',
    borderWidth: 2,
  },
  buttonOutLineText: {
    color: '#0782F9',
    fontWeight: '700',
    fontSize: 16,
  },
});
