import dotenv from 'dotenv';

dotenv.config();
const PORT = process.env.PORT || '3000';
const { DB_ADDRESS } = process.env;

if (!DB_ADDRESS) {
  throw new Error('Missing required env variable: DB_ADDRESS');
}

export { PORT, DB_ADDRESS };
