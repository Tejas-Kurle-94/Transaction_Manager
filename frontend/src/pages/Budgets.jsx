import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import api from '../services/api';

const Budgets = () => {
  const queryClient = useQueryClient();
  const [newBudget, setNewBudget] = useState({
    amount: '',
    category: '',
    startDate: '',
    endDate: ''
  });

  const { data: budgets, isLoading: isLoadingBudgets } = useQuery({
    queryKey: ['budgets'],
    queryFn: async () => {
      const response = await api.get('/budgets');
      return response.data;
    }
  });

  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await api.get('/categories');
      return response.data;
    }
  });

  const createMutation = useMutation({
    mutationFn: async (budgetData) => {
      const response = await api.post('/budgets', budgetData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['budgets']);
      setNewBudget({
        amount: '',
        category: '',
        startDate: '',
        endDate: ''
      });
      toast.success('Budget created successfully');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/budgets/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['budgets']);
      toast.success('Budget deleted successfully');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newBudget.amount || !newBudget.category || !newBudget.startDate || !newBudget.endDate) {
      toast.error('All fields are required');
      return;
    }
    createMutation.mutate({
      ...newBudget,
      amount: parseFloat(newBudget.amount)
    });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoadingBudgets || isLoadingCategories) return <div>Loading...</div>;

  const expenseCategories = categories?.filter(cat => cat.type === 'expense') || [];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Budget Management</h1>

      {/* Add Budget Form */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">Create New Budget</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={newBudget.category}
                onChange={(e) => setNewBudget({ ...newBudget, category: e.target.value })}
                className="w-full border rounded p-2"
              >
                <option value="">Select Category</option>
                {expenseCategories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount
              </label>
              <input
                type="number"
                step="0.01"
                value={newBudget.amount}
                onChange={(e) => setNewBudget({ ...newBudget, amount: e.target.value })}
                placeholder="Budget Amount"
                className="w-full border rounded p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={newBudget.startDate}
                onChange={(e) => setNewBudget({ ...newBudget, startDate: e.target.value })}
                className="w-full border rounded p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={newBudget.endDate}
                onChange={(e) => setNewBudget({ ...newBudget, endDate: e.target.value })}
                className="w-full border rounded p-2"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              {createMutation.isPending ? 'Creating...' : 'Create Budget'}
            </button>
          </div>
        </form>
      </div>

      {/* Budgets List */}
      <div className="bg-white rounded-lg shadow">
        <div className="grid grid-cols-5 gap-4 p-4 font-semibold border-b">
          <div>Category</div>
          <div>Amount</div>
          <div>Start Date</div>
          <div>End Date</div>
          <div>Actions</div>
        </div>
        <div className="divide-y">
          {budgets?.map((budget) => (
            <div key={budget._id} className="grid grid-cols-5 gap-4 p-4 items-center">
              <div>{budget.category.name}</div>
              <div>${budget.amount.toFixed(2)}</div>
              <div>{new Date(budget.startDate).toLocaleDateString()}</div>
              <div>{new Date(budget.endDate).toLocaleDateString()}</div>
              <div>
                <button
                  onClick={() => handleDelete(budget._id)}
                  disabled={deleteMutation.isPending}
                  className="text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Budgets;
