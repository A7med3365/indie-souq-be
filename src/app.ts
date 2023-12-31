import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import cors from 'cors';

const app = express();

// const allowedOrigins = ['*'];

// const options: cors.CorsOptions = {
//   origin: allowedOrigins,
// };

// app.use(
//   cors({
//     origin: '*',
//     methods: 'GET,PUT,POST,DELETE',
//     allowedHeaders: 'Content-Type,Authorization,set-cookie',
//     credentials: true, // Allow cookies
//   })
// );
// app.options('*', cors());

app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: false,
    // secure: process.env.NODE_ENV !== 'test', //todo: change this back later
    // sameSite: 'none',
  })
);

import { authRouter } from './routes/user';
import { projectRouter } from './routes/project';
import { errorHandler } from './middleware/error-handler';
import { NotFoundError } from './errors/not-found-error';
import { logRequestInfo } from './middleware/log-request-info';
import { fileRouter } from './routes/file';

app.use(logRequestInfo);

app.use(authRouter);
app.use(projectRouter);
app.use(fileRouter);

app.all('*', () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
