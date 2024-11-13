import express from 'express';
import cors from 'cors';
import pino from 'pino';
import contactRoutes from './routes/contactRoutes.js';
import errorHandler from './middlewares/errorHandler.js';
import notFoundHandler from './middlewares/notFoundHandler.js';

const logger = pino();

export const setupServer = () => {
    const app = express();
    const port = process.env.PORT || 3000;

    app.use(cors());
    app.use(express.json());

    app.use('/api', contactRoutes);

    app.get('/', (req, res) => {
        res.send("Server is running...");
    });

    // Обработка 404 для несуществующих маршрутов
    app.use(notFoundHandler);

    // Обработка ошибок
    app.use(errorHandler);

    app.listen(port, () => {
        logger.info(`Server is running on port ${port}`);
    });
};
