import { Text, View, StyleSheet, ScrollView,Alert } from "react-native";
import React, {useState, useEffect} from "react";
import Nota from "../components/Nota";
import { useFocusEffect } from '@react-navigation/native';

const Tasks = ({route}) => {

    const [tasks, setTasks] = useState([]);
    
    useFocusEffect(
      React.useCallback(() => {
        getTasks();
      }, [])
    );

    const getTasks = async () => {
        try {
          const response = await fetch('http://192.168.100.7:3000/notas', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
      
          if (!response.ok) {
            throw new Error('Error al obtener las notas');
          }
      
          const tasks = await response.json();
          setTasks(tasks);
          console.log(tasks); 
          return tasks;
        } catch (error) {
          Alert.alert('Error', error.message, [
            { text: 'Aceptar', onPress: () => console.log('Error al obtener las notas') },
          ]);
        }
      };

      const deleteTask = async (id) => {
        const SendData = {
          id: id,
        }
    
        try {
          const response = await fetch(`http://192.168.100.7:3000/notas/${id}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
          });
    
          if (!response.ok) {
            throw new Error('Error al eliminar nota');
          } else {
            Alert.alert('Exito', 'Nota Eliminada');
            getTasks();
          }
    
        } catch (error) {
          Alert.alert('Error', error.message, [
            { text: 'Aceptar', onPress: () => console.log('Error al eliminar nota') },
          ]);
        }
      }
    
      const editTask = async (id,  { titulo, descripcion, imagen }) => {
        const SendData = {
          titulo, // Cambiado de 'title' a 'titulo'
          descripcion, // Cambiado de 'description' a 'descripcion'
          imagen, // 'image' ya está correctamente nombrado como 'imagen'
        }
    
        try {
          const response = await fetch(`http://192.168.100.7:3000/notas/${id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(SendData),
          });
    
          if (!response.ok) {
            throw new Error('Error al editar nota');
          } else {
            getTasks();
          }
    
        } catch (error) {
          
          Alert.alert('Error', error.message, [
            { text: 'Aceptar', onPress: () => console.log('Error al editar nota') },
          ]);
        }
      }
    
      if (route.params != undefined && route.params.state == true && route.params.id != undefined) {
        deleteTask(route.params.id);
      } else if (route.params != undefined && route.params.state == false) {
        editTask(route.params.id, route.params.title, route.params.description, route.params.image);
      }
    

    return(
        <ScrollView style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>Notas</Text>
            </View>

            {
              tasks.map((data,i) => {
                return <Nota key={i} data={data} deleteTask={deleteTask} editTask={editTask} />
              })
            }

        </ScrollView>
    )
};

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: "#f5f5f5"
  },
  titleContainer:{
    alignItems:"center",
    marginTop:10,
},
title:{
    fontSize:18,
    color: "#000",
    fontWeight: "bold",
    textAlign:"center",
},
})

export default Tasks