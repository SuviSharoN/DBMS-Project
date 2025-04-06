import express from 'express';
import studentRoutes from './routes/studentroute.js';
import cors from 'cors';

const app = express();

// ✅ CORS should be applied before any routes
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'],
    credentials: true
}));

app.use(express.json());
app.use('/', studentRoutes);

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
