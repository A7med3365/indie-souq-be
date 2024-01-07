import express from 'express';
import { createChargeCtrl, getChargeCtrl, getFundsCtrl } from '../controllers/fund/charge';

const router = express.Router();

router.post('/api/charge', createChargeCtrl);
router.get('/api/charge/:chargeId', getChargeCtrl);
router.get('/api/fund', getFundsCtrl);
export { router as fundRouter };
