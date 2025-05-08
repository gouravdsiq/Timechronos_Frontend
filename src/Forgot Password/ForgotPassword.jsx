import React, { useState } from 'react';
import axiosInstance from '../axios/config';

const ForgotPassword = ({ switchView }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setMessage('Please enter your email address');
      setMessageType('error');
      return;
    }

    setIsSubmitting(true);
    setMessage('');

    try {
      // Send password reset request to backend
      const response = await axiosInstance.post('/forgot-password', { email });
      console.log('Password reset response:', response.data);
      setMessage('If an account exists with this email, you will receive password reset instructions.');
      setMessageType('success');
    } catch (err) {
      console.error('Password reset error:', err);
      // We still show a generic message even on error for security reasons
      setMessage('If an account exists with this email, you will receive password reset instructions.');
      setMessageType('success');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    // Added a container div with flex centering classes
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Reset Your Password</h1>
        <p className="text-gray-600 mb-6">
          Enter your email address and we'll send you instructions to reset your password.
        </p>

        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="your@email.com"
              required
            />
          </div>

          {message && (
            <div className={`p-3 rounded-md ${
              messageType === 'success' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            }`}>
              {message}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`w-full py-3 font-medium rounded-md shadow-md transition duration-200 ${
              isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isSubmitting ? 'SENDING...' : 'SEND RESET LINK'}
          </button>
        </div>

        <div className="mt-6 flex items-center">
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={() => switchView("login")}
            className="text-blue-600 hover:underline text-sm"
          >
            Return to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;