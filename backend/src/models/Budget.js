import mongoose from 'mongoose';

const budgetSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

// Index for better query performance
budgetSchema.index({ category: 1 });
budgetSchema.index({ startDate: 1, endDate: 1 });

const Budget = mongoose.model('Budget', budgetSchema);

export default Budget;
