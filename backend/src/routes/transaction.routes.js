import express from 'express';
import {
    createTransaction,
    getTransactions,
    updateTransaction,
    deleteTransaction,
    getTransactionsByAccount,
    getTransactionsByAccountType
} from '../controllers/transaction.controller.js';
import verifyJWT  from '../middlewares/auth.middleware.js'; 

const router = express.Router();

router.use(verifyJWT);

router.post('/', createTransaction);
router.get('/', getTransactions);
router.get('/account/:accountId', getTransactionsByAccount);
router.get('/type/:accountType', getTransactionsByAccountType);
router.put('/:id', updateTransaction);
router.delete('/:id', deleteTransaction);

export default router;
