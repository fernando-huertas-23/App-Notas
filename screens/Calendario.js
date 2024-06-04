import React, { useState, useEffect } from 'react';
import { Text, View, Button, TextInput, Alert, Modal, FlatList, StyleSheet,TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Calendar } from 'react-native-calendars';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Platform } from 'react-native';

const Calendario = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [newEvent, setNewEvent] = useState({
    titulo: '',
    fecha_inicio: '',
    fecha_fin: '',
    descripcion: '',
    invitado: '',
  });

  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [datePickerField, setDatePickerField] = useState(null);

  const handleOpenDatePicker = (field) => {
    setDatePickerField(field);
    setDatePickerVisible(true);
  };

  const handleDateChange = (event, selectedDate) => {
    if (selectedDate) {
      const localDate = new Date(selectedDate.setMinutes(selectedDate.getMinutes() - selectedDate.getTimezoneOffset()));
      setNewEvent({ ...newEvent, [datePickerField]: localDate.toISOString().slice(0,10) });
    }
    setDatePickerVisible(false);
  };
  

  useEffect(() => {
    fetchEvents();
  }, [newEvent, modalVisible]);
  

  const fetchEvents = async () => {
    try {
      const response = await fetch('http://192.168.100.7:3000/events');
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleDayPress = (day) => {
    const event = events.find((event) => event.fecha_inicio === day.dateString);
    setSelectedEvent(event);
  };

  const handleInputChange = (name, value) => {
    setNewEvent({ ...newEvent, [name]: value });
  };

  const handleAddEvent = async () => {
    try {
      const response = await fetch('http://192.168.100.7:3000/new-event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEvent),
      });

      if (!response.ok) {
        throw new Error('Error adding event');
      }

      Alert.alert('Exito', 'Event Agregado');
      setNewEvent({
        titulo: '',
        fecha_inicio: '',
        fecha_fin: '',
        descripcion: '',
        invitado: '',
      });
      setModalVisible(false);
      const updatedEvents = await fetchEvents();
      setEvents(updatedEvents);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleDeleteEvent = async (id) => {
    try {
      const response = await fetch(`http://192.168.100.7:3000/events/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error deleting event');
      }

      Alert.alert('Exito', 'Evento Eliminado');
      setEvents(events.filter(event => event.id !== id));
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Calendar onDayPress={handleDayPress} style={styles.calendar} />
      <TouchableOpacity 
      onPress={() => setModalVisible(true)}
      style={styles.buttonAñadir} >
        <Text  style={styles.textbuttonAñadir} >Añadir evento</Text>
      </TouchableOpacity>
      <View style={{ height: 2, backgroundColor: 'black', marginTop:10 }} /> 
      <View style={styles.tituloContainer}>
        <Text style={styles.textEventos}>EVENTOS</Text>
      </View>
      <FlatList
        data={events}
        extraData={events}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.eventContainer}>
            <Text style={styles.eventTitle}>{item.titulo}</Text>
            <TouchableOpacity
            onPress={() => handleDeleteEvent(item.id)}
            style={styles.deleteButton}>
              <Icon name="trash" size={20} color="#ffff" />
              <Text  style={styles.deleteText} >Borrar</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <Modal visible={modalVisible} animationType="slide" style={styles.modal}>

            <View style={styles.tituloForm}>
                <Text style={styles.titulo}>Crea un nuevo evento</Text>
            </View>

        <View style={styles.form}>

        <View style={styles.inputGroup}>
        <TextInput
          placeholder="Titulo"
          value={newEvent.titulo}
          onChangeText={(text) => handleInputChange('titulo', text)}         
        />
        </View>

        <TouchableOpacity 
        onPress={() => handleOpenDatePicker('fecha_inicio')} 
        style={styles.buttonFecha}>
          <Text style={styles.textbuttonFecha}>Selecciona fecha inicio</Text>
        </TouchableOpacity>
        <View style={styles.textFecha}>
        {newEvent.fecha_inicio && <Text>Fecha Inicio: {newEvent.fecha_inicio}</Text>}
        </View>

        <TouchableOpacity 
        onPress={() => handleOpenDatePicker('fecha_fin')}
        style={styles.buttonFecha} >
          <Text style={styles.textbuttonFecha}>Selecciona fecha fin</Text>
        </TouchableOpacity>
        <View style={styles.textFecha}>
        {newEvent.fecha_fin && <Text>Fecha Fin: {newEvent.fecha_fin}</Text>}
        </View>

        <View style={styles.inputGroup}>
        <TextInput
          placeholder="Descripcion"
          value={newEvent.descripcion}
          onChangeText={(text) => handleInputChange('descripcion', text)}          
        />
        </View>

        <View style={styles.inputGroup}>
        <TextInput
          placeholder="invitados"
          value={newEvent.invitado}
          onChangeText={(text) => handleInputChange('invitado', text)}     
        />
        </View>

        <TouchableOpacity 
        onPress={handleAddEvent}
        style={styles.buttonGuardar} >
          <Text style={styles.textbuttonGuardar}>Guardar Evento</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
        onPress={() => setModalVisible(false)}
        style={styles.buttonVolver} >
          <Text style={styles.textbuttonVolver}>Volver</Text>        
        </TouchableOpacity>

        </View>

        {datePickerVisible && (
          <DateTimePicker
            value={newEvent[datePickerField] ? new Date(newEvent[datePickerField]) : new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleDateChange}
          />
        )}
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  calendar: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    margin: 10,
  },
  buttonAñadir: {
    alignItems:"center",
    backgroundColor:"#1f232b",
    padding:12,
    marginTop:10,
    borderRadius:5,
    width:"50%",
    alignSelf: 'center'
  },
  textbuttonAñadir:{
    color:"#fff",
    fontSize:16,
    fontWeight:"bold"
  },
  deleteButton:{
    padding:8,
    paddingLeft:20,
    borderRadius:5,
    flexDirection:"row",
    alignItems:"center",
    backgroundColor:"#1f232b",
    width:"30%"
},
  deleteText:{
    color:"white",
  marginLeft:4,
  fontWeight:"bold",
  fontSize:14
  },
  tituloContainer:{
    backgroundColor:"#E0D4BF",
    alignItems:'center',
    margin:10,
  },
  textEventos:{
    fontSize:20, 
    fontWeight: "bold",
    padding:5
  },
  eventContainer: {
    flexDirection:"row",
    justifyContent:"space-between",
    margin: 10,
    padding: 15,
    backgroundColor: '#ddd',
    borderRadius: 5,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingTop:4
  },
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  form:{
    padding:40, 
  },
  tituloForm:{
    alignItems:"center",
    paddingTop:15,
    paddingBottom:15,
    backgroundColor: "#E2AA49"
  },
  titulo:{
    fontSize:18,
    color: "#000",
    fontWeight: "bold",
    textAlign:"center",
  },
  inputGroup:{
    padding:10,
    marginBottom:32,
    borderWidth:1.5,
    borderColor: "#000",
    borderRadius:5,
},
buttonFecha: {
  alignItems:"center",
  backgroundColor:"#E0D4BF",
  padding:8,
  marginTop:10,
  borderRadius:5,
  width:"70%",
  alignSelf: 'center'
},
textbuttonFecha:{
  color:"#000",
  fontSize:16,
  fontWeight:"bold"
},
textFecha:{
  padding:5,
  alignSelf:"center",
  alignItems:"center",
  margin:20,
  borderWidth:1,
  borderColor: "#000",
  borderRadius:5,
  width:"60%"
},
buttonGuardar:{
  alignItems:"center",
  backgroundColor:"#000",
  padding:12,
  marginTop:8,
  borderRadius:5,
  width:"80%",
  alignSelf: 'center'
},
textbuttonGuardar:{
  color:"#fff",
  fontSize:16,
  fontWeight:"bold"
},
buttonVolver:{
  alignItems:"center",
  backgroundColor:"#D02929",
  padding:6,
  marginTop:10,
  borderRadius:5,
  width:"30%",
  alignSelf: 'center'
},
textbuttonVolver:{
  color:"#fff",
  fontSize:16,
  fontWeight:"bold"
},
});

export default Calendario;
