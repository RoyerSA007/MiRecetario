import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import { useIsFocused } from '@react-navigation/native';

const FavoritosScreen = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const [favoritosIds, setFavoritosIds] = useState([]);      // Lista de documentos Firestore
  const [recetas, setRecetas] = useState([]);                // Detalles completos desde API
  const [loading, setLoading] = useState(true);

  // 1️⃣ Carga lista de idMeals desde Firestore
  const cargarFavoritosIds = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, 'favoritos'),
        where('uid', '==', auth.currentUser.uid)
      );
      const snap = await getDocs(q);
      const ids = snap.docs.map(d => ({ docId: d.id, idMeal: d.data().idMeal }));
      setFavoritosIds(ids);
    } catch (e) {
      console.error('Error cargando favoritos IDs', e);
      Alert.alert('Error', 'No pudimos cargar tus favoritos.');
    }
  };

  // 2️⃣ Para cada idMeal, fetch de detalles API
  const cargarDetalles = async () => {
    try {
      const detalles = await Promise.all(
        favoritosIds.map(async ({ docId, idMeal }) => {
          const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idMeal}`);
          const data = await res.json();
          const meal = data.meals?.[0] || null;
          return meal
            ? { ...meal, favoritoDocId: docId } 
            : null;
        })
      );
      setRecetas(detalles.filter(m => m));
    } catch (e) {
      console.error('Error cargando detalles API', e);
      Alert.alert('Error', 'No pudimos obtener los detalles.');
    } finally {
      setLoading(false);
    }
  };

  // Efecto principal: recargar cuando enfoque vuelve
  useEffect(() => {
    if (isFocused) {
      cargarFavoritosIds();
    }
  }, [isFocused]);

  // Cuando cambian los IDs, carga detalles
  useEffect(() => {
    if (favoritosIds.length > 0) {
      cargarDetalles();
    } else {
      setRecetas([]); 
      setLoading(false);
    }
  }, [favoritosIds]);

  // Botón para quitar de favoritos
  const quitarFavorito = async (docId) => {
    try {
      await deleteDoc(doc(db, 'favoritos', docId));
      // refresca
      cargarFavoritosIds();
    } catch (e) {
      console.error('Error eliminando favorito', e);
      Alert.alert('Error', 'No pudimos quitar de favoritos.');
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('DetailRecipe', { receta: item })}
    >
      <Image source={{ uri: item.strMealThumb }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.nombre}>{item.strMeal}</Text>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => quitarFavorito(item.favoritoDocId)}
        >
          <Text style={styles.removeText}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Tus Recetas Favoritas</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#0782F9" style={{ marginTop: 50 }} />
      ) : recetas.length === 0 ? (
        <Text style={styles.vacio}>No tienes recetas favoritas aún.</Text>
      ) : (
        <FlatList
          data={recetas}
          keyExtractor={(item) => item.idMeal}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
};

export default FavoritosScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  vacio: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    marginTop: 50,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginBottom: 12,
    overflow: 'hidden',
    elevation: 2,
  },
  image: {
    width: 100,
    height: 100,
  },
  info: {
    flex: 1,
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nombre: {
    fontSize: 16,
    fontWeight: '500',
    flexShrink: 1,
  },
  removeButton: {
    padding: 6,
  },
  removeText: {
    fontSize: 18,
  },
});
