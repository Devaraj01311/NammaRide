import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/forgot-password`, { email });
      setMessage(response.data.message);
      setEmail('');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='p-5 h-screen flex flex-col items-center'>
      <div className='w-full max-w-md'>
        <img className='w-28 mb-4 mx-auto ml-4' src="/image.png" alt="logo" />
        <form onSubmit={submitHandler} className='bg-white p-6 rounded '>
          <h3 className='text-lg font-medium mb-4 text-start'>Forgot Password :</h3>
          <input
            type='email'
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='Enter your email'
            className='bg-[#eeeeee] mb-4 rounded px-4 py-2 w-full text-lg'
          />
          <button
            type='submit'
            disabled={loading}
            className='bg-[#111] text-white font-semibold mb-3 rounded px-4 py-2 w-full text-lg'
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
          {message && <p className='text-center text-green-600 mt-2'>{message}</p>}
        </form>
        <p className='text-center -mt-3'>
          Remembered your password? <Link to='/login' className='text-blue-600'>Login</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
