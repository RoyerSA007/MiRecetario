import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image, ActivityIndicator, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";

const HomeScreen = () => {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [featuredRecipe, setFeaturedRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleSignOut = () => {
    auth.signOut().then(() => {
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    }).catch(error => alert(error.message));
  };

  const fetchUserName = async () => {
    const userRef = doc(db, "users", auth.currentUser.uid);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      setName(docSnap.data().name);
    }
  };

  const fetchFeaturedRecipe = async () => {
    try {
      const res = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
      const data = await res.json();
      setFeaturedRecipe(data.meals[0]);
    } catch (error) {
      console.error("Error fetching recipe", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserName();
    fetchFeaturedRecipe();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.welcome}>Hola, {name || 'Chef'} 👋</Text>
      <Text style={styles.subtitle}>¡Listo para cocinar algo delicioso hoy?</Text>

      <TouchableOpacity style={styles.searchButton} onPress={() => navigation.navigate("SearchRecipe")}>
        <Text style={styles.searchButtonText}>🔍 Buscar Recetas</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>🍽️ Receta destacada</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#0782F9" />
      ) : (
        featuredRecipe && (
          <TouchableOpacity style={styles.recipeCard} onPress={() => navigation.navigate("DetailRecipe", { receta: featuredRecipe })}>
            <Image source={{ uri: featuredRecipe.strMealThumb }} style={styles.recipeImage} />
            <Text style={styles.recipeTitle}>{featuredRecipe.strMeal}</Text>
          </TouchableOpacity>
        )
      )}

      <Text style={styles.sectionTitle}>Accesos rápidos</Text>
      <View style={styles.quickAccess}>
        <TouchableOpacity style={styles.quickButton} onPress={() => navigation.navigate("Favorite")}>
          <Text style={styles.quickText}>❤️ Favoritos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickButton} onPress={() => navigation.navigate("MyRecipes")}>
          <Text style={styles.quickText}>📋 Mis Recetas</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickButton} onPress={() => navigation.navigate("NewRecipe")}>
          <Text style={styles.quickText}>➕ Nueva Receta</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={handleSignOut} style={styles.logoutButton}>
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#fff",
    marginBottom: 40,
  },
  welcome: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  searchButton: {
    backgroundColor: "#0782F9",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  searchButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 10,
    color: "#444",
  },
  recipeCard: {
    backgroundColor: "#f2f2f2",
    borderRadius: 12,
    padding: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  recipeImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    resizeMode: "cover",
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 10,
    color: "#222",
  },
  quickAccess: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  quickButton: {
    backgroundColor: "#FFCC70",
    padding: 12,
    borderRadius: 10,
    flex: 1,
    alignItems: "center",
    marginHorizontal: 5,
  },
  quickText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#222",
  },
  logoutButton: {
    marginTop: 30,
    backgroundColor: "#ccc",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  logoutText: {
    color: "#333",
    fontWeight: "bold",
  },
});
