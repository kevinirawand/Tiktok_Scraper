import ExpressApplication from './app';
import logger from './utils/logger';
import 'dotenv/config';

const PORT: number | string = process.env.PORT || 1337;

const app = new ExpressApplication(PORT);
const server = app.start();

process.on('SIGTERM', () => {
   logger.warn('SIGTERM RECIEVED!');
   server.close(() => {
      logger.warn('Process Terminated!');
   });
});
