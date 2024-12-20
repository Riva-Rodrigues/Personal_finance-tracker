import { Transaction } from '../models/transaction.model.js';
import { Account } from '../models/account.model.js'; // Assuming you have an Account model

// Create a new transaction
export const createTransaction = async (req, res) => {
    try {
        const userId = req.user.id;
        const { accountName, type, category, payee, amount, date } = req.body;

        console.log("User ID:", userId);
        console.log("Account Name:", accountName);

        const account = await Account.findOne({ accountName: accountName, userId });
        console.log("Account:", account);

        if (!account) {
            console.log("Account not found for given user and account number");
            return res.status(404).json({ message: 'Account not found' });
        }

        // console.log("Account id:", account._id);

        const newTransaction = new Transaction({
            userId,
            accountId: account._id,
            type,
            category,
            payee,
            amount,
            date,
        });

        if (type === 'expense') {
            // Subtract amount from account balance
            account.balance -= amount;
          } else if (type === 'income') {
            // Add amount to account balance
            account.balance += amount;
          }
      
          // Step 4: Save the updated account
        await account.save();

        await newTransaction.save();
        res.status(201).json({
            message: "Transaction created successfully",
            transaction: newTransaction,
            updatedAccount: account,
          });
    } catch (error) {
        console.error("Error creating transaction:", error.message);
        res.status(400).json({ message: error.message });
    }
};




// import {Transaction} from '../models/transaction.model.js'

// // Create a new transaction
// export const createTransaction = async (req, res) => {
//     try {
//         const userId = req.user.id; // Assuming you set req.user in your verifyJWT middleware
//         const { accountId, type, category, payee, amount, date } = req.body;

//         const newTransaction = new Transaction({
//             userId,
//             accountId,
//             type,
//             category,
//             payee,
//             amount,
//             date,
//         });
//         await newTransaction.save();
//         res.status(201).json(newTransaction);
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// };


// Get all transactions
export const getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find()
                    .populate('accountId', 'accountName'); 
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

export const getTransactionsByAccountType = async (req, res) => {
    const { accountType } = req.params;

    try {
        const accounts = await Account.find({ accountType });

        if (accounts.length === 0) {
            return res.status(404).json({ message: "No accounts found for this account type." });
        }

        const accountIds = accounts.map(account => account._id);

        const transactions = await Transaction.find({ accountId: { $in: accountIds } });

        if (transactions.length === 0) {
            return res.status(404).json({ message: "No transactions found for this account type." });
        }

        const transactionsWithAccountNames = transactions.map(transaction => {
            const account = accounts.find(acc => acc._id.toString() === transaction.accountId.toString());
            return {
                ...transaction.toObject(), 
                accountName: account ? account.accountName : "Unknown" 
            };
        });

        res.status(200).json(transactionsWithAccountNames);
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
