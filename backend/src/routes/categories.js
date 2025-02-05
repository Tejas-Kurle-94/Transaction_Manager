import express from 'express';
import Category from '../models/Category.js';

const router = express.Router();

/**
 * @swagger
 * /api/categories:
 *   get:
 *     tags: [Categories]
 *     description: Get all categories
 */
router.get('/', async (req, res, next) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/categories:
 *   post:
 *     tags: [Categories]
 *     description: Create a new category
 */
router.post('/', async (req, res, next) => {
  try {
    const { name, type } = req.body;

    const category = new Category({
      name,
      type
    });

    await category.save();
    res.status(201).json(category);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     tags: [Categories]
 *     description: Update a category
 */
router.put('/:id', async (req, res, next) => {
  try {
    const { name, type } = req.body;
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name, type },
      { new: true, runValidators: true }
    );
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    res.json(category);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     tags: [Categories]
 *     description: Delete a category
 */
router.delete('/:id', async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
