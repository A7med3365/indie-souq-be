import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import cors from 'cors';

const app = express();

const allowedOrigins = ['*'];

// const options: cors.CorsOptions = {
//   origin: allowedOrigins,
// };

app.use(
  cors({
    origin: 'http://localhost:3002',
    methods: 'GET,PUT,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true, // Allow cookies
  })
);
// app.options('*', cors());

app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: false, // process.env.NODE_ENV !== 'test', //todo: change this back later
    sameSite: 'none',
  })
);

import { authRouter } from './routes/user';
import { projectRouter } from './routes/project';
import { errorHandler } from './middleware/error-handler';
import { NotFoundError } from './errors/not-found-error';
import { logRequestInfo } from './middleware/log-request-info';

app.use(logRequestInfo);

app.use(authRouter);
app.use(projectRouter);

app.all('*', () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
