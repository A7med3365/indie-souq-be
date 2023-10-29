import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import cors from 'cors';

const app = express();

const allowedOrigins = ['*'];

const options: cors.CorsOptions = {
  origin: allowedOrigins,
};

app.use(cors(options));
// app.options('*', cors());

app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
);

import { authRouter } from './routes/signup';
import { errorHandler } from './middleware/error-handler';
import { NotFoundError } from './errors/not-found-error';
import { logRequestInfo } from './middleware/log-request-info';

app.use(logRequestInfo);

app.use(authRouter);

app.all('*', () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
