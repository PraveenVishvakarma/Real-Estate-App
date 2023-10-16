import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';

export default function SignIn() {
  const [formData, setFormData]=useState({});
  const [error, setError]=useState(null);
  const [isLoading, setIsLoading]=useState(false);
  const navigate=useNavigate();
  const handlChange=(e)=>{
    setFormData({
      ...formData,
      [e.target.id]:e.target.value,
    });

   
    console.log(formData);
  } 
  const handleSubmit= async (e)=>{
    e.preventDefault();
    try{
      setIsLoading(true);
      const res= await fetch('/api/auth/signin',{
        method:"POST",
        headers:{
          'Content-Type':"application/json"
        },
        body:JSON.stringify(formData),
      });
      const data= await res.json();
      console.log(data);
      if(data.success===false){
        setIsLoading(false);
        setError(data.message);
        return;
      }
      setIsLoading(false);
      setError(null);
      navigate("/");
    }catch(error){
      setIsLoading(false);
      setError(error.message);
      
    }
   
  }
  return (
    <div className='p-3 max-w-lg mx-auto '>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input type='text' placeholder='email' className='border p-3 rounded-lg' id='email' onChange={handlChange} />
        <input type='text' placeholder='password' className='border p-3 rounded-lg' id='password' onChange={handlChange} />
        <button disabled={isLoading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-70 disabled:opacity-80'>
          {isLoading ? 'Loading...' : 'sign in'}
          </button>
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Dont have an account?</p>
        <Link to="/sign-up">
          <span className='text-blue-700 '>Sign up</span>
        </Link>
      </div>
      {error && <p className='text-red-500'>{error}</p>}
    </div>
  )
}

