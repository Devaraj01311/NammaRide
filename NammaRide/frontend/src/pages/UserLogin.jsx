import React from 'react'
import { Link, Route } from 'react-router-dom'
import { UserDataContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { useState,useContext } from 'react';
import axios from 'axios';

const UserLogin = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [userData, setUserData] = React.useState({});

  const { user, setUser } = React.useContext(UserDataContext);
  const navigate = useNavigate();



  const submitHandler = async (e) => {
    e.preventDefault();
    const userData = {
      email: email,
      password: password
  }

  const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/login`, userData)

  if (response.status === 200) {
    const data = response.data 
    setUser(data.user)
    localStorage.setItem('token', data.token)
    navigate('/home')
  }
    setEmail('')
    setPassword('')
  }
  return (
    <div className='p-5 h-screen flex flex-col justify-between'>
      <div>
        <img className='w-28 mb-1 top-0' src="/image.png" alt="logo" />
      <form onSubmit={(e)=>{
        submitHandler(e)
      }}>
        <h3 className='text-lg font-medium mb-2'>What's your email</h3>
        <input
         required 
         value={email}
         onChange={(e) => setEmail(e.target.value)}
         className='bg-[#eeeeee] mb-7 rounded px-4 py-2 border w-full text-lg placeholder:text-base'
         type='email' 
         placeholder='email@examples.com' 
         />
        <h3 className='text-lg font-medium mb-2'>Enter password</h3>
        <input 
        required
        value={password}
         onChange={(e) => setPassword(e.target.value)}
        className='bg-[#eeeeee] mb-7 rounded px-4 py-2 border w-full text-lg placeholder:text-base'
         type='password' 
         placeholder='password' 
         />
          <p className='text-end mb-5 ml-2 -mt-5'>
         <Link to='/forgot-password' className='text-blue-600'>Forgot Password?</Link>
         </p>
        <button
        className='bg-[#111] text-white font-semibold mb-3 rounded px-4 py-2  w-full text-lg placeholder:text-base'
        >Login</button>
        <p className='text-center'>New here? <Link to='/signup' className='text-blue-600'>Create new Account</Link></p>
      </form>
      </div>
      <div>
         <Link
         to ='/captain-login'
        className='bg-[#d0db9b] flex items-center justify-center text-white font-semibold mb-5 rounded px-4 py-2  w-full text-lg placeholder:text-base'
        >Sign in as Captain</Link>
      </div>
    </div>
  )
}

export default UserLogin