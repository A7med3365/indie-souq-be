import { Request, Response } from 'express';
import { BadRequestError } from '../../errors/bad-request-error';
import { User } from '../../models/user';
import { Password } from '../../services/password';
import jwt from 'jsonwebtoken';

const signinCtrl = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (!existingUser) {
    console.log('Email not found');
    throw new BadRequestError('Email not found');
  }

  const passwordMatch = await Password.compare(existingUser.password, password);

  if (!passwordMatch) {
    console.log('Invalid credentials');
    throw new BadRequestError('Invalid credentials');
  }

  // generate jwt
  const userJwt = jwt.sign(
    {
      id: existingUser.id,
      email: existingUser.email,
      isFilmmaker: existingUser.isFilmmaker,
    },
    process.env.JWT_KEY!
  );

  req.session = {
    jwt: userJwt,
  };

  res.status(200).send(existingUser);
};

export { signinCtrl };
