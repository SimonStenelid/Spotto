import { Link, useLocation } from 'react-router-dom';

interface AuthTabsProps {
  className?: string;
}

export function AuthTabs({ className = '' }: AuthTabsProps) {
  const location = useLocation();
  const isLoginActive = location.pathname === '/app/login';

  return (
    <div className={`relative flex border-b border-[#e5e5e5] ${className}`}>
      <Link 
        to="/app/login"
        className={`w-1/2 pb-2.5 sm:pb-3 text-center text-sm sm:text-base font-medium transition-colors duration-200 ${
          isLoginActive ? 'text-[#0f0f0f]' : 'text-[#666666] hover:text-[#333333]'
        }`}
      >
        Log In
      </Link>
      <Link 
        to="/app/signup"
        className={`w-1/2 pb-2.5 sm:pb-3 text-center text-sm sm:text-base font-medium transition-colors duration-200 ${
          !isLoginActive ? 'text-[#0f0f0f]' : 'text-[#666666] hover:text-[#333333]'
        }`}
      >
        Sign Up
      </Link>
      {/* Animated underline */}
      <div 
        className="absolute bottom-0 w-1/2 h-0.5 bg-[#0f0f0f] transition-transform duration-300 ease-in-out"
        style={{ 
          transform: `translateX(${isLoginActive ? '0%' : '100%'})` 
        }}
      />
    </div>
  );
} 