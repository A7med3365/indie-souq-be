import { Request, Response } from 'express';
import { InternalError } from '../../errors/internal-error';
import { NotFoundError } from '../../errors/not-found-error';
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

const getUserCtrl = async (req: Request, res: Response) => {
  try {
    const id = req.params.userId;
    const user = await User.findById(id);

    if (!user) {
      throw new NotFoundError();
    }
    console.log(user);
    res.status(200).send(user);
  } catch (error: unknown) {
    if (error instanceof NotFoundError) {
      throw new NotFoundError();
    } else {
      console.log(error);
      throw new InternalError();
    }
  }
};

const updateUserCtrl = async (req: Request, res: Response) => {
  try {
    const id = req.params.userId;
    const updateData = req.body;

    const user = await User.findByIdAndUpdate(id, updateData, { new: true });

    if (!user) {
      throw new NotFoundError();
    }

    res.status(200).send(user);
  } catch (error) {
    throw new InternalError();
  }
};

export { listUsersCtrl, getUserCtrl, updateUserCtrl };
