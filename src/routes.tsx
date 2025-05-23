import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import LandingPage from './pages/landing/LandingPage';
import Documentation from './pages/landing/Documentation';
import { Blog } from './pages/landing/Blog';
import { PaymentSuccess } from './pages/payment/PaymentSuccess';
import { PaymentCanceled } from './pages/payment/PaymentCanceled';
import AuthCallback from './pages/auth/AuthCallback';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';

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
    path: '/privacy-policy',
    element: <PrivacyPolicy />
  },
  {
    path: '/terms-of-service',
    element: <TermsOfService />
  },
  {
    path: '/auth/callback',
    element: <AuthCallback />
  },
  {
    path: '/app/*',
    element: <App />
  },
  {
    path: '/payment/success',
    element: <PaymentSuccess />
  },
  {
    path: '/payment/canceled',
    element: <PaymentCanceled />
  },
  {
    path: '*',
    element: <LandingPage />
  }
]); 