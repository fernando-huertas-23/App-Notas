import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useTheme } from "react-native-paper";
import { StyleSheet } from "react-native";

import Tasks from "./Task";
import NewTask from "./NewTask";
import Calendario from "./Calendario";
import prueba from "./prueba";

const Tab = createMaterialBottomTabNavigator();

const Menu = () =>{

    return(
        <Tab.Navigator
            tabBarActivateBackgroundColor = "#fff"
            activateColor = "#000"
            inactiveColor = "#95a5a6"
            barStyle = {styles.navigationBar}
        >

        <Tab.Screen
            name = "Notas"
            component = {Tasks}
            options = {{
                tabBarLabel: "Tareas",
                tabBarIcon: () => (
                    <MaterialCommunityIcons name = "view-list" color = "#000" size = {24} />
                )
            }}
        />


        <Tab.Screen
            name = "Nueva Tarea"
            component = {NewTask}
            options = {{
                tabBarLabel: "Nueva Tarea",
                tabBarIcon: () => (
                    <MaterialCommunityIcons name = "checkbox-marked-circle-plus-outline" color = "#000" size = {24} />
                )
            }}
        />

        <Tab.Screen
            name = "Calendario"
            component = {Calendario}
            options = {{
                tabBarLabel: "Calendario",
                tabBarIcon: () => (
                    <MaterialCommunityIcons name = "calendar" color = "#000" size = {24} />
                )
            }}
        />

        
        </Tab.Navigator>

    )
}

const styles = StyleSheet.create({
    navigationBar: {
        backgroundColor: "#fff",
        /*paddingBottom: 5,
        borderTopWidth: 0.5,
        borderTopColor: "#666",*/
      },
})

export default Menu;