import { Account } from '../models/account.model.js';

// Create a new account
export const createAccount = async (req, res) => {
    try {
        const userId = req.user._id; // Retrieve user ID from the request object
        const newAccount = new Account({ ...req.body, userId }); // Include userId when creating the account
        await newAccount.save();
        res.status(201).json(newAccount);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all accounts for the logged-in user
export const getAccounts = async (req, res) => {
    try {
        const accounts = await Account.find({ userId: req.user._id }); // Fetch accounts for the logged-in user
        res.status(200).json(accounts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update an account
export const updateAccount = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedAccount = await Account.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedAccount) {
            return res.status(404).json({ message: 'Account not found' });
        }
        res.status(200).json(updatedAccount);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete an account
export const deleteAccount = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedAccount = await Account.findByIdAndDelete(id);
        if (!deletedAccount) {
            return res.status(404).json({ message: 'Account not found' });
        }
        res.status(200).json({ message: 'Account deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
