// server.js
import express from 'express';
import mysql from 'mysql2/promise';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());

// Crear conexion a base de datos
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'admin',
  database: 'appnotas',
});

try {
  const [rows, fields] = await db.query('SELECT 1 + 1 AS solution');
  console.log('La respuesta es: ', rows[0].solution);
} catch (error) {
  console.error('Error al ejecutar la consulta:', error);
}


//insertar una Nota
app.post('/new-task', async (req, res) => {
  const { titulo, descripcion, imagen } = req.body;

  
  const query = 'INSERT INTO nota (titulo, descripcion, fecha, imagen) VALUES (?, ?, ?, ?)';
  const fechaActual = new Date();
const fecha = fechaActual.toISOString().slice(0,10);
  const values = [titulo, descripcion, fecha, imagen];

  console.log(query, values); // Imprime la consulta y los valores

  try {
    const result = await db.execute(query, values);
    console.log('Tarea guardada con éxito');
    res.json({ message: 'Éxito' });
  } catch (err) {
    console.error('Error al guardar la tarea:', err);
    res.status(500).json({ message: 'Error al guardar la tarea' });
  }
});

//obtener notas
app.get('/notas', async (req, res) => {
  const query = 'SELECT * FROM nota ORDER BY id DESC';
  try {
    const [rows, fields] = await db.query(query);
    res.json(rows);
  } catch (err) {
    console.error('Error al obtener las notas:', err);
    res.status(500).json({ message: 'Error al obtener las notas' });
  }
});

//editar
app.put('/notas/:id', async (req, res) => {
  const { id } = req.params;
  const { titulo, descripcion, imagen } = req.body;

  // Validar que los parámetros no sean undefined
  if (titulo === undefined || descripcion === undefined || imagen === undefined) {
    return res.status(400).json({ message: 'Los parámetros no deben contener undefined' });
  }

  // Preparar la consulta SQL con los valores a actualizar
  const query = 'UPDATE nota SET titulo = ?, descripcion = ?, imagen = ? WHERE id = ?';
  const values = [titulo, descripcion, imagen, id];

  try {
    // Ejecutar la consulta SQL con los valores proporcionados
    const [result] = await db.execute(query, values);
    if (result.affectedRows === 0) {
      // Si no se encontró la nota para actualizar, enviar un error 404
      return res.status(404).json({ message: 'Nota no encontrada' });
    }
    // Si la actualización fue exitosa, enviar una confirmación
    res.json({ message: 'Nota actualizada con éxito' });
  } catch (error) {
    // En caso de error en la consulta SQL, enviar un mensaje de error
    console.error('Error al actualizar la nota:', error);
    res.status(500).json({ message: 'Error al actualizar la nota', error: error.message });
  }
});


//eliminar
app.delete('/notas/:id', async (req, res) => {
  const id = req.params.id;
  const query = 'DELETE FROM nota WHERE id = ?';
  try {
    const result = await db.execute(query, [id]);
    console.log('Nota eliminada con éxito');
    res.json({ message: 'Éxito' });
  } catch (err) {
    console.error('Error al eliminar la nota:', err);
    res.status(500).json({ message: 'Error al eliminar la nota' });
  }
});

//insertar un evento
app.post('/new-event', async (req, res) => {
  const { titulo, fecha_inicio, fecha_fin, descripcion, invitado } = req.body;

  console.log('fecha_inicio:', fecha_inicio, 'fecha_fin:', fecha_fin);

  const query = 'INSERT INTO evento (titulo, fecha_inicio, fecha_fin, descripcion, invitado) VALUES (?, ?, ?, ?, ?)';
  const values = [titulo, fecha_inicio, fecha_fin, descripcion, invitado];

  try {
    const result = await db.execute(query, values);
    console.log('Event saved successfully');
    res.json({ message: 'Success' });
  } catch (err) {
    console.error('Error saving the event:', err);
    res.status(500).json({ message: 'Error saving the event', error: err.message });
  }
});

//obtener todos los eventos
app.get('/events', async (req, res) => {
  const query = 'SELECT * FROM evento ORDER BY id DESC';
  try {
    const [rows, fields] = await db.query(query);
    res.json(rows);
  } catch (err) {
    console.error('Error getting events:', err);
    res.status(500).json({ message: 'Error getting events' });
  }
});

//eliminar un evento
app.delete('/events/:id', async (req, res) => {
  const id = req.params.id;
  const query = 'DELETE FROM evento WHERE id = ?';

  try {
    const result = await db.execute(query, [id]);
    console.log('Event deleted successfully');
    res.json({ message: 'Success' });
  } catch (err) {
    console.error('Error deleting event:', err);
    res.status(500).json({ message: 'Error deleting event' });
  }
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});