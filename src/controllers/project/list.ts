import { Request, Response } from 'express';
import { Project } from '../../models/project';
import { BadRequestError } from '../../errors/bad-request-error';
import { InternalError } from '../../errors/internal-error';
import { NotFoundError } from '../../errors/not-found-error';

const listProjectCtrl = async (req: Request, res: Response) => {
  try {
    let query = {};
    //TODO: add sorting and filtering options, search by title, genre, type, creator, etc. and sort by date, popularity, etc.
    if (req.query.pub) {
      query = { isPublished: true };
    }
    let projectsList;
    if (req.query.min) {
      projectsList = await Project.find(query)
        .select('title creator genre type isPublished details.media')
        .populate('creator', 'firstName lastName');
    } else {
      projectsList = await Project.find(query).populate(
        'creator',
        'firstName lastName'
      );
    }
    res.status(200).send(projectsList);
  } catch (error) {
    console.log(error);
    throw new InternalError();
  }
};

const listUserProjectCtrl = async (req: Request, res: Response) => {
  try {
    const id = req.params.userId;
    const projectsList = await Project.find({ creator: id });
    res.status(200).send(projectsList);
  } catch (error) {
    console.log(error);
    throw new InternalError();
  }
};

//todo: add query to filter the projects to published only
const showProjectCtrl = async (req: Request, res: Response) => {
  const id = req.params.projectId;
  const project = await Project.findById(id).populate('creator', 'firstName lastName role location avatar');

  if (!project) {
    throw new NotFoundError();
  }
  try {
    console.log(project);
    res.status(200).send(project);
  } catch (error) {}
};

//todo: add listing of the user projects
export { listProjectCtrl, showProjectCtrl, listUserProjectCtrl };
