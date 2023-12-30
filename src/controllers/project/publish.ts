import { Request, Response } from 'express';
import { Project, ProjectDoc } from '../../models/project';
import { BadRequestError } from '../../errors/bad-request-error';
import { InternalError } from '../../errors/internal-error';
import { NotFoundError } from '../../errors/not-found-error';
import { NotAuthorizedError } from '../../errors/not-authorized-error';

const publishProjectCtrl = async (req: Request, res: Response) => {
  const id = req.params.projectId;
  const project = await Project.findById(id);

  if (!project) {
    throw new NotFoundError();
  }

  const updateData: ProjectDoc = req.body;

  if (!req.currentUser! || project.creator.toString() !== req.currentUser!.id) {
    //todo: add isadmin to the payload of the current user
    console.log('Not Authorized');
    throw new NotAuthorizedError();
  }
  const isDetailsComplete = Object.values(project.progress).reduce((acc, curr) => acc && curr, true)
  if (updateData.isPublished && !project.isPublished && !isDetailsComplete) {
    throw new BadRequestError('Project details are not complete');
  }

  try {
    const updatedProject = await Project.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    await project.save();
    console.log(`Project published status updated successfully:\n${updatedProject}`);
    res.status(200).send(updatedProject);
  } catch (error) {
    console.log(error);
    throw new InternalError();
  }
};

export { publishProjectCtrl };
