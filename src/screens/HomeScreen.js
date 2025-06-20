import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image, SafeAreaView, ActivityIndicator, ScrollView } from "react-native";
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
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.welcome}>Hola, {name || 'Chef'}</Text>
        <Text style={styles.subtitle}>¡Listo para cocinar algo delicioso hoy?</Text>

        <TouchableOpacity style={styles.searchButton} onPress={() => navigation.navigate("SearchRecipe")}>
          <Text style={styles.searchButtonText}>Buscar Recetas</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Receta destacada</Text>

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
            <Text style={styles.quickText}>Favoritos</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickButton} onPress={() => navigation.navigate("MyRecipes")}>
            <Text style={styles.quickText}>Mis Recetas</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickButton} onPress={() => navigation.navigate("NewRecipe")}>
            <Text style={styles.quickText}>Nueva Receta</Text>
          </TouchableOpacity>
        </View>


        <TouchableOpacity onPress={handleSignOut} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#FFF8F0",
    paddingBottom: 40,
  },
  welcome: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    marginBottom: 20,
  },
  searchButton: {
    backgroundColor: "#FF7F50",
    padding: 15,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 20,
    elevation: 3,
  },
  searchButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 10,
    color: "#444",
  },
  recipeCard: {
    backgroundColor: "#FFEFD5",
    borderRadius: 16,
    padding: 10,
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  recipeImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    resizeMode: "cover",
  },
  recipeTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 10,
    color: "#333",
  },
  quickAccess: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  quickButton: {
    backgroundColor: "#fa906a",
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    margin: 5,
    minWidth: 100,
    maxWidth: 120,
    height: 50,
    elevation: 2,
  },
  quickText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
    textAlign: "center",
  },
  logoutButton: {
    marginTop: 15,
    backgroundColor: "#ff713d",
    padding: 15,
    borderRadius: 14,
    alignItems: "center",
    elevation: 2,
  },
  logoutText: {
    color: "#fff",
    fontWeight: "bold",
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF8F0',
  },
});
