import express, { Application } from 'express';
import checkAuthorization from './middleware/checkAuthorization';
import checkToken from './middleware/checkToken';
import usersRouter from './routes/user';

const app: Application = express();
const PORT = 3000;

app.use(express.json());
app.use(checkAuthorization);
app.use(checkToken);

app.use('/api/users', usersRouter);

app.use((req, res) => {
  res.status(404).json({ success: false, message: `Ruta ${req.method} ${req.path} no encontrada.` });
});

app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});