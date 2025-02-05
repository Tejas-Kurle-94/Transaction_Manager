import express from 'express';
import Budget from '../models/Budget.js';

const router = express.Router();

/**
 * @swagger
 * /api/budgets:
 *   get:
 *     tags: [Budgets]
 *     description: Get all budgets
 */
router.get('/', async (req, res, next) => {
  try {
    const budgets = await Budget.find()
      .populate('category', 'name type');
    res.json(budgets);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/budgets:
 *   post:
 *     tags: [Budgets]
 *     description: Create a new budget
 */
router.post('/', async (req, res, next) => {
  try {
    const { amount, category, startDate, endDate } = req.body;

    const budget = new Budget({
      amount,
      category,
      startDate,
      endDate
    });

    await budget.save();
    await budget.populate('category', 'name type');
    
    res.status(201).json(budget);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/budgets/{id}:
 *   put:
 *     tags: [Budgets]
 *     description: Update a budget
 */
router.put('/:id', async (req, res, next) => {
  try {
    const { amount, category, startDate, endDate } = req.body;
    
    const budget = await Budget.findByIdAndUpdate(
      req.params.id,
      { amount, category, startDate, endDate },
      { new: true, runValidators: true }
    ).populate('category', 'name type');

    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    res.json(budget);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/budgets/{id}:
 *   delete:
 *     tags: [Budgets]
 *     description: Delete a budget
 */
router.delete('/:id', async (req, res, next) => {
  try {
    const budget = await Budget.findByIdAndDelete(req.params.id);

    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
