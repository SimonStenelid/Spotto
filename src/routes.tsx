import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import LandingPage from './pages/landing/LandingPage';
import Documentation from './pages/landing/Documentation';
import { Blog } from './pages/landing/Blog';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />
  },
  {
    path: '/documentation',
    element: <Documentation />
  },
  {
    path: '/blog',
    element: <Blog />
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