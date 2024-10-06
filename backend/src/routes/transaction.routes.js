import express from 'express';
import {
    createTransaction,
    getTransactions,
    updateTransaction,
    deleteTransaction,
    getTransactionsByAccount
} from '../controllers/transaction.controller.js';
import verifyJWT  from '../middlewares/auth.middleware.js'; 

const router = express.Router();

router.use(verifyJWT);

router.post('/', createTransaction);
router.get('/', getTransactions);
router.get('/account/:accountId', getTransactionsByAccount);
router.put('/:id', updateTransaction);
router.delete('/:id', deleteTransaction);

export default router;
