import express from 'express';
import {
    createAccount,
    getAccounts,
    updateAccount,
    deleteAccount
} from '../controllers/account.controller.js';
import verifyJWT  from '../middlewares/auth.middleware.js'; // Make sure to import your authentication middleware

const router = express.Router();

// Apply the authentication middleware to all routes
router.use(verifyJWT); // Ensure that the user is authenticated for all routes

// Route to create a new account
router.post('/', createAccount);

// Route to get all accounts for the logged-in user
router.get('/', getAccounts);

// Route to update an account by ID
router.put('/:id', updateAccount);

// Route to delete an account by ID
router.delete('/:id', deleteAccount);

export default router;
