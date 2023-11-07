import { Request, Response } from 'express';
import { Project } from '../../models/project';
import { BadRequestError } from '../../errors/bad-request-error';
import { InternalError } from '../../errors/internal-error';
import { NotFoundError } from '../../errors/not-found-error';

const listProjectCtrl = async (req: Request, res: Response) => {
  try {
    const projectsList = await Project.find({});
    res.status(200).send(projectsList);
  } catch (error) {
    console.log(error);
    throw new InternalError();
  }
};

//todo: add query to filter the projects to published only
const showProjectCtrl = async (req: Request, res: Response) => {
  const id = req.params.projectId;
  const project = await Project.findById(id);

  if (!project) {
    throw new NotFoundError();
  }
  try {
    console.log(project);
    res.status(200).send(project);
  } catch (error) {}
};

//todo: add listing of the user projects
export { listProjectCtrl, showProjectCtrl };
