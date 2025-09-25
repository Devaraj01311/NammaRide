import React from 'react'
import { Link, Route } from 'react-router-dom'
import { CaptainDataContext } from '../context/CaptainContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CaptainSignup = () => {
  const navigate = useNavigate();
   const [email, setEmail] = React.useState(''); 
    const [password, setPassword] = React.useState('');
    const [firstName, setFirstName] = React.useState('');
    const [lastName, setLastName] = React.useState('');

    const [vehicleColor, setVehicleColor] = React.useState('');
    const [vehiclePlate, setVehiclePlate] = React.useState('');
    const [vehicleCapacity, setVehicleCapacity] = React.useState('');
    const [vehicleType, setVehicleType] = React.useState('');

    const { captain, setCaptain } = React.useContext(CaptainDataContext)
    const submitHandler = async (e) => {
      e.preventDefault()
    const captainData = {
        fullname:{
          firstname: firstName,
          lastname: lastName
        },
        password: password,
        email: email,
        vehicle: {
          color: vehicleColor,
          plate: vehiclePlate,
          capacity: vehicleCapacity,
          vehicleType: vehicleType
        }
      }

      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/register`, captainData)
      if (response.status == 201) {
        const data = response.data
        setCaptain(data.captain)
        localStorage.setItem('token', data.token)
        navigate('/captain-home')
      }

      setEmail('')
      setPassword('')
      setFirstName('')  
      setLastName('')
      setVehicleColor('')
      setVehicleCapacity('')
      setVehiclePlate('')
      setVehicleType('')
    }
  return (
       <div>
       <div className='py-5 px-5  h-screen flex flex-col justify-between'>
      <div>
         <img className='w-28 mb-3' src="/image.png" alt="logo" />
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
          value={password}
         onChange={(e)=>{
          setPassword(e.target.value)
         }}
         type='password' 
         placeholder='password'
         />

          <h3 className='text-lg font-medium mb-2'>Vehicle Information</h3>
          <div className='flex gap-4 mb-7'>
            <input
              required
              className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base'
              type="text"
              placeholder='Vehicle Color'
              value={vehicleColor}
              onChange={(e) => {
                setVehicleColor(e.target.value)
              }}
            />
            <input
              required
              className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base'
              type="text"
              placeholder='Vehicle Plate'
              value={vehiclePlate}
              onChange={(e) => {
                setVehiclePlate(e.target.value)
              }}
            />
          </div>
          <div className='flex gap-4 mb-7'>
            <input
              required
              className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base'
              type="number"
              placeholder='Vehicle Capacity'
              value={vehicleCapacity}
              onChange={(e) => {
                setVehicleCapacity(e.target.value)
              }}
            />
            <select
              required
              className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base'
              value={vehicleType}
              onChange={(e) => {
                setVehicleType(e.target.value)
              }}
            >
              <option value="" disabled>Select Vehicle Type</option>
              <option value="car">Car</option>
              <option value="auto">Auto</option>
              <option value="motorcycle">Moto</option>
            </select>
          </div>

        <button
        className='bg-[#111] text-white font-semibold mb-3 rounded px-4 py-2  w-full text-lg placeholder:text-base'
        >Create Captain Account</button>
        <p className='text-center'>Already have a account? <Link to='/captain-login' className='text-blue-600'>Login here</Link></p>
      </form>
      </div>
      <div>
         <p className='text-[10px] mt-6 leading-tight'>
          This site is protected by reCAPTCHA and the <span className='underline'>Google Privacy Policy</span> and <span className='underline'>Terms of Service </span>apply.
         </p>
      </div>
    </div>
    </div>
  )
}

export default CaptainSignup




