import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, SafeAreaView } from 'react-native';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useNavigation, useRoute } from '@react-navigation/native';

const EditRecipeScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const receta = route.params?.receta;

  const [nombre, setNombre] = useState(receta.nombre);
  const [descripcion, setDescripcion] = useState(receta.descripcion);
  const [ingredientes, setIngredientes] = useState(receta.ingredientes.join(', '));
  const [pasos, setPasos] = useState(receta.pasos);
  const [imagenURL, setImagenURL] = useState(receta.imagenURL || '');

  const handleActualizar = async () => {
    if (!nombre || !descripcion || !ingredientes || !pasos) {
      Alert.alert('Error', 'Por favor completa todos los campos obligatorios');
      return;
    }

    try {
      await updateDoc(doc(db, 'misRecetas', receta.id), {
        nombre,
        descripcion,
        ingredientes: ingredientes.split(',').map(i => i.trim()),
        pasos,
        imagenURL: imagenURL || null,
      });

      Alert.alert('Actualizado', 'La receta fue actualizada con éxito');
      navigation.goBack();
    } catch (error) {
      console.error('Error al actualizar receta:', error);
      Alert.alert('Error', 'No se pudo actualizar la receta.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Editar Receta</Text>

      <TextInput placeholder="Nombre de la receta" placeholderTextColor="#888"
        value={nombre} onChangeText={setNombre} style={styles.input}/>

      <TextInput placeholder="Descripción" placeholderTextColor="#888"
        value={descripcion} onChangeText={setDescripcion} style={styles.input} />

      <TextInput placeholder="Ingredientes (separados por coma)"
        placeholderTextColor="#888" value={ingredientes} onChangeText={setIngredientes}
        style={styles.input} multiline/>

      <TextInput placeholder="Pasos" placeholderTextColor="#888" value={pasos}
        onChangeText={setPasos} style={styles.input} multiline/>

      <TextInput placeholder="URL de imagen (opcional)"placeholderTextColor="#888"
        value={imagenURL} onChangeText={setImagenURL} style={styles.input}/>

      <TouchableOpacity style={styles.button} onPress={handleActualizar}>
        <Text style={styles.buttonText}>Guardar Cambios</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default EditRecipeScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#FFF8F0',
    flexGrow: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    backgroundColor: '#FFEFD5',
    padding: 14,
    borderRadius: 14,
    marginBottom: 16,
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#fa906a',
    padding: 15,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 10,
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

