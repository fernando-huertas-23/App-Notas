import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Menu from "./screens/Menu";


const Stack = createNativeStackNavigator();


export default function App() {
  return (
    <NavigationContainer>

      <Stack.Navigator>

      <Stack.Screen
        name = "Menu"
        component={Menu}
        options = {{
          title: "Mis notas",
          headerTitleAlign: "center",

        headerStyle: {
          backgroundColor: "#E2AA49",
        },
        headerTintColor: "#000",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        }}

      />
      

      </Stack.Navigator>

    </NavigationContainer>
  );
};

//const styles = StyleSheet.create({})

