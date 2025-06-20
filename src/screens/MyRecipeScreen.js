import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
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
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <TouchableOpacity style={[styles.editButton, { flex: 1, marginRight: 5 }]} onPress={() => navigation.navigate('EditRecipe', { receta: item })}>
          <Text style={styles.editText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.deleteButton, { flex: 1, marginLeft: 5 }]} onPress={() => eliminarReceta(item.id)}>
          <Text style={styles.deleteText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
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
    backgroundColor: '#FFF8F0',
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  list: {
    paddingBottom: 100,
  },
  card: {
    backgroundColor: '#FFEFD5',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  descripcion: {
    fontSize: 15,
    color: '#555',
    marginTop: 4,
    marginBottom: 10,
  },
  deleteButton: {
    backgroundColor: '#ff713d',
    paddingVertical: 10,
    borderRadius: 14,
    marginTop: 10,
    alignItems: 'center',
    elevation: 2,
  },
  deleteText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  editButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    borderRadius: 14,
    marginTop: 10,
    alignItems: 'center',
    elevation: 2,
  },
  editText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  emptyText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginTop: 50,
  },
});

