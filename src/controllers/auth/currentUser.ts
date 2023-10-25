import { Request, Response } from 'express';

export const currentUserCtrl = async (req: Request, res: Response) => {
  res.status(200).send({ currentUser: req.currentUser || null });
};
