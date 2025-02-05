import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import api from '../services/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [timeframe, setTimeframe] = useState('month');

  const { data: transactions, isLoading: isLoadingTransactions } = useQuery({
    queryKey: ['transactions', timeframe],
    queryFn: async () => {
      const response = await api.get('/transactions', {
        params: {
          timeframe,
        },
      });
      return response.data;
    },
  });

  const { data: budgets, isLoading: isLoadingBudgets } = useQuery({
    queryKey: ['budgets'],
    queryFn: async () => {
      const response = await api.get('/budgets');
      return response.data;
    },
  });

  if (isLoadingTransactions || isLoadingBudgets) {
    return <div>Loading...</div>;
  }

  // Calculate total income and expenses
  const totalIncome = transactions
    ?.filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0) || 0;

  const totalExpenses = transactions
    ?.filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0) || 0;

  // Prepare data for the chart
  const chartData = {
    labels: ['Income', 'Expenses'],
    datasets: [
      {
        label: 'Amount ($)',
        data: [totalIncome, totalExpenses],
        backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(255, 99, 132, 0.2)'],
        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Income vs Expenses',
      },
    },
  };

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Summary Cards */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Total Income</h3>
          <p className="text-2xl text-green-600">${totalIncome.toFixed(2)}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Total Expenses</h3>
          <p className="text-2xl text-red-600">${totalExpenses.toFixed(2)}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Balance</h3>
          <p className={`text-2xl ${totalIncome - totalExpenses >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ${(totalIncome - totalExpenses).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="mb-4">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="border rounded p-2"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>
        <Bar data={chartData} options={chartOptions} />
      </div>

      {/* Budget Overview */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Budget Overview</h2>
        <div className="space-y-4">
          {budgets?.map((budget) => {
            const spent = transactions
              ?.filter(
                (t) =>
                  t.category === budget.category._id &&
                  t.type === 'expense'
              )
              .reduce((sum, t) => sum + t.amount, 0) || 0;
            
            const percentage = (spent / budget.amount) * 100;

            return (
              <div key={budget._id}>
                <div className="flex justify-between mb-1">
                  <span>{budget.category.name}</span>
                  <span>
                    ${spent.toFixed(2)} / ${budget.amount.toFixed(2)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full ${
                      percentage > 100
                        ? 'bg-red-600'
                        : percentage > 80
                        ? 'bg-yellow-400'
                        : 'bg-green-600'
                    }`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
