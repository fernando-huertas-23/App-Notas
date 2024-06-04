import { Text, View, StyleSheet, TextInput, TouchableOpacity, Image, FlatList, Alert} from "react-native";
import React, {useState} from "react";
import Icon from 'react-native-vector-icons/FontAwesome';
import { launchCameraAsync, launchImageLibraryAsync } from 'expo-image-picker';
import { useWindowDimensions } from 'react-native';
import { ActivityIndicator } from "react-native-paper";
import fetch from 'node-fetch';

const useImagePicker = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
  
    //evento para seleccionar imagen de la galeria
    const pickImages = async () => {
      try {
        setLoading(true);
        const result = await launchImageLibraryAsync({
          mediaTypes: 'Images',
          //allowsMultipleSelection: true,
          //selectionLimit: 10,
          aspect: [4, 3],
          quality: 1,
        });
        setLoading(false);
        if (!result.cancelled) {
          setImages(result.assets);
        }
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };
  
    //evento para tomar foto con la camara
    const takePicture = async () => {
      try {
        setLoading(true);
        const result = await launchCameraAsync({
          title: 'Tomar una imagen',
          storageOptions: {
            skipBackup: true,
            path: 'images',
          },
          includeBase64: true,
        });
        setLoading(false);
        if (!result.cancelled) {
            setImages(result.assets);
        }
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };
  
    return { images, pickImages, takePicture, loading, error, setImages};
  };
  

const NewTask = ({navigation}) => {
    
    //ajusta las imagenes a cualquier dimension de pantalla
    const { width } = useWindowDimensions();
    const { takePicture,images,loading, pickImages,setImages } = useImagePicker();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

   
    const saveTask = async () => {
      try {
        if (title === '' || description === '' || !images.length) {
          throw new Error('Por favor, complete todos los campos');
        }
  
        const response = await fetch('http://192.168.100.7:3000/new-task', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            titulo: title,
            descripcion: description,
            imagen: images[0].uri,
          }),
        });
  
        if (!response.ok) {
          throw new Error('Error al guardar la tarea');
        } else{
          Alert.alert('Éxito', 'Tarea guardada con éxito', [
            {
              text: 'Aceptar',
              onPress: () => {
                console.log('Tarea guardada');
                setTitle("");
                setDescription("");
                setImages([]);
                navigation.navigate("Notas", {state: true});
              },
            },
          ]);

        }
       
        
      } catch (error) {
        Alert.alert('Error', error.message, [
          { text: 'Aceptar', onPress: () => console.log('Error al guardar la tarea') },
        ]);
      }
    };

    return(
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>Crea una nueva nota</Text>
            </View>

            <View style={styles.form}>
                <View style={styles.inputGroup}>
                    <TextInput
                        placeholder="Titulo"
                        onChangeText={setTitle}
                        value={title}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <TextInput
                        placeholder="Descripcion"
                        multiline={true}
                        numberOfLines={5}
                        style={{textAlignVertical: "top"}}
                        onChangeText={setDescription} 
                        value={description}
                    />
                </View>

                
                <FlatList 
                    data={images}
                    renderItem={({ item }) => (
                        <Image
                        source={{  uri: images[0].uri}}
                        //value = {newTask.images}
                      
                        style={{marginLeft:70,width:200, height: 200, resizeMode: 'cover'}}
                        />
                    )}
                    keyExtractor={(item) => item.uri}
                    //contentContainerStyle={{paddingBottom: 10 }}
                    ListHeaderComponent={
                        loading ? (
                                <View>
                                    <Text style={{fontSize:20, fontWeight:'bold', textAlign:'center'}}>Cargando...</Text>
                                    <ActivityIndicator size={"large"} />
                                </View>
                        ):(

                <View style={styles.imageContainer}>
                    <TouchableOpacity style={styles.imageButton} onPress={pickImages}>
                        <Icon name="image" size={24} color="#000" />
                        <Text style={styles.imageText}>Seleccionar Imagen</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.cameraButton} onPress={takePicture}>
                        <Icon name="camera" size={24} color="#000" />
                        <Text style={styles.cameraText}>Cámara</Text>
                    </TouchableOpacity>
                </View>
                        )
                 }
                 />
               

                <TouchableOpacity style={styles.button} onPress={saveTask}> 
                    <Text style={styles.textButton}>Guardar nota</Text>
                </TouchableOpacity>

            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#f5f5f5'
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
    form:{
        padding:40,
        
    },
    inputGroup:{
        padding:10,
        marginBottom:32,
        borderWidth:1.5,
        borderColor: "#000",
        borderRadius:5,
    },
    button:{
        alignItems:"center",
        backgroundColor:"#1f232b",
        padding:12,
        marginTop:20,
        borderRadius:5,
        width:"100%"
    },
    textButton:{
        color:"#fff",
        fontSize:16,
        fontWeight:"bold"
    },
    imageContainer:{
        flexDirection:"row",
        justifyContent:"space-between",
        marginBottom:20,
        marginLeft:10,
        marginRight:10
    },
    imageButton:{
        flexDirection:"row",
        alignItems:"center",
    },
    imageText:{
        marginLeft:8
    },
    cameraButton:{
        flexDirection:"row",
        alignItems:"center"
    },
    cameraText:{
        marginLeft:8
    },
});

export default NewTask