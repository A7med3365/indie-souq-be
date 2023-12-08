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

const listFilmmakersCtrl = async (req: Request, res: Response) => {
  try {
    const usersList = await User.find({ isFilmmaker: true });
    res.status(200).send(usersList);
  } catch (error) {
    console.log(error);
    throw new InternalError();
  }
};

const getUserCtrl = async (req: Request, res: Response) => {
  const id = req.params.userId;
  const user = await User.findById(id);

  if (!user) {
    throw new NotFoundError();
  }
  try {
    console.log(user);
    res.status(200).send(user);
  } catch (error: unknown) {
    console.log(error);
    throw new InternalError();
  }
};

const updateUserCtrl = async (req: Request, res: Response) => {
  const id = req.params.userId;
  const updateData = req.body;

  const user = await User.findByIdAndUpdate(id, updateData, { new: true });

  if (!user) {
    throw new NotFoundError();
  }
  try {
    res.status(200).send(user);
  } catch (error) {
    console.log(error);
    throw new InternalError();
  }
};

export { listUsersCtrl, getUserCtrl, updateUserCtrl, listFilmmakersCtrl };
