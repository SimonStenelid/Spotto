import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import LandingPage from './pages/landing/LandingPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />
  },
  {
    path: '/app/*',
    element: <App />
  },
  {
    path: '*',
    element: <LandingPage />
  }
]); 