import express from 'express';
import cors from 'cors';
import pino from 'pino';
import contactRoutes from './routes/contactRoutes.js';
import authRoutes from './routes/authRoutes.js';
import errorHandler from './middlewares/errorHandler.js';
import notFoundHandler from './middlewares/notFoundHandler.js';
import authenticate from './middlewares/authenticate.js';

const logger = pino();

export const setupServer = () => {
  const app = express();
  const port = process.env.PORT || 3000;

  app.use(cors());
  app.use(express.json());

  app.use('/api/auth', authRoutes);

  app.use('/api/contacts', authenticate, contactRoutes);

  app.get('/', (req, res) => {
    res.send('Server is running...');
  });

  app.use(notFoundHandler);

  app.use(errorHandler);

  app.listen(port, () => {
    logger.info(`Server is running on port ${port}`);
  });
};
