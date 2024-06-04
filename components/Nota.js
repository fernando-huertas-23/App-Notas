import React, { useState } from 'react';
import { Text, StyleSheet, TouchableOpacity, View, Image, TextInput, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Modal from 'react-native-modal';
import { launchCameraAsync, launchImageLibraryAsync } from 'expo-image-picker';

const Nota = ({ data, deleteTask, editTask }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState(data.titulo);
  const [description, setDescription] = useState(data.descripcion);
  const [image, setImage] = useState(data.imagen);

  const pickImage = async () => {
    try {
      const result = await launchImageLibraryAsync({
        mediaTypes: 'Images',
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.cancelled) {
        setImage(result.assets[0].uri); // Actualizado para usar result.uri
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo seleccionar la imagen.');
    }
  };

  const takePicture = async () => {
    try {
      const result = await launchCameraAsync({
        mediaTypes: 'Images',
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.cancelled) {
        setImage(result.assets[0].uri); // Actualizado para usar result.uri
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo tomar la foto.');
    }
  };

  const handleEdit = () => {
    if (title && description && image) {
      editTask(data.id, { titulo: title, descripcion: description, imagen: image });
      setModalVisible(false);
    } else {
      Alert.alert('Error', 'Por favor, complete todos los campos.');
    }
  };

  return (
    <View style={styles.item}>
      <Text style={styles.textDate}>{data.fecha}</Text>
      <Text style={styles.title}>{data.titulo}</Text>
   
      <Text style={styles.textDescription}>{data.descripcion}</Text>
          
      <Image source={{ uri: data.imagen }} style={styles.image} />

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => deleteTask(data.id)}
          style={styles.deleteButton} >
             <Icon name="trash" size={20} color="#ffff" />
          <Text style={styles.deleteText}>Borrar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.editButton} onPress={() => {
  setTitle(data.titulo);
  setDescription(data.descripcion);
  setImage(data.imagen);
  setModalVisible(true);
}}>
  <Icon name="edit" size={20} color="#ffff" />
  <Text style={styles.editText}>Editar</Text>
</TouchableOpacity>

      </View>

      <Modal isVisible={isModalVisible} onBackdropPress={() => setModalVisible(false)}>
        {/* Contenido del modal para editar */}
        <View style={styles.modalContent}>
        
          <TextInput
            style={styles.input}
            placeholder="Título"
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            style={[styles.input, { textAlignVertical: "top" }]}   
            placeholder="Descripción"
            multiline={true}
            numberOfLines={5}
            value={description}
            onChangeText={setDescription}
          />
          
          <Image source={{ uri: image }} style={styles.image} />

          <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={pickImage} style={styles.imageButton}>
          <Icon name="image" size={20} color="#000" />
            <Text style={styles.imageText}>Seleccionar Imagen</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={takePicture} style={styles.cameraButton}>
          <Icon name="camera" size={20} color="#000" />
            <Text style={styles.cameraText}>Tomar Foto</Text>
          </TouchableOpacity>
          </View>
          
          <TouchableOpacity onPress={handleEdit} style={styles.button}>
            <Text style={styles.textButton}>Guardar Cambios</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
    item:{
        backgroundColor: "#E0D4BF",
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
        borderRadius: 5,
        borderColor: "#795548",
        borderWidth: 1,
        marginTop: 15
    },
    textDate: {
        marginBottom: 10
    },
    title: {
        fontWeight: "bold",
        fontSize: 20,
        marginBottom: 10
    },
    textDescription: {
        padding: 10
    },
    description:{
        //borderWidth: 0.5,
        borderRadius: 5,
        backgroundColor: "#fff"
    },
    image: {
        width: "100%",
        height: 200,
        marginVertical: 3,
        borderRadius: 5,
      },
      deleteButton:{
        padding:10,
        paddingLeft:20,
        borderRadius:5,
        backgroundColor:"#1f232b",
        flexDirection:"row",
        alignItems:"center",
        width:"34%"
      },
      deleteText:{
        color:"#ffff",
          marginLeft:8,
          fontSize:14,
          fontWeight:"bold"
      },
      editButton:{
        padding:10,
        paddingLeft:20,
        borderRadius:5,
        backgroundColor:"#1f232b",
        flexDirection:"row",
        alignItems:"center",
        width:"34%"
      },
      editText:{
        color:"#ffff",
          marginLeft:8,
          fontSize:14,
        fontWeight:"bold"
      },
  textButton: {
    color: "#fff",
    padding: 5,
    textAlign: "center",
    fontWeight:"bold"
  },
  modalContent:{
    padding:35,
    backgroundColor:"white",
    borderRadius:25,
    borderColor:"gray",
    borderWidth:2
  },
  input: {
    padding:6,
    borderRadius:5,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row', // para poner horizontal los hotones
    //marginLeft:10,
    //marginRight:20,
    justifyContent: 'space-between', // para distribuir los botones en espacios iguales
    marginTop: 15
  },
  imageButton:{
    flexDirection:"row",
    alignItems:"center",
  },
  imageText:{
      marginLeft:4
  },
  cameraButton:{
    flexDirection:"row",
    alignItems:"center",
    //marginLeft:1
  },
  cameraText:{
    marginLeft:4
  },
  button:{
    alignSelf:"center",
    backgroundColor:"#000",
    padding:6,
    marginTop:20,
    borderRadius:5,
    width:"70%"
  }
})

export default Nota;