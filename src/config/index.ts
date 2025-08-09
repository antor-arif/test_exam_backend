import dotenv from 'dotenv';
dotenv.config();

interface Config {
  port: number;
  mongoUri: string;
  jwtAccessSecret: string;
  jwtRefreshSecret: string;
  accessTokenExpiresIn: string;
  refreshTokenExpiresIn: string;
}

const config: Config = {
  port: Number(process.env.PORT) || 4000,
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/testschool',
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET || 'access_secret',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'refresh_secret',
  accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '1d',
  refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '30d',
};

export default config;
