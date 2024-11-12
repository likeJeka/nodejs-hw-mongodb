import dotenv from 'dotenv';
import { setupServer } from './server.js';
import initMongoConnection from './db/initMongoConnection.js';

dotenv.config(); // Загружаем переменные окружения

(async () => {
  try {
    await initMongoConnection(); // Подключаемся к MongoDB перед запуском сервера
    setupServer(); // Запуск сервера
  } catch (error) {
    console.error('Initialization failed:', error);
    process.exit(1); // Завершаем приложение при ошибке
  }
})();
