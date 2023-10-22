import express, { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { RequestValidationError } from '../errors/request-validation-error';
// import { DatabaseConnectionError } from '../errors/database-connection-error';
import { User } from '../models/user';
import { BadRequestError } from '../errors/bad-request-error';
import jwt from 'jsonwebtoken';

const signupCtrl = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    console.log('Email in use');
    throw new BadRequestError('Email in use');
  }

  const user = User.build({ email, password });
  await user.save();

  // generate jwt
  const userJwt = jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    process.env.JWT_KEY!
  );

  // store it on session object
  req.session = {
    jwt: userJwt,
  };

  res.status(201).send(user);
};

export { signupCtrl };
