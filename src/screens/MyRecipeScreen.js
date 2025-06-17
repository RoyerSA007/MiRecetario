import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import { useIsFocused } from '@react-navigation/native';
import { useNavigation } from "@react-navigation/native";

const MyRecipeScreen = () => {
  const [recetas, setRecetas] = useState([]);
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  

  const cargarRecetas = async () => {
    try {
      const q = query(
        collection(db, 'misRecetas'),
        where('uid', '==', auth.currentUser.uid)
      );
      const querySnapshot = await getDocs(q);
      const lista = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRecetas(lista);
    } catch (error) {
      console.error('Error al cargar recetas:', error);
    }
  };

  const eliminarReceta = (id) => {
    Alert.alert(
      'Eliminar receta',
      '¿Estás seguro de que quieres eliminar esta receta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'misRecetas', id));
              cargarRecetas(); // recargar
            } catch (error) {
              console.error('Error al eliminar:', error);
              Alert.alert('Error', 'No se pudo eliminar la receta');
            }
          },
        },
      ]
    );
  };

  useEffect(() => {
    if (isFocused) {
      cargarRecetas();
    }
  }, [isFocused]);

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('DetailRecipe', { receta: item })}>
      <Text style={styles.title}>{item.nombre}</Text>
      <Text style={styles.descripcion}>{item.descripcion}</Text>
      <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('EditRecipe', { receta: item })} >
        <Text style={styles.editText}>Editar</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.deleteButton} onPress={() => eliminarReceta(item.id)}>
        <Text style={styles.deleteText}>Eliminar</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Mis Recetas Guardadas</Text>
      {recetas.length === 0 ? (
        <Text style={styles.emptyText}>Aún no has agregado recetas.</Text>
      ) : (
        <FlatList data={recetas} keyExtractor={(item) => item.id}
          renderItem={renderItem} contentContainerStyle={styles.list}/>
      )}
    </View>
  );
};

export default MyRecipeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  list: {
    paddingBottom: 100,
  },
  card: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#444',
  },
  descripcion: {
    fontSize: 14,
    color: '#666',
    marginVertical: 5,
  },
  deleteButton: {
    backgroundColor: '#ff5c5c',
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  deleteText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 50,
  },
  editButton: {
  backgroundColor: '#4CAF50',
  paddingVertical: 8,
  borderRadius: 8,
  marginTop: 10,
  alignItems: 'center',
},
editText: {
  color: '#fff',
  fontWeight: 'bold',
},
});
