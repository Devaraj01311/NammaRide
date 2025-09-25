import React from 'react'
import { Link, Route } from 'react-router-dom'

const CaptainSignup = () => {
   const [email, setEmail] = React.useState(''); 
    const [password, setPassword] = React.useState('');
    const [userData, setUserData] = React.useState({});
    const [firstName, setFirstName] = React.useState('');
    const [lastName, setLastName] = React.useState('');
    const submitHandler = (e) => {
      e.preventDefault()
      setUserData({
        fullName:{
          firstName: firstName,
          lastName: lastName
        },
        password: password,
        email: email
      })

      setEmail('')
      setPassword('')
      setFirstName('')  
      setLastName('')
    }
  return (
       <div>
       <div className='py-5 px-5 h-screen flex flex-col justify-between'>
      <div>
         <img className='w-20 mb-3' src="https://logos-world.net/wp-content/uploads/2020/05/Uber-Emblem.png" alt="" />
      <form onSubmit={(e)=>{
        submitHandler(e)
      }}>
        <h3 className='text-lg font-medium mb-2'>What's our captain's name</h3>
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

        <h3 className='text-lg font-medium mb-2'>What's our captain's email</h3>
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
        >Login</button>
        <p className='text-center'>Already have a account? <Link to='/captain-login' className='text-blue-600'>Login here</Link></p>
      </form>
      </div>
      <div>
         <p className='text-[10px] leading-tight'>
          This site is protected by reCAPTCHA and the <span className='underline'>Google Privacy Policy</span> and <span className='underline'>Terms of Service </span>apply.
         </p>
      </div>
    </div>
    </div>
  )
}

export default CaptainSignup