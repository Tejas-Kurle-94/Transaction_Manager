import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import { DarkModeProvider } from './context/DarkModeContext';
import Navbar from './components/Navbar';
import Transactions from './pages/Transactions';
import AddTransaction from './pages/AddTransaction';
import Categories from './pages/Categories';
import 'react-toastify/dist/ReactToastify.css';

const queryClient = new QueryClient();

function App() {
  return (
    <DarkModeProvider>
      <QueryClientProvider client={queryClient}>
        <Router>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<Transactions />} />
                <Route path="/transactions" element={<Transactions />} />
                <Route path="/transactions/add" element={<AddTransaction />} />
                <Route path="/categories" element={<Categories />} />
              </Routes>
            </main>
            <ToastContainer
              position="bottom-right"
              theme="colored"
              autoClose={3000}
            />
          </div>
        </Router>
      </QueryClientProvider>
    </DarkModeProvider>
  );
}

export default App;
