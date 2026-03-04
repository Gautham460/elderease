import { useNavigate } from 'react-router-dom';
import { Heart, Shield, Clock, Users } from 'lucide-react';
import { useEffect, useState } from 'react';

export function WelcomePage() {
  const navigate = useNavigate();
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    setAnimated(true);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Beautiful gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
        {/* Animated circles for visual effect */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-indigo-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        {/* App Logo - Fade in + Scale */}
        <div 
          className={`mb-8 transition-all duration-1000 ease-out ${animated ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}
        >
          <div className="w-32 h-32 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center border border-white/20 shadow-2xl animate-bounce" style={{ animationDuration: '2s' }}>
            <Heart className="w-16 h-16 text-pink-400 animate-pulse" />
          </div>
        </div>

        {/* App Name - Slide down */}
        <h1 
          className={`text-5xl md:text-6xl font-bold text-white mb-4 text-center transition-all duration-1000 delay-300 ease-out ${animated ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}
        >
          ElderEase
        </h1>
        
        {/* Tagline - Slide up */}
        <p 
          className={`text-xl md:text-2xl text-purple-200 mb-8 text-center transition-all duration-1000 delay-500 ease-out ${animated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          Your Companion for Golden Years
        </p>

        {/* Short Preview - Staggered fade in */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 max-w-3xl">
          <div 
            className={`bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 transition-all duration-700 delay-700 ease-out ${animated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          >
            <Shield className="w-8 h-8 text-green-400 mx-auto mb-2 animate-pulse" style={{ animationDelay: '0.5s' }} />
            <p className="text-white text-center text-sm">Emergency SOS</p>
          </div>
          <div 
            className={`bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 transition-all duration-700 delay-900 ease-out ${animated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          >
            <Clock className="w-8 h-8 text-blue-400 mx-auto mb-2 animate-pulse" style={{ animationDelay: '1s' }} />
            <p className="text-white text-center text-sm">Medication Reminders</p>
          </div>
          <div 
            className={`bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 transition-all duration-700 delay-1100 ease-out ${animated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          >
            <Users className="w-8 h-8 text-pink-400 mx-auto mb-2 animate-pulse" style={{ animationDelay: '1.5s' }} />
            <p className="text-white text-center text-sm">Caregiver Support</p>
          </div>
        </div>

        {/* Login Button - Fade in with scale */}
        <button
          onClick={() => navigate('/login')}
          className={`px-10 py-4 bg-white text-purple-900 font-semibold text-lg rounded-full 
                     hover:bg-purple-100 transition-all duration-300 transform hover:scale-105 
                     shadow-lg hover:shadow-xl flex items-center gap-2
                     transition-all duration-1000 delay-1300 ease-out ${animated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          Get Started
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 animate-bounce" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>

        {/* Footer - Fade in */}
        <p 
          className={`text-white/50 mt-8 text-sm transition-all duration-1000 delay-1500 ease-out ${animated ? 'opacity-100' : 'opacity-0'}`}
        >
          © 2024 ElderEase. Made with love for our elders.
        </p>
      </div>
    </div>
  );
}
