import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { db } from '../../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

const SearchRecipeScreen = () => {
  const navigation = useNavigation();

  const [busqueda, setBusqueda] = useState('');
  const [recetas, setRecetas] = useState([]);
  const [loading, setLoading] = useState(false);

  //filtros
  const [categorias, setCategorias] = useState([]);
  const [areas, setAreas] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  const [areaSeleccionada, setAreaSeleccionada] = useState('');

  // Cargar filtros
  useEffect(() => {
    const cargarFiltros = async () => {
      const [catRes, areaRes] = await Promise.all([
        fetch('https://www.themealdb.com/api/json/v1/1/list.php?c=list'),
        fetch('https://www.themealdb.com/api/json/v1/1/list.php?a=list'),
      ]);
      const catData = await catRes.json();
      const areaData = await areaRes.json();
      setCategorias(catData.meals);
      setAreas(areaData.meals);
    };
    cargarFiltros();
  }, []);

  //nombre
  const buscarRecetas = async () => {
    if (!busqueda.trim()) return;
      setLoading(true);
      setRecetas([]);

    try {
      const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${busqueda}`);
      const data = await res.json();
      const recetasAPI = data.meals || [];

      const recetasFirebase = [];
      const recetasRef = collection(db, 'misRecetas');

      const q = query(recetasRef, where('nombre', '>=', busqueda), where('nombre', '<=', busqueda + '\uf8ff'));
      const querySnapshot = await getDocs(q);
          
      querySnapshot.forEach(doc => {
        const data = doc.data();
        recetasFirebase.push({ id: doc.id, ...data, source: 'firebase' });
      });

      const recetasCombinadas = [
        ...recetasAPI.map(item => ({ ...item, source: 'api' })), 
        ...recetasFirebase
      ];

      setRecetas(recetasCombinadas);

    } catch (error) {
      console.error('Error al buscar recetas:', error);
    }

    setLoading(false);
  };


  //filtro
  const buscarPorFiltro = async () => {
    setLoading(true);
    try {
      let url = '';
      if (categoriaSeleccionada) {
        url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoriaSeleccionada}`;
      } else if (areaSeleccionada) {
        url = `https://www.themealdb.com/api/json/v1/1/filter.php?a=${areaSeleccionada}`;
      }

      if (url) {
        const res = await fetch(url);
        const data = await res.json();
        setRecetas(data.meals || []);
      }
    } catch (error) {
      console.error('Error al filtrar:', error);
    }
    setLoading(false);
  };

  const renderItem = ({ item }) => {
    const nombre = item.strMeal || item.nombre;
    const img = item.strMealThumb || item.imagenURL;

    return (
      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('DetailRecipe', { receta: item })}>
        <Image source={{ uri: img }} style={styles.image} />
      <View>
        <Text style={styles.nombre}>{nombre}</Text>
      </View>
      </TouchableOpacity>
  );}

  return (
    <FlatList 
        style={styles.container}
        data={recetas}
        keyExtractor={(item, index) => item.idMeal || item.id || index.toString()}
        renderItem={renderItem}
        ListHeaderComponent={
          <>
          <Text style={styles.titulo}>Buscar Recetas</Text>

          <TextInput placeholder="Buscar por nombre..." value={busqueda}
              onChangeText={setBusqueda} style={styles.input} onSubmitEditing={buscarRecetas}
          />

          <TouchableOpacity style={styles.button} onPress={buscarRecetas}>
              <Text style={styles.buttonText}>Buscar</Text>
          </TouchableOpacity>

          <Text style={styles.subtitulo}>Filtrar por categoría</Text>
          <Picker selectedValue={categoriaSeleccionada} onValueChange={(value) => {
              setCategoriaSeleccionada(value); setAreaSeleccionada('');}}>

              <Picker.Item label="-- Seleccionar categoría --" value="" />
                {categorias.map((cat, i) => (
              <Picker.Item key={i} label={cat.strCategory} value={cat.strCategory} />
              ))}
          </Picker>

          <Text style={styles.subtitulo}>Filtrar por país</Text>
          <Picker selectedValue={areaSeleccionada} onValueChange={(value) => {
              setAreaSeleccionada(value); setCategoriaSeleccionada('');}} >
              <Picker.Item label="-- Seleccionar país --" value="" />
                {areas.map((area, i) => (
              <Picker.Item key={i} label={area.strArea} value={area.strArea} />
              ))}
          </Picker>

          <TouchableOpacity style={styles.buttonSecondary} onPress={buscarPorFiltro}>
              <Text style={styles.buttonText}>Aplicar Filtro</Text>
          </TouchableOpacity>

          {loading && <ActivityIndicator size="large" color="#0782F9" style={{ marginTop: 20 }} />}
          </>
      }/>
  );
};

export default SearchRecipeScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF8F0',
    padding: 20,
  },
  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitulo: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 5,
    color: '#5A5A5A',
  },
  input: {
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 12,
    fontSize: 16,
    marginBottom: 10,
    elevation: 1,
  },
  button: {
    backgroundColor: '#FF8C42',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 2,
  },
  buttonSecondary: {
    backgroundColor: '#FF8C42',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 15,
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 14,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 12,
  },
  nombre: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flexShrink: 1,
  },
});
