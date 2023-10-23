import { Request, Response } from 'express';
import { InternalError } from '../../errors/internal-error';
import { User } from '../../models/user';

const listUsersCtrl = async (req: Request, res: Response) => {
  try {
    const usersList = await User.find({});
    res.status(200).send(usersList);
  } catch (error) {
    console.log(error);
    throw new InternalError();
  }
};

export { listUsersCtrl };
