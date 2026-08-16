import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Film, Music, BookOpen, PlayCircle, Quote, Book, ChevronRight,
} from 'lucide-react';

const moods = [
  { label: 'Happy', icon: '😊', color: 'bg-yellow-400', position: 'top-0 left-1/2 -translate-x-1/2' },
  { label: 'Sad', icon: '😢', color: 'bg-blue-400', position: 'top-16 left-0' },
  { label: 'Relaxed', icon: '😌', color: 'bg-purple-400', position: 'top-16 right-0' },
  { label: 'Angry', icon: '😠', color: 'bg-red-400', position: 'bottom-16 left-4' },
  { label: 'Neutral', icon: '😐', color: 'bg-teal-400', position: 'bottom-16 right-4' },
];

const features = [
  { icon: Film, title: 'Movies', desc: 'Discover movies that match your mood', color: 'text-purple-400' },
  { icon: Music, title: 'Music', desc: 'Listen to songs that heal your emotions', color: 'text-pink-400' },
  { icon: BookOpen, title: 'Stories', desc: 'Read stories that inspire and relax', color: 'text-orange-400' },
  { icon: PlayCircle, title: 'Motivational Videos', desc: 'Watch videos that boost your mindset', color: 'text-green-400' },
  { icon: Quote, title: 'Quotes', desc: 'Find quotes that speak to your heart', color: 'text-yellow-400' },
  { icon: Book, title: 'Books', desc: 'Explore books that fit your feelings', color: 'text-blue-400' },
];

function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('token'));
  }, []);

  return (
    <div className="min-h-screen bg-[#000015] text-white flex flex-col">
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/10">
        <div className="text-xl font-bold">
          <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Emoti
          </span>
          Recommend
        </div>
        <div className="hidden md:flex gap-8 text-sm text-gray-300">
          <a href="#" className="text-white border-b-2 border-purple-400 pb-1">Home</a>
          <a href="#features" className="hover:text-white">Features</a>
        </div>
        <div className="flex gap-3">
          {isLoggedIn ? (
            <Link
              to="/dashboard"
              className="px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-purple-500 to-blue-500 hover:opacity-90"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="px-4 py-2 rounded-lg border border-white/20 text-sm hover:bg-white/5">
                Login
              </Link>
              <Link to="/register" className="px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-purple-500 to-blue-500 hover:opacity-90">
                Register
              </Link>
            </>
          )}
        </div>
      </nav>

      <section className="grid md:grid-cols-2 gap-10 items-center px-8 py-16 max-w-7xl mx-auto flex-1">
        <div>
          <span className="inline-block px-4 py-1.5 rounded-full text-xs tracking-wide bg-white/5 border border-white/10 text-gray-300 mb-6">
            AI POWERED &nbsp;·&nbsp; PERSONALIZED &nbsp;·&nbsp; EMOTION AWARE
          </span>
          <h1 className="text-5xl font-extrabold leading-tight mb-4">
            Feel Better.
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              We Recommend.
            </span>
          </h1>
          <p className="text-gray-400 mb-8 max-w-md">
            Our Emotion Based Recommendation System understands how you feel and
            suggests the perfect movies, music, stories, quotes, books and
            motivational videos for you.
          </p>
          <div className="flex gap-4">
            <Link
              to={isLoggedIn ? '/dashboard' : '/register'}
              className="flex items-center gap-1 px-6 py-3 rounded-lg font-medium bg-gradient-to-r from-purple-500 to-blue-500 hover:opacity-90"
            >
              {isLoggedIn ? 'Go to Dashboard' : 'Get Started'} <ChevronRight size={18} />
            </Link>
            <a href="#features" className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium border border-white/20 hover:bg-white/5">
              Learn More
            </a>
          </div>
        </div>

        <div className="relative h-96 flex items-center justify-center">
          <div className="w-56 h-56 rounded-full bg-gradient-to-br from-purple-600 via-violet-600 to-blue-600 flex items-center justify-center shadow-2xl shadow-purple-500/40 text-8xl">
            🎧😌
          </div>
          {moods.map((m) => (
            <div key={m.label} className={`absolute ${m.position} flex flex-col items-center gap-1`}>
              <div className={`w-14 h-14 rounded-full ${m.color} flex items-center justify-center text-2xl shadow-lg`}>
                {m.icon}
              </div>
              <span className="text-xs text-gray-300">{m.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section id="features" className="px-8 py-20 max-w-7xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-2">What We Recommend</h2>
        <p className="text-gray-400 mb-12">Personalized recommendations for every mood</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {features.map(({ icon: Icon, title, desc, color }) => (
            <div key={title} className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition">
              <Icon className={`mx-auto mb-3 ${color}`} size={32} />
              <h3 className="font-semibold mb-1">{title}</h3>
              <p className="text-xs text-gray-400">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-white/10 px-8 py-10 text-center text-sm text-gray-400">
        <div className="mb-3 text-lg font-bold text-white">
          <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Emoti</span>Recommend
        </div>
        <p>Emotion-Based Personalized Recommendation System · College Project</p>
        <p className="mt-2">© 2026 EmotiRecommend. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;