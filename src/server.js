import express from 'express';
import cors from 'cors';
import pino from 'pino';
import contactRoutes from './routes/contactRoutes.js'; 

const logger = pino();

export const setupServer = () => {
  const app = express();
  const port = process.env.PORT || 3000;

  app.use(cors());
  app.use(express.json());

  app.use('/api', contactRoutes); 

 
  app.get('/', (req, res) => {
    res.send('Server is running...');
  });

  app.listen(port, () => {
    logger.info(`Server is running on port ${port}`);
  });
};
