import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/auth/reset-password`, {
        email,
        token,
        newPassword
      });
      setMessage(response.data.message);
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => navigate('/login'), 2000); // Redirect to login
    } catch (err) {
      setMessage(err.response?.data?.message || 'Server error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token || !email) {
      setMessage("Invalid or missing reset link.");
    }
  }, [token, email]);

  return (
    <div className='p-5 h-screen flex flex-col  items-center'>
      <div className='w-full max-w-md'>
        <img className='w-28 mb-4 ml-5 mx-auto' src="/image.png" alt="logo" />
        <form onSubmit={submitHandler} className='bg-white p-6 rounded'>
          <h3 className='text-lg font-medium mb-4  ml-2 text-start'>Reset Password</h3>
          <input
            type='password'
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder='New password'
            className='bg-[#eeeeee] mb-4 rounded px-4 py-2 w-full text-lg'
          />
          <input
            type='password'
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder='Confirm new password'
            className='bg-[#eeeeee] mb-4 rounded px-4 py-2 w-full text-lg'
          />
          <button
            type='submit'
            disabled={loading}
            className='bg-[#111] text-white font-semibold mb-3 rounded px-4 py-2 w-full text-lg'
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
          {message && <p className='text-center text-green-600 mt-2'>{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
