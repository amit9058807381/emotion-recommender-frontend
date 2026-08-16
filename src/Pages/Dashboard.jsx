import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, Camera, Video, Film, Music } from 'lucide-react';
import api from '../services/api';

const emotionColors = {
  Happiness: 'from-yellow-400 to-orange-400',
  Sadness: 'from-blue-400 to-indigo-500',
  Anger: 'from-red-400 to-rose-500',
  Fear: 'from-purple-400 to-violet-500',
  Surprise: 'from-pink-400 to-fuchsia-500',
  Neutral: 'from-teal-400 to-cyan-500',
};

const moodList = [
  { label: 'Happy', icon: '😊', color: 'bg-yellow-400' },
  { label: 'Sad', icon: '😢', color: 'bg-blue-400' },
  { label: 'Neutral', icon: '😐', color: 'bg-teal-400' },
  { label: 'Angry', icon: '😠', color: 'bg-red-400' },
  { label: 'Surprised', icon: '😮', color: 'bg-pink-400' },
];

const typeOptions = [
  { key: 'video', label: 'Video', icon: Video },
  { key: 'movie', label: 'Movie', icon: Film },
  { key: 'music', label: 'Music', icon: Music },
];

// Simple typewriter hook - reveals text character by character
function useTypewriter(text, speed = 35) {
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    setDisplayed('');
    if (!text) return;

    let i = 0;
    const interval = setInterval(() => {
      i += 1;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(interval);
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return displayed;
}

function Dashboard() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [emotion, setEmotion] = useState(null);
  const [contentType, setContentType] = useState('video');
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingRecs, setLoadingRecs] = useState(false);
  const [error, setError] = useState('');
  const [showWebcam, setShowWebcam] = useState(true);
  const navigate = useNavigate();

  const userId = localStorage.getItem('userId');
  const username = localStorage.getItem('username') || 'friend';

  const greetingText = emotion
    ? `Oh ${username}, you are ${emotion}! I have some movies, songs, books for you →`
    : `Hello, ${username} 👋`;

  const typedGreeting = useTypewriter(greetingText);

  const startWebcam = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = mediaStream;
      setStream(mediaStream);
    } catch (err) {
      setError('Could not access webcam');
    }
  };

  const captureAndDetect = async () => {
    setLoading(true);
    setError('');
    setRecommendations([]);

    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    const imageBase64 = canvas.toDataURL('image/jpeg').split(',')[1];

    try {
      const response = await api.post('/emotion/detect', {
        userId: parseInt(userId),
        imageBase64,
      });
      setEmotion(response.data.emotion);
      setShowWebcam(false);
      fetchRecommendations(response.data.emotion, contentType);
    } catch (err) {
      setError('Emotion detection failed');
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommendations = async (emotionValue, type) => {
    setLoadingRecs(true);
    try {
      const response = await api.get('/recommendations', {
        params: { userId, emotion: emotionValue, type },
      });
      setRecommendations(response.data);
    } catch (err) {
      setError('Could not load recommendations');
    } finally {
      setLoadingRecs(false);
    }
  };

  const handleTypeChange = (type) => {
    setContentType(type);
    if (emotion) fetchRecommendations(emotion, type);
  };

  const handleSelect = async (contentItem) => {
    try {
      await api.post('/recommendations/select', {
        userId: parseInt(userId),
        contentItemId: contentItem.id,
        emotion,
      });
      window.open(contentItem.url, '_blank');
    } catch (err) {
      console.error('Failed to record selection', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    navigate('/login');
  };

  const gradient = emotionColors[emotion] || 'from-purple-500 to-blue-500';

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <Link to="/" className="text-lg font-bold">
          <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Emoti</span>Recommend
        </Link>
        <div className="hidden md:flex gap-6 text-sm text-gray-300">
          <Link to="/" className="hover:text-white">Home</Link>
          <a href="/#features" className="hover:text-white">Features</a>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/20 text-sm hover:bg-white/5 transition"
        >
          <LogOut size={14} /> Logout
        </button>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {error && (
          <p className="bg-red-500/10 border border-red-500/30 text-red-300 text-sm rounded-lg px-4 py-2 mb-4">
            {error}
          </p>
        )}

        {/* Greeting card - always visible, text changes via typewriter */}
        <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-5 mb-6 text-center md:text-left">
          <p className="text-xl font-semibold min-h-[2rem]">
            {typedGreeting}
            <span className="inline-block w-0.5 h-5 bg-purple-400 ml-0.5 align-middle animate-pulse" />
          </p>
          {!emotion && (
            <p className="text-gray-400 text-sm mt-1">
              How are you feeling today? You can scan your emotion below
            </p>
          )}
        </div>

        {showWebcam ? (
          /* PRE-DETECTION LAYOUT: webcam center, mood list right */
          <div className="grid md:grid-cols-[auto_auto] gap-6 items-center justify-center">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 w-full md:w-96 mx-auto">
              <div className="relative rounded-xl overflow-hidden bg-black aspect-video">
                <video ref={videoRef} autoPlay className="w-full h-full object-cover" />
                {!stream && (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                    <Camera size={32} className="opacity-40" />
                  </div>
                )}
              </div>
              <canvas ref={canvasRef} className="hidden" />

              <div className="mt-4">
                {!stream ? (
                  <button
                    onClick={startWebcam}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium text-sm bg-gradient-to-r from-purple-500 to-blue-500 hover:opacity-90 transition"
                  >
                    <Camera size={16} /> Start Webcam
                  </button>
                ) : (
                  <button
                    onClick={captureAndDetect}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium text-sm bg-gradient-to-r from-purple-500 to-blue-500 hover:opacity-90 transition disabled:opacity-50"
                  >
                    <Camera size={16} /> {loading ? 'Detecting...' : 'Capture & Detect Emotion'}
                  </button>
                )}
              </div>
            </div>

            <div className="flex md:flex-col gap-3 justify-center md:items-end flex-wrap">
              {moodList.map((m) => (
                <div key={m.label} className="flex items-center gap-2">
                  <div className={`w-9 h-9 rounded-full ${m.color} flex items-center justify-center text-lg shadow`}>
                    {m.icon}
                  </div>
                  <span className="text-xs text-gray-400 hidden md:inline">{m.label}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            <canvas ref={canvasRef} className="hidden" />
            <button
              onClick={() => setShowWebcam(true)}
              className="mb-6 flex items-center gap-2 px-4 py-2 rounded-lg text-sm bg-gradient-to-r from-purple-500 to-blue-500 hover:opacity-90 transition"
            >
              <Camera size={16} /> Detect Again
            </button>

            {emotion && (
              <div>
                <div className={`bg-gradient-to-r ${gradient} rounded-xl px-4 py-3 mb-4 text-center font-medium`}>
                  Detected emotion: <span className="font-bold">{emotion}</span>
                </div>

                <div className="flex gap-2 mb-4">
                  {typeOptions.map(({ key, label, icon: Icon }) => (
                    <button
                      key={key}
                      onClick={() => handleTypeChange(key)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm border transition ${
                        contentType === key
                          ? 'bg-white/10 border-purple-400 text-white'
                          : 'border-white/10 text-gray-400 hover:bg-white/5'
                      }`}
                    >
                      <Icon size={14} /> {label}
                    </button>
                  ))}
                </div>

                {loadingRecs && <p className="text-sm text-gray-400 text-center py-4">Loading recommendations...</p>}

                <div className="grid gap-3">
                  {recommendations.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleSelect(item)}
                      className="flex gap-3 bg-white/5 border border-white/10 rounded-xl p-3 cursor-pointer hover:bg-white/10 transition"
                    >
                      <img
                        src={item.thumbnailUrl}
                        alt={item.title}
                        className="w-28 h-16 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">{item.title}</p>
                        <p className="text-xs text-gray-400 line-clamp-2 mt-1">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;