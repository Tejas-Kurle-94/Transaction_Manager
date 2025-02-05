import { Link, Outlet, useLocation } from 'react-router-dom';

const Layout = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'bg-blue-700' : '';
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <nav className="bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-xl font-bold">
                Transaction Manager
              </Link>
              <div className="hidden md:flex space-x-2">
                <Link
                  to="/"
                  className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 ${isActive(
                    '/'
                  )}`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/transactions"
                  className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 ${isActive(
                    '/transactions'
                  )}`}
                >
                  Transactions
                </Link>
                <Link
                  to="/categories"
                  className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 ${isActive(
                    '/categories'
                  )}`}
                >
                  Categories
                </Link>
                <Link
                  to="/budgets"
                  className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 ${isActive(
                    '/budgets'
                  )}`}
                >
                  Budgets
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
