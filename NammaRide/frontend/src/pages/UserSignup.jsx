import React from 'react'
import { Link, useNavigate, Route } from 'react-router-dom'
import axios from 'axios';
import { UserDataContext } from '../context/UserContext'



const UserSignup = () => {
  const [email, setEmail] = React.useState(''); 
  const [password, setPassword] = React.useState('');
  const [userData, setUserData] = React.useState({});
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');

  const navigate = useNavigate()

  const { user, setUser} = React.useContext(UserDataContext)

  const submitHandler = async (e) => {
    e.preventDefault()
    const newUser = {
      fullname:{
        firstname: firstName,
        lastname: lastName
      },
      password: password,
      email: email
    }
    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/register`, newUser)

    if (response.status === 201) {
      const data = response.data
      setUser(data.user)
      localStorage.setItem('token', data.token)
      navigate('/home')
    }
    console.log(userData)
    setEmail('')
    setPassword('')
    setFirstName('')  
    setLastName('')
  }
  return (
    <div>
       <div className='p-7 h-screen flex flex-col justify-between'>
      <div>
        <img className='w-28 mb-3' src="/image.png" alt="logo" />
      <form onSubmit={(e)=>{
        submitHandler(e)
      }}>
        <h3 className='text-lg font-medium mb-2'>What's your name</h3>
        <div className='flex gap-4 mb-6'>
             <input
         required 
         className='bg-[#eeeeee] w-1/2  rounded px-4 py-2 border  text-lg placeholder:text-base'
         type='text' 
         placeholder='first name' 
         value={firstName}
         onChange={(e)=>{
          setFirstName(e.target.value)
         }}
         />
            <input
         required 
         className='bg-[#eeeeee] w-1/2  rounded px-4 py-2 border  text-lg placeholder:text-base'
         type='text' 
         placeholder='last name' 
           value={lastName}
         onChange={(e)=>{
          setLastName(e.target.value)
         }}
         />
        </div>

        <h3 className='text-lg font-medium mb-2'>What's your email</h3>
        <input
         required 
         className='bg-[#eeeeee] mb-6 rounded px-4 py-2 border w-full text-lg placeholder:text-base'
         type='email' 
         placeholder='email@examples.com' 
           value={email}
         onChange={(e)=>{
          setEmail(e.target.value)
         }}
         />
        <h3 className='text-lg font-medium mb-2'>Enter password</h3>
        <input 
        required
        className='bg-[#eeeeee] mb-6 rounded px-4 py-2 border w-full text-lg placeholder:text-base'
         type='password' 
         placeholder='password' 
          value={password}
         onChange={(e)=>{
          setPassword(e.target.value)
         }}
         />
        <button
        className='bg-[#111] text-white font-semibold mb-3 rounded px-4 py-2  w-full text-lg placeholder:text-base'
        >Create account</button>
        <p className='text-center'>Already have a account? <Link to='/login' className='text-blue-600'>Login here</Link></p>
      </form>
      </div>
      <div>
         <p className='text-[10px] leading-tight'>
          By proceeding, you consent to get calls, WhatsApp or SMS messages, including by automated means, from Uber and its affiliates to the number provided.
         </p>
      </div>
    </div>
    </div>
  )
}

export default UserSignup