import express, { Request, Response } from 'express';
import multer from 'multer';
import axios from 'axios';
import { BadRequestError } from '../errors/bad-request-error';
import { InternalError } from '../errors/internal-error';

const upload = multer();

const router = express.Router();

router.post(
  '/api/upload',
  upload.single('file'),
  async (req: Request, res: Response) => {
    try {
      const file = req.file;
      console.log(file);
      if (file) {
        const encoded = file.buffer.toString('base64');
        const fileName = file.originalname;

        const uploadResponse = await axios.post(
          'https://ih4rl4ru21.execute-api.me-south-1.amazonaws.com/default/S3FileUplaod',
          { fileName: fileName, file: encoded }
        );

        console.log(uploadResponse.data);

        if (uploadResponse.data.statusCode === 200) {
          res.status(200).send({
            message: uploadResponse.data.message,
            url: uploadResponse.data.url,
          });
        }
      } else {
        console.log('ERROR /api/upload : file not defined');
        throw new BadRequestError('File not defined');
      }
    } catch (error) {
      console.log(error);
      throw new InternalError();
    }
  }
);

export { router as fileRouter };
