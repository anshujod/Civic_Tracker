import { Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import CreateIssue from './pages/CreateIssue.jsx';
import IssuesList from './pages/IssuesList.jsx';
import IssueDetail from './pages/IssueDetail.jsx';
import DarkModeToggle from './components/DarkModeToggle';

function useAuth() {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  return { token, user: user ? JSON.parse(user) : null };
}

function Protected({ children, roles }) {
  const { token, user } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  if (roles && user && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  const { token, user } = useAuth();
  const nav = useNavigate();

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-4">
          <Link to="/" className="font-semibold text-brand-600">Civic Tracker</Link>
          {token && (
            <Link to="/create" className="text-sm text-gray-600 hover:text-gray-900">
              Report Issue
            </Link>
          )}
          <div className="ml-auto flex items-center gap-3">
            {token ? (
              <>
                <span className="text-sm text-gray-600 hidden sm:inline">
                  {user?.name} ({user?.role})
                </span>
                <button
                  onClick={() => { localStorage.clear(); nav('/'); }}
                  className="px-3 py-1.5 text-sm rounded-md bg-gray-100 hover:bg-gray-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link className="px-3 py-1.5 text-sm rounded-md bg-brand-500 text-white hover:bg-brand-600" to="/login">Login</Link>
                <Link className="px-3 py-1.5 text-sm rounded-md bg-gray-800 text-white hover:bg-black" to="/register">Register</Link>
              </>
            )}
          </div>
        </div>
      </header>
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b dark:bg-gray-900/70 dark:border-gray-800">
  <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-4">
    <Link to="/" className="font-semibold text-brand-600 dark:text-white">Civic Tracker</Link>
    {token && (
      <Link to="/create" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
        Report Issue
      </Link>
    )}
    <div className="ml-auto flex items-center gap-3">
      <DarkModeToggle />
      {token ? (
        <>
          <span className="text-sm text-gray-600 hidden sm:inline dark:text-gray-300">
            {user?.name} ({user?.role})
          </span>
          <button
            onClick={() => { localStorage.clear(); nav('/'); }}
            className="px-3 py-1.5 text-sm rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white"
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <Link className="px-3 py-1.5 text-sm rounded-md bg-brand-500 text-white hover:bg-brand-600" to="/login">Login</Link>
          <Link className="px-3 py-1.5 text-sm rounded-md bg-gray-800 text-white hover:bg-black" to="/register">Register</Link>
        </>
      )}
    </div>
  </div>
</header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        <Routes>
          <Route path="/" element={<IssuesList />} />
          <Route path="/issue/:id" element={<IssueDetail />} />
          <Route path="/create" element={<Protected><CreateIssue /></Protected>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>

      <footer className="border-t mt-8">
        <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-gray-500">
          © {new Date().getFullYear()} Civic Tracker
        </div>
      </footer>
    </div>
  );
}