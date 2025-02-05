import express from 'express';
import Transaction from '../models/Transaction.js';

const router = express.Router();

/**
 * @swagger
 * /api/transactions:
 *   get:
 *     tags: [Transactions]
 *     description: Get transactions with filters
 */
router.get('/', async (req, res, next) => {
  try {
    const { type, startDate, endDate, category, search } = req.query;
    const query = {};

    if (type && type !== 'all') {
      query.type = type;
    }

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    if (category) {
      query.category = category;
    }

    if (search) {
      query.description = { $regex: search, $options: 'i' };
    }

    const transactions = await Transaction.find(query)
      .populate('category', 'name type')
      .sort({ date: -1 });

    res.json(transactions);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/transactions:
 *   post:
 *     tags: [Transactions]
 *     description: Create a new transaction
 */
router.post('/', async (req, res, next) => {
  try {
    const { amount, type, category, description, date } = req.body;

    const transaction = new Transaction({
      amount,
      type,
      category,
      description,
      date: date || new Date()
    });

    await transaction.save();
    await transaction.populate('category', 'name type');
    
    res.status(201).json(transaction);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/transactions/{id}:
 *   put:
 *     tags: [Transactions]
 *     description: Update a transaction
 */
router.put('/:id', async (req, res, next) => {
  try {
    const { amount, type, category, description, date } = req.body;
    
    const transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      { amount, type, category, description, date },
      { new: true, runValidators: true }
    ).populate('category', 'name type');

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.json(transaction);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/transactions/{id}:
 *   delete:
 *     tags: [Transactions]
 *     description: Delete a transaction
 */
router.delete('/:id', async (req, res, next) => {
  try {
    const transaction = await Transaction.findByIdAndDelete(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
