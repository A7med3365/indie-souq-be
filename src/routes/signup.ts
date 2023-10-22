import express from 'express';
import { body } from 'express-validator';

const router = express.Router();

import { signupCtrl } from '../controllers/signup';
import { signinCtrl } from '../controllers/signin';
import { signoutCtrl } from '../controllers/signout';
// import { currentUserCtrl } from '../controllers/currentUser';
import { validateRequest } from '../middleware/validate-req';
import { currentUser, isAuth } from '../middleware/logged-in-check';

router.post(
  '/api/users/signup',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim() // remove spaces
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4 and 20 characters'),
  ],
  validateRequest,
  signupCtrl
);

router.post(
  '/api/users/signin',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('You must supply a password'),
  ],
  validateRequest,
  signinCtrl
);

// router.get('/api/users/currentuser', currentUser, currentUserCtrl);

router.get('/api/users/signout', signoutCtrl);

export { router as authRouter };
