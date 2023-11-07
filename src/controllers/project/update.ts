import { Request, Response } from 'express';
import { Project } from '../../models/project';
import { User } from '../../models/user';
import { BadRequestError } from '../../errors/bad-request-error';
import { InternalError } from '../../errors/internal-error';
import { NotFoundError } from '../../errors/not-found-error';
import { NotAuthorizedError } from '../../errors/not-authorized-error';
import { CustomError } from '../../errors/custom-error';

const updateProjectCtrl = async (req: Request, res: Response) => {
  const id = req.params.projectId;
  const project = await Project.findById(id);

  if (!project) {
    throw new NotFoundError();
  }

  const updateData = req.body;

  if (updateData.creator) {
    console.log('Creator cannot be changed');
    throw new BadRequestError('Creator cannot be changed');
  }
  if (!req.currentUser! || project.creator.toString() !== req.currentUser!.id) {
    //todo: add isadmin to the payload of the current user
    console.log('Not Authorized');
    throw new NotAuthorizedError();
  }

  try {
    const updatedProject = await Project.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    await project.save();
    console.log(`Project updated successfully:\n${updatedProject}`);
    res.status(200).send(updatedProject);
  } catch (error) {
    console.log(error);
    throw new InternalError();
  }
};

export { updateProjectCtrl };
