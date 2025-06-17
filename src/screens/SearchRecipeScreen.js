import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';


const SearchRecipeScreen = () => {
  const navigation = useNavigation();

  const [busqueda, setBusqueda] = useState('');
  const [recetas, setRecetas] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filtros
  const [categorias, setCategorias] = useState([]);
  const [areas, setAreas] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  const [areaSeleccionada, setAreaSeleccionada] = useState('');

  // Cargar filtros disponibles
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

  // Buscar por nombre
  const buscarRecetas = async () => {
    if (!busqueda.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${busqueda}`);
      const data = await res.json();
      setRecetas(data.meals || []);
    } catch (error) {
      console.error('Error al buscar recetas:', error);
    }
    setLoading(false);
  };

  // Buscar por filtro
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

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('DetailRecipe', { receta: item })}>
      <Image source={{ uri: item.strMealThumb }} style={styles.image} />
      <Text style={styles.nombre}>{item.strMeal}</Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
        data={recetas}
        keyExtractor={(item) => item.idMeal}
        renderItem={renderItem}
        ListHeaderComponent={
            <>
            <Text style={styles.titulo}>Buscar Recetas</Text>

            <TextInput
                placeholder="Buscar por nombre..."
                value={busqueda}
                onChangeText={setBusqueda}
                style={styles.input}
                onSubmitEditing={buscarRecetas}
            />

            <TouchableOpacity style={styles.button} onPress={buscarRecetas}>
                <Text style={styles.buttonText}>Buscar</Text>
            </TouchableOpacity>

            <Text style={styles.subtitulo}>Filtrar por categoría</Text>
            <Picker
                selectedValue={categoriaSeleccionada}
                onValueChange={(value) => {
                setCategoriaSeleccionada(value);
                setAreaSeleccionada('');
                }}
            >
                <Picker.Item label="-- Seleccionar categoría --" value="" />
                {categorias.map((cat, i) => (
                <Picker.Item key={i} label={cat.strCategory} value={cat.strCategory} />
                ))}
            </Picker>

            <Text style={styles.subtitulo}>Filtrar por país</Text>
            <Picker
                selectedValue={areaSeleccionada}
                onValueChange={(value) => {
                setAreaSeleccionada(value);
                setCategoriaSeleccionada('');
                }}
            >
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
        }
        style={styles.container}/>
  );
};

export default SearchRecipeScreen;


const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#444',
  },
  input: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#0782F9',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonSecondary: {
    backgroundColor: '#6C63FF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fafafa',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 10,
  },
  nombre: {
    fontSize: 16,
    fontWeight: '500',
    flexShrink: 1,
  },
});
