import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { collection, addDoc, deleteDoc, query, where, getDocs, doc } from 'firebase/firestore';
import { db, auth } from '../../firebase';

const DetailRecipeScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const receta = route.params?.receta;

  const [esFavorito, setEsFavorito] = useState(false);
  const [favoritoId, setFavoritoId] = useState(null);

  if (!receta) {
    return (
      <View style={styles.centered}>
        <Text style={styles.textItem}>No se encontró la receta.</Text>
      </View>
    );
  }

  const esFirebase = receta.id;
  const nombre = receta.nombre || receta.strMeal;
  const imagen = receta.imagenURL || receta.strMealThumb;
  const pasos = receta.pasos || receta.strInstructions;
  const ingredientes =
    receta.ingredientes ||
    Object.keys(receta)
      .filter((key) => key.startsWith('strIngredient') && receta[key])
      .map((key) => receta[key]);

  const handleEliminar = () => {
    Alert.alert('¿Eliminar receta?', '', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteDoc(doc(db, 'misRecetas', receta.id));
            Alert.alert('Receta eliminada');
            navigation.goBack();
          } catch (error) {
            console.error('Error al eliminar receta:', error);
            Alert.alert('Error', 'No se pudo eliminar la receta');
          }
        },
      },
    ]);
  };

  useEffect(() => {
    const verificarFavorito = async () => {
      if (receta.idMeal) {
        const q = query(
          collection(db, 'favoritos'),
          where('uid', '==', auth.currentUser.uid),
          where('idMeal', '==', receta.idMeal)
        );
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          setEsFavorito(true);
          setFavoritoId(querySnapshot.docs[0].id);
        } else {
          setEsFavorito(false);
        }
      }
    };
    verificarFavorito();
  }, []);

  const toggleFavorito = async () => {
    if (!auth.currentUser) return;

    try {
      if (esFavorito) {
        await deleteDoc(doc(db, 'favoritos', favoritoId));
        setEsFavorito(false);
        setFavoritoId(null);
      } else {
        const docRef = await addDoc(collection(db, 'favoritos'), {
          uid: auth.currentUser.uid,
          idMeal: receta.idMeal,
          strMeal: receta.strMeal,
          strMealThumb: receta.strMealThumb,
          creadoEn: new Date(),
        });
        setEsFavorito(true);
        setFavoritoId(docRef.id);
      }
    } catch (error) {
      console.error('Error al manejar favorito:', error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>{nombre}</Text>

        {imagen ? (
          <Image source={{ uri: imagen }} style={styles.image} />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>Sin imagen</Text>
          </View>
        )}

        <Text style={styles.sectionTitle}>Ingredientes</Text>
        <View style={styles.section}>
          {ingredientes.length > 0 ? (
            ingredientes.map((ing, index) => (
              <Text key={index} style={styles.textItem}>
                • {ing}
              </Text>
            ))
          ) : (
            <Text style={styles.textItem}>No hay ingredientes disponibles</Text>
          )}
        </View>

        <Text style={styles.sectionTitle}>Pasos</Text>
        <Text style={styles.section}>{pasos || 'No hay pasos disponibles'}</Text>

        {esFirebase && (
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={[styles.button, styles.editButton]}
              onPress={() => navigation.navigate('EditRecipe', { receta })}
            >
              <Text style={styles.buttonText}>Editar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleEliminar}>
              <Text style={styles.buttonText}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        )}

        {receta.idMeal && (
          <View style={styles.favButtonContainer}>
            <TouchableOpacity
              style={[
                styles.button,
                {
                  backgroundColor: esFavorito ? '#ff713d' : '#FF7F50',
                  width: '80%',
                },
              ]}
              onPress={toggleFavorito}
            >
              <Text style={styles.buttonText}>
                {esFavorito ? 'Quitar de Favoritos' : 'Agregar a Favoritos'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default DetailRecipeScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF8F0',
  },
  container: {
    padding: 20,
    backgroundColor: '#FFF8F0',
    flexGrow: 1,
    paddingBottom: 40,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF8F0',
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  image: {
    width: '100%',
    height: 220,
    borderRadius: 16,
    marginBottom: 20,
    resizeMode: 'cover',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#444',
  },
  section: {
    marginBottom: 20,
  },
  textItem: {
    fontSize: 16,
    color: '#555',
    marginVertical: 4,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  button: {
    flex: 1,
    padding: 14,
    borderRadius: 14,
    marginHorizontal: 5,
    alignItems: 'center',
    elevation: 2,
  },
  editButton: {
    backgroundColor: '#fa906a',
  },
  deleteButton: {
    backgroundColor: '#ff713d',
  },
  favButtonContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
