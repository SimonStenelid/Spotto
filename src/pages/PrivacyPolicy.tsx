import React from 'react';
import { Link } from 'react-router-dom';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center text-[#8B5CF6] hover:text-[#7C3AED] transition-colors"
          >
            ← Back to Home
          </Link>
        </div>

        <div className="prose prose-lg max-w-none">
          <div className="flex items-center gap-3 mb-8">
            <img src="/favicon.svg" alt="Spotto" className="w-8 h-8" />
            <h1 className="text-3xl font-bold text-[#0f0f0f] m-0">Privacy Policy</h1>
          </div>
          
          <p className="text-gray-600 mb-8">
            <strong>Last updated:</strong> {new Date().toLocaleDateString()}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[#0f0f0f] mb-4">1. Information We Collect</h2>
            <p className="text-gray-700 mb-4">
              When you use Spotto, we collect information to provide you with the best travel discovery experience:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>Account Information:</strong> Email address, name, and profile details when you create an account</li>
              <li><strong>Usage Data:</strong> How you interact with our platform, places you view and bookmark</li>
              <li><strong>Location Data:</strong> General location information to provide relevant travel recommendations</li>
              <li><strong>Payment Information:</strong> Processed securely through Stripe for premium features</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[#0f0f0f] mb-4">2. How We Use Your Information</h2>
            <p className="text-gray-700 mb-4">We use your information to:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Provide personalized travel recommendations and place discoveries</li>
              <li>Maintain and improve our service quality</li>
              <li>Process payments for premium features</li>
              <li>Send important updates about your account and our service</li>
              <li>Ensure platform security and prevent fraud</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[#0f0f0f] mb-4">3. Information Sharing</h2>
            <p className="text-gray-700 mb-4">
              We respect your privacy and do not sell your personal information. We may share information only in these limited circumstances:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>With your explicit consent</li>
              <li>To comply with legal obligations</li>
              <li>With trusted service providers (like Stripe for payments) under strict confidentiality agreements</li>
              <li>To protect our rights and prevent fraud</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[#0f0f0f] mb-4">4. Data Security</h2>
            <p className="text-gray-700">
              We implement industry-standard security measures to protect your personal information, including encryption, 
              secure servers, and regular security audits. However, no method of transmission over the internet is 100% secure.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[#0f0f0f] mb-4">5. Your Rights</h2>
            <p className="text-gray-700 mb-4">You have the right to:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Access and update your personal information</li>
              <li>Delete your account and associated data</li>
              <li>Opt out of non-essential communications</li>
              <li>Request a copy of your data</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[#0f0f0f] mb-4">6. Cookies and Tracking</h2>
            <p className="text-gray-700">
              We use cookies and similar technologies to enhance your experience, remember your preferences, 
              and analyze how our service is used. You can control cookie settings through your browser.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[#0f0f0f] mb-4">7. Changes to This Policy</h2>
            <p className="text-gray-700">
              We may update this Privacy Policy from time to time. We will notify you of any material changes 
              by posting the new policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibent text-[#0f0f0f] mb-4">8. Contact Us</h2>
            <p className="text-gray-700">
              If you have any questions about this Privacy Policy or how we handle your data, please contact us at:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg mt-4">
              <p className="text-gray-700 m-0">
                <strong>Email:</strong> privacy@spotto.app<br />
                <strong>Website:</strong> https://spotto-iota.vercel.app
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
} 