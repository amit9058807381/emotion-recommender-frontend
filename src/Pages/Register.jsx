import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Smile } from 'lucide-react';
import api from '../services/api';

function Register() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await api.post('/auth/register', formData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', response.data.userId);
      localStorage.setItem('username', response.data.username);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white flex items-start justify-center px-4 py-6 sm:pt-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-4">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center mx-auto mb-2 shadow-lg shadow-purple-500/30">
            <Smile size={20} />
          </div>
          <h1 className="text-lg font-bold">
            Create your <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">EmotiRecommend</span> account
          </h1>
          <p className="text-gray-400 text-xs mt-1">Start getting recommendations that match your mood</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 shadow-xl">
          {error && (
            <p className="bg-red-500/10 border border-red-500/30 text-red-300 text-xs rounded-lg px-3 py-2 mb-3">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-2.5">
            <div>
              <label className="text-xs text-gray-300 mb-1 block">Username</label>
              <input
                type="text" name="username" placeholder="Your name"
                value={formData.username} onChange={handleChange} required
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-purple-400 transition"
              />
            </div>
            <div>
              <label className="text-xs text-gray-300 mb-1 block">Email</label>
              <input
                type="email" name="email" placeholder="you@example.com"
                value={formData.email} onChange={handleChange} required
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-purple-400 transition"
              />
            </div>
            <div>
              <label className="text-xs text-gray-300 mb-1 block">Password</label>
              <input
                type="password" name="password" placeholder="••••••••"
                value={formData.password} onChange={handleChange} required
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-purple-400 transition"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 rounded-lg font-medium text-sm bg-gradient-to-r from-purple-500 to-blue-500 hover:opacity-90 transition"
            >
              Register
            </button>
          </form>

          <div className="flex items-center gap-3 my-3">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-gray-500">OR</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          
           <a href="http://localhost:8081/oauth2/authorization/google"
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-white/20 hover:bg-white/5 transition text-xs"
          >
            <svg width="16" height="16" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
              <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
              <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
              <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
            </svg>
            Continue with Google
          </a>

          <p className="text-center text-xs text-gray-400 mt-3">
            Already have an account?{' '}
            <Link to="/login" className="text-purple-400 hover:underline">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;