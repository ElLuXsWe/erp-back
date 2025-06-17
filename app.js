const express = require('express');
const cors = require('cors');  // Importar CORS
const app = express();
const usuarioRoutes = require('./routes/usuarios');
const proyectoRoutes = require('./routes/proyectos');
const tareaRoutes = require('./routes/tareas');  // Añadir la ruta para tareas

const allowedOrigins = [
  'http://localhost:3000',
  'https://erp-front.azurewebsites.net'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Lpass', 'Lemail'],
  credentials: true
}));


app.options('*', cors()); // manejo de preflight


app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
// Middleware para procesar el cuerpo de la solicitud
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/usuarios', usuarioRoutes);
app.use('/proyectos', proyectoRoutes);
app.use('/tareas', tareaRoutes);  // Añadir la ruta para tareas
app.get('/api/ping', (req, res) => {
  res.json({ message: 'API funcionando correctamente!' });
});
// Inicializar el servidor
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});
