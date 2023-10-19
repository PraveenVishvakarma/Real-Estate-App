import React from 'react'
import { useSelector } from 'react-redux'

export default function Profile() {
  const {currentUser}=useSelector((state)=>state.user)
  return (
    <div className='mx-auto p-3 max-w-lg'>
      <h1 className='font-semibold text-center text-3xl my-7'>Profile</h1>
      <form className='mx-auto flex flex-col max-w-lg gap-4'>
        <img className='mx-auto rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2' src={currentUser.avatar} />
        <input type='text' placeholder='username' id="username" className='rounded-lg p-3' />
        <input type='text' placeholder='email' id="email" className='rounded-lg p-3 ' />
        <input type='password' placeholder='password' id="password" className='rounded-lg p-3' />
        <button className='bg-slate-700 p-3 rounded-lg hover:opacity-80 text-white cursor-pointer disabled:opacity-70 uppercase'>Update</button>
      </form>
      <div className='flex justify-between mt-5'>
        <span className='text-red-700 cursor-pointer'>Delete account</span>
        <span className='text-red-700 cursor-pointer'>Sign out</span>
      </div>
    </div>
  )
}
