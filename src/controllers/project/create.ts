import { Request, Response } from 'express';
import { Project } from '../../models/project';
import { User } from '../../models/user';
import { BadRequestError } from '../../errors/bad-request-error';
import { InternalError } from '../../errors/internal-error';

const createProjectCtrl = async (req: Request, res: Response) => {
  const { title, creator } = req.body;

  const user = await User.findById(creator);

  if (!user) {
    console.log('creator not found');
    throw new BadRequestError('Creator not registered');
  }

  try {
    const project = Project.build({
      title,
      creator,
    });

    await project.save();
    console.log(`New Project created by ${creator} successfully`);
    console.log(project);
    res.status(201).send(project);
  } catch (error) {
    console.log(error);
    throw new InternalError();
  }
};

export { createProjectCtrl };
