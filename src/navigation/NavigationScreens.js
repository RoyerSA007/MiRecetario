import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import HomeScreen from "../screens/HomeScreen";
import RegisterScreen from "../screens/RegisterScreen";
import NewRecipeScreen from "../screens/NewRecipeScreen";
import MyRecipeScreen from "../screens/MyRecipeScreen";
import EditRecipeScreen from "../screens/EditRecipe";
import DetailRecipeScreen from "../screens/DetailRecipeScreen";
import SearchRecipeScreen from "../screens/SearchRecipeScreen";
import FavoriteScreen from "../screens/FavoriteScreen";

const Stack = createNativeStackNavigator();

export default function NavigationScreens() {
    
    return(
        <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name="Login" component={LoginScreen}/>
            <Stack.Screen name="Home" component={HomeScreen}/>
            <Stack.Screen name="Register" component={RegisterScreen}/>
            <Stack.Screen name="NewRecipe" component={NewRecipeScreen}/>
            <Stack.Screen name="MyRecipes" component={MyRecipeScreen}/>
            <Stack.Screen name="EditRecipe" component={EditRecipeScreen}/>
            <Stack.Screen name="DetailRecipe" component={DetailRecipeScreen}/>
            <Stack.Screen name="SearchRecipe" component={SearchRecipeScreen}/>
            <Stack.Screen name="Favorite" component={FavoriteScreen}/>
        </Stack.Navigator>
    )
}