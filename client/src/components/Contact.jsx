import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

export default function Contact({listing}) {
    const [landlord, setLandlord]=useState(null);
    const [message, setMessage]=useState(null);
    console.log(landlord);
    console.log(message);
    


    useEffect(()=>{
        const fetchLandlord= async ()=>{
            try{
            const res=await fetch(`/api/user/${listing.userRef}`);

            const data=await res.json();
            if(data.success===false){
                console.log(data.message);
                return;
            }
            setLandlord(data);
          }
          catch(error){
            console.log(error);
          }
        };
        fetchLandlord();
    },[listing.userRef]);



  return (
    <>
    {landlord && <div className='flex flex-col gap-2'>
        <p>Contact <span className='font-semibold'>{landlord.username}</span> for <span className='font-semibold'>{listing.name.toLowerCase()}</span></p>
        <textarea onChange={(e)=>setMessage(e.target.value)} placeholder='Enter your message here' name="message" value={message} className='rounded-lg w-full p-3 border' id="message" rows="2"></textarea>
        <Link
          to={`mailto:${landlord.email}?subject=Regarding${listing.name}&body=${message}`}
        >
        <p className='bg-slate-800 text-center text-white rounded-lg p-3 hover:opacity-90'>Send Message</p>
        </Link>
    </div>}   
    </>
  )
}
