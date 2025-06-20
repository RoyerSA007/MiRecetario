import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, StyleSheet, Text, Image, TextInput, TouchableOpacity, View  } from "react-native";
import { auth } from "../../firebase";
import { useNavigation } from "@react-navigation/native";
import cuenta from "../imgs/cuenta.png"

const LoginScreen = () => {
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');

    const navigation = useNavigation();

    useEffect(() => {
        const unsuscribe = auth.onAuthStateChanged(user => {
            if(user) {
                navigation.replace("Home")
            }
        })
        return unsuscribe
    }, [])

    const handleLogin = () => {
        signInWithEmailAndPassword(auth, email, password)
        .then(userCredentials => {
            const user = userCredentials.user;
            console.log('Logged in with: ', user.email);
        })
        .catch(error => alert(error.message))
    }

    return(
        <KeyboardAvoidingView style={styles.container}>
            <Image
                source={require('../imgs/cuenta.png')}
                style={styles.icon}/>

            <View style={styles.inputContainer}>
                <TextInput placeholder="Email" 
                placeholderTextColor="#888"
                value={email} onChangeText={Text => setEmail(Text)} 
                style={styles.input}/>
                <TextInput placeholder="Password" 
                placeholderTextColor="#888"
                value={password} onChangeText={Text => setPassword(Text)}
                style={styles.input} secureTextEntry/>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={(handleLogin)} style={styles.button}>
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Register')} style={[styles.button, styles.buttonOutLine]}>
                    <Text style={styles.buttonOutLineText}>Register</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    )
}

export default LoginScreen

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF8F0',
    padding: 20,
  },
  inputContainer: {
    width: '100%',
  },
  input: {
    backgroundColor: '#FFEFD5',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
  buttonContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  button: {
    backgroundColor: '#FF7F50',
    width: '100%',
    padding: 15,
    borderRadius: 14,
    alignItems: 'center',
    elevation: 2,
  },
  buttonOutLine: {
    backgroundColor: '#FFF8F0',
    marginTop: 10,
    borderColor: '#FF7F50',
    borderWidth: 2,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonOutLineText: {
    color: '#FF7F50',
    fontWeight: 'bold',
    fontSize: 16,
  },
    icon: {
    width: 100,
    height: 100,
    marginBottom: 20,
    borderRadius: 20,
  },
});
