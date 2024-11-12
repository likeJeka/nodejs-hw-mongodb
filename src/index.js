import dotenv from 'dotenv';
import { setupServer } from './server.js';
import initMongoConnection from './db/initMongoConnection.js';

dotenv.config();

initMongoConnection().then(() => {
  setupServer();  // Запуск сервера
}).catch((error) => {
  console.error('Initialization failed:', error);
  process.exit(1);
});
