import express from 'express';
import cors from 'cors';
import pino from 'pino';
import cookieParser from 'cookie-parser';
import contactRoutes from './routes/contactRoutes.js';
import authRoutes from './routes/authRoutes.js';
import errorHandler from './middlewares/errorHandler.js';
import notFoundHandler from './middlewares/notFoundHandler.js';

const logger = pino();

export const setupServer = () => {
  const app = express();
  const port = process.env.PORT || 3000;

  // Миддлвары
  app.use(cors());
  app.use(express.json());
  app.use(cookieParser());

  // Маршруты
  app.use('/auth', authRoutes);
  app.use('/contacts', contactRoutes);

  // Главная страница
  app.get('/', (req, res) => {
    res.send('Server is running...');
  });

  // Обработчик "не найдено"
  app.use(notFoundHandler);

  // Обработчик ошибок (должен быть в конце)
  app.use((err, req, res, next) => {
    logger.error('[Error Handler] - ', err);  // Логируем ошибку
    errorHandler(err, req, res, next);
  });

  // Запуск сервера
  app.listen(port, () => {
    logger.info(`Server is running on port ${port}`);
  });
};
