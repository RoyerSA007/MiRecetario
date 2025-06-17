import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import { useNavigation } from '@react-navigation/native';

const NewRecipeScreen = () => {
  const navigation = useNavigation();
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [ingredientes, setIngredientes] = useState('');
  const [pasos, setPasos] = useState('');
  const [imagenURL, setImagenURL] = useState('');

  const handleGuardarReceta = async () => {
    if (!nombre || !descripcion || !ingredientes || !pasos) {
      Alert.alert('Error', 'Por favor completa todos los campos obligatorios');
      return;
    }

    try {
      await addDoc(collection(db, 'misRecetas'), {
        uid: auth.currentUser.uid,
        nombre,
        descripcion,
        ingredientes: ingredientes.split(',').map(i => i.trim()),
        pasos,
        imagenURL: imagenURL || null,
        creadoEn: Timestamp.now(),
      });

      Alert.alert('¡Listo!', 'Tu receta fue guardada con éxito');
      navigation.goBack();
    } catch (error) {
      console.error("Error al guardar receta:", error);
      Alert.alert('Error', 'No se pudo guardar la receta.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Agregar Nueva Receta</Text>

      <TextInput
        placeholder="Nombre de la receta"
        value={nombre}
        onChangeText={setNombre}
        style={styles.input}
      />

      <TextInput
        placeholder="Descripción breve"
        value={descripcion}
        onChangeText={setDescripcion}
        style={styles.input}
      />

      <TextInput
        placeholder="Ingredientes (separados por coma)"
        value={ingredientes}
        onChangeText={setIngredientes}
        style={styles.input}
        multiline
      />

      <TextInput
        placeholder="Pasos de preparación"
        value={pasos}
        onChangeText={setPasos}
        style={styles.input}
        multiline
      />

      <TextInput
        placeholder="URL de imagen (opcional)"
        value={imagenURL}
        onChangeText={setImagenURL}
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={handleGuardarReceta}>
        <Text style={styles.buttonText}>Guardar Receta</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default NewRecipeScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#0782F9',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
