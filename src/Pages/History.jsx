import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, ArrowLeft, Film, Music, Video } from 'lucide-react';
import api from '../services/api';

const emotionColors = {
  Happiness: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  Sadness: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  Anger: 'bg-red-500/20 text-red-300 border-red-500/30',
  Fear: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  Surprise: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
  Neutral: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
};

const typeIcons = { movie: Film, music: Music, video: Video };

function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get('/recommendations/history/' + userId);
        setHistory(response.data);
      } catch (err) {
        setError('Could not load history');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [userId]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    navigate('/login');
  };

  const grouped = history.reduce((acc, item) => {
    const key = item.emotion || 'Unknown';
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <Link to="/" className="text-lg font-bold">
          <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Emoti</span>Recommend
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/20 text-sm hover:bg-white/5 transition"
        >
          <LogOut size={14} /> Logout
        </button>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <Link to="/dashboard" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-6 w-fit">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>

        <h1 className="text-2xl font-bold mb-6">Your History</h1>

        {error && (
          <p className="bg-red-500/10 border border-red-500/30 text-red-300 text-sm rounded-lg px-4 py-2 mb-4">
            {error}
          </p>
        )}

        {loading && <p className="text-gray-400 text-center py-8">Loading history...</p>}

        {!loading && history.length === 0 && (
          <p className="text-gray-400 text-center py-8">
            No history yet — go detect your emotion and play something!
          </p>
        )}

        {Object.entries(grouped).map(([emotion, items]) => (
          <div key={emotion} className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <span className={'px-3 py-1 rounded-full text-sm font-medium border ' + (emotionColors[emotion] || 'bg-white/10 text-gray-300 border-white/20')}>
                {emotion}
              </span>
              <span className="text-xs text-gray-500">{items.length} item{items.length > 1 ? 's' : ''}</span>
            </div>

            <div className="grid gap-3">
              {items.map((item, idx) => {
                const Icon = typeIcons[item.type] || Video;
                return (
                  <a
                    key={idx}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex gap-3 bg-white/5 border border-white/10 rounded-xl p-3 hover:bg-white/10 transition"
                  >
                    <img
                      src={item.thumbnailUrl}
                      alt={item.title}
                      className="w-28 h-16 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm truncate">{item.title}</p>
                      <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-1">
                        <Icon size={12} />
                        <span className="capitalize">{item.type}</span>
                        {item.watchedAt && (
                          <span>· {new Date(item.watchedAt).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default History;