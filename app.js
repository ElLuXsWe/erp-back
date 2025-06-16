const express = require('express');
const cors = require('cors');  // Importar CORS
const app = express();
const usuarioRoutes = require('./routes/usuarios');
const proyectoRoutes = require('./routes/proyectos');
const tareaRoutes = require('./routes/tareas');  // Añadir la ruta para tareas

// Configuración de CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Lpass', 'Lemail'],
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
// Middleware para procesar el cuerpo de la solicitud
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/usuarios', usuarioRoutes);
app.use('/proyectos', proyectoRoutes);
app.use('/tareas', tareaRoutes);  // Añadir la ruta para tareas

// Inicializar el servidor
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});
