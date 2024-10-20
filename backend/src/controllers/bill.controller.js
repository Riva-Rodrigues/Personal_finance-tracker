import { Bill } from '../models/bill.model.js';

export const createBill = async (req, res) => {
    try {
        const userId = req.user._id; 
        const newBill = new Bill({ ...req.body, userId });
        await newBill.save();
        res.status(201).json(newBill);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getBills = async (req, res) => {
    // console.log(req.user);
    try {
        const bills = await Bill.find({ userId: req.user._id });
        res.status(200).json(bills);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};


export const updateBill = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedBill = await Bill.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedBill) {
            return res.status(404).json({ message: 'Bill not found' });
        }
        res.status(200).json(updatedBill);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteBill = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedBill = await Bill.findByIdAndDelete(id);
        if (!deletedBill) {
            return res.status(404).json({ message: 'Bill not found' });
        }
        res.status(200).json({ message: 'Bill deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
