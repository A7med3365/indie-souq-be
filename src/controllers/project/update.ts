import { Request, Response } from 'express';
import { Project, ProjectDoc } from '../../models/project';
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

  const updateData: ProjectDoc = { ...req.body, progress: project.progress };
  console.log({ updateData });

  if (updateData.creator) {
    console.log('Creator cannot be changed');
    throw new BadRequestError('Creator cannot be changed');
  }
  if (!req.currentUser! || project.creator.toString() !== req.currentUser!.id) {
    //todo: add isadmin to the payload of the current user
    console.log('Not Authorized');
    throw new NotAuthorizedError();
  }
  if (updateData.budget) {
    for (let i = 0; i < updateData.budget.length; i++) {
      if (updateData.budget[i].name === '') {
        console.log('Budget name cannot be empty');
        throw new BadRequestError('Budget section name cannot be empty');
      }
    }
    const sum = updateData.budget.reduce((acc: number, curr: any) => {
      return acc + curr.percentage;
    }, 0);
    if (sum !== 100) {
      console.log('Budget percentages must add up to 100');
      throw new BadRequestError('Budget percentages must add up to 100');
    } else {
      updateData.progress.budget = true;
    }
  }

  if (
    !updateData.progress.details &&
    updateData.title?.length > 0 &&
    updateData.type?.length > 0 &&
    updateData.details?.media?.length > 0 &&
    updateData.details?.story?.length > 0
  ) {
    updateData.progress.details = true;
  }

  if (
    !updateData.progress.funding &&
    updateData.details?.endOfCampaign?.length > 0 &&
    updateData.details?.stage?.length > 0 &&
    updateData.details?.goal > 0
  ) {
    updateData.progress.funding = true;
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
