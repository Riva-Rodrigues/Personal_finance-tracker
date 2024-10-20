import express from 'express';
import {
    createBill,
    getBills,
    updateBill,
    deleteBill
} from '../controllers/bill.controller.js';
import verifyJWT from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(verifyJWT);

router.post('/', createBill);

router.get('/', getBills);

router.put('/:id', updateBill);

router.delete('/:id', deleteBill);

export default router;
