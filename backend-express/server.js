const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');

// Učitavanje .env fajla
dotenv.config();

// Konekcija na bazu
connectDB();

const app = express();

// Middleware za CORS
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));

// Middleware za parsiranje JSON tela zahteva
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Definisanje ruta
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/ads', require('./routes/adRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/files', require('./routes/fileRoutes'));

// Omogućavanje pristupa upload-ovanim slikama
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Globalni error handler (mora biti na kraju)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));