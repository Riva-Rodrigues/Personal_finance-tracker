import {Transaction} from '../models/transaction.model.js'

// Create a new transaction
export const createTransaction = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming you set req.user in your verifyJWT middleware
        const { accountId, type, category, payee, amount, date } = req.body;

        const newTransaction = new Transaction({
            userId,
            accountId,
            type,
            category,
            payee,
            amount,
            date,
        });
        await newTransaction.save();
        res.status(201).json(newTransaction);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


// Get all transactions
export const getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find();
        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all transactions for a specific account
export const getTransactionsByAccount = async (req, res) => {
    const { accountId } = req.params;
    try {
        const transactions = await Transaction.find({ accountId });
        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a transaction
export const updateTransaction = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedTransaction = await Transaction.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedTransaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }
        res.status(200).json(updatedTransaction);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a transaction
export const deleteTransaction = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedTransaction = await Transaction.findByIdAndDelete(id);
        if (!deletedTransaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }
        res.status(200).json({ message: 'Transaction deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
