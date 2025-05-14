import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../store/useAuthStore';

interface NavigationProps {
  onMapClick: () => void;
}

export function Navigation({ onMapClick }: NavigationProps) {
  const navigate = useNavigate();
  const { authState } = useAuthStore();

  const handleMapClick = () => {
    navigate('/app');
  };

  const handleSignUpClick = () => {
    navigate('/app/signup');
  };

  return (
    <nav className="w-full px-20 py-5 bg-white">
      <div className="max-w-[1240px] mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="bg-black rounded-lg w-9 h-9 flex items-center justify-center">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <span className="text-black font-semibold text-xl">Spotto</span>
        </div>

        {/* Nav Links */}
        <div className="flex gap-10">
          <a href="#features" className="text-gray-700 font-medium text-base hover:text-black transition-colors">Features</a>
          <a href="#pricing" className="text-gray-700 font-medium text-base hover:text-black transition-colors">Pricing</a>
          <span 
            onClick={() => navigate('/documentation')} 
            className="text-gray-700 font-medium text-base hover:text-black transition-colors cursor-pointer"
          >
            Documentation
          </span>
          <a href="#blog" className="text-gray-700 font-medium text-base hover:text-black transition-colors">Blog</a>
        </div>

        {/* CTA Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleMapClick}
            className="px-8 py-3 rounded-full border border-gray-200 font-semibold text-base hover:bg-gray-50 transition-colors"
          >
            Map
          </button>
          <button 
            onClick={handleSignUpClick}
            className="px-8 py-3 rounded-full bg-black text-white font-semibold text-base hover:bg-black/90 transition-colors"
          >
            Sign Up
          </button>
        </div>
      </div>
    </nav>
  );
} 