import React from 'react';
import { Link } from 'react-router-dom';

export default function TermsOfService() {
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
            <h1 className="text-3xl font-bold text-[#0f0f0f] m-0">Terms of Service</h1>
          </div>
          
          <p className="text-gray-600 mb-8">
            <strong>Last updated:</strong> {new Date().toLocaleDateString()}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[#0f0f0f] mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700">
              By accessing and using Spotto, you accept and agree to be bound by the terms and provision of this agreement. 
              If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[#0f0f0f] mb-4">2. Description of Service</h2>
            <p className="text-gray-700 mb-4">
              Spotto is a travel discovery platform that helps users find and explore unique places and experiences. 
              Our service includes:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Curated travel destination recommendations</li>
              <li>Place discovery and booking features</li>
              <li>User profiles and social features</li>
              <li>Premium subscription services</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[#0f0f0f] mb-4">3. User Accounts</h2>
            <p className="text-gray-700 mb-4">
              To access certain features of Spotto, you must create an account. You agree to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Provide accurate and complete information</li>
              <li>Keep your account information updated</li>
              <li>Maintain the security of your account credentials</li>
              <li>Accept responsibility for all activities under your account</li>
              <li>Notify us immediately of any unauthorized use</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[#0f0f0f] mb-4">4. Acceptable Use</h2>
            <p className="text-gray-700 mb-4">You agree not to use Spotto to:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe on intellectual property rights</li>
              <li>Upload harmful, offensive, or inappropriate content</li>
              <li>Spam, harass, or abuse other users</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Use automated tools to access our service without permission</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[#0f0f0f] mb-4">5. Premium Services and Payments</h2>
            <p className="text-gray-700 mb-4">
              Spotto offers premium features through paid subscriptions:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Payments are processed securely through Stripe</li>
              <li>Subscriptions automatically renew unless cancelled</li>
              <li>Refunds are handled according to our refund policy</li>
              <li>Premium features are subject to availability</li>
              <li>Prices may change with reasonable notice</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[#0f0f0f] mb-4">6. Content and Intellectual Property</h2>
            <p className="text-gray-700 mb-4">
              Spotto and its content are protected by intellectual property laws:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Spotto owns all rights to the platform and its original content</li>
              <li>You retain rights to content you upload, but grant us license to use it</li>
              <li>You may not copy, modify, or distribute our content without permission</li>
              <li>User-generated content must not infringe on third-party rights</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[#0f0f0f] mb-4">7. Privacy and Data</h2>
            <p className="text-gray-700">
              Your privacy is important to us. Please review our Privacy Policy to understand how we collect, 
              use, and protect your information. By using Spotto, you consent to our data practices as described 
              in our Privacy Policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[#0f0f0f] mb-4">8. Disclaimers and Limitations</h2>
            <p className="text-gray-700 mb-4">
              Spotto is provided "as is" without warranties of any kind:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>We do not guarantee uninterrupted or error-free service</li>
              <li>Travel information may not always be current or accurate</li>
              <li>We are not responsible for third-party services or content</li>
              <li>Your use of the service is at your own risk</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[#0f0f0f] mb-4">9. Termination</h2>
            <p className="text-gray-700">
              We may terminate or suspend your account at any time for violations of these terms. 
              You may also delete your account at any time. Upon termination, your right to use 
              Spotto will cease immediately.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[#0f0f0f] mb-4">10. Changes to Terms</h2>
            <p className="text-gray-700">
              We reserve the right to modify these terms at any time. We will notify users of 
              material changes via email or through the platform. Continued use after changes 
              constitutes acceptance of the new terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[#0f0f0f] mb-4">11. Contact Information</h2>
            <p className="text-gray-700">
              If you have questions about these Terms of Service, please contact us:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg mt-4">
              <p className="text-gray-700 m-0">
                <strong>Email:</strong> legal@spotto.app<br />
                <strong>Website:</strong> https://spotto-iota.vercel.app
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
} 