import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { getErrorMessage } from '../api/client';
import { LayoutDashboard } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-surface p-8 shadow-xl border border-gray-800">
        <div className="flex flex-col items-center">
          <div className="rounded-full bg-primary/20 p-3 text-primary mb-4">
            <LayoutDashboard size={32} />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Welcome back</h2>
          <p className="mt-2 text-sm text-gray-400">Sign in to your account</p>
        </div>

        {error && (
          <div className="rounded-md bg-red-500/10 p-4 border border-red-500/50">
            <p className="text-sm text-red-400 text-center">{error}</p>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">Email address</label>
              <input
                type="email"
                required
                className="mt-1 block w-full rounded-lg border border-gray-700 bg-background px-4 py-2.5 text-white placeholder-gray-500 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Password</label>
              <input
                type="password"
                required
                className="mt-1 block w-full rounded-lg border border-gray-700 bg-background px-4 py-2.5 text-white placeholder-gray-500 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group relative flex w-full justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface disabled:opacity-50 transition-colors"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-6">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="font-semibold text-primary hover:text-primary/80">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
