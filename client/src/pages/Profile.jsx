import  { useState } from 'react'
import { useEffect } from 'react';
import { useSelector } from 'react-redux'
import { useRef } from 'react';
import {getDownloadURL, getStorage, uploadBytesResumable} from 'firebase/storage';
import { app } from '../firebase';
import { ref } from 'firebase/storage';



export default function Profile() {
  const {currentUser}=useSelector((state)=>state.user);
  const fileRef=useRef(null);
  const [file, setFile]=useState(undefined);
  const [filePer, setFilePer]=useState(0);
  const [fileUploadError, setFileUploadError]=useState(false);
  const [formData, setFormData]=useState({});
  console.log(formData);
  console.log(fileUploadError);
  //firebase storage
      //allow read;
      //allow write: if 
      //request.resource.size < 2 * 1024 * 1024 &&
      //request.resource.contentType.matches("/image/.*")
  useEffect(()=>{
    if(file){
    handleFileUpload(file);
    }
  },[file]);

  const handleFileUpload=(file)=>{
    const storage=getStorage(app);
    const fileName=new Date().getTime() + file.name;
    const storageRef=ref(storage, fileName);
    const uploadTask=uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
       (snapshot)=>{
        const progress=(snapshot.bytesTransferred /
        snapshot.totalBytes) *100;
        setFilePer(Math.round(progress));
       },
       (error)=>{
        setFileUploadError(true);
       },
       ()=>{
        getDownloadURL(uploadTask.snapshot.ref).then
        ((downloadURL)=>{setFormData({...formData, avatar:downloadURL})})
       }
    )
  }
  
  return (
    <div className='mx-auto p-3 max-w-lg'>
      <h1 className='font-semibold text-center text-3xl my-7'>Profile</h1>
      <form className='mx-auto flex flex-col max-w-lg gap-4'>
        <input onChange={(e)=>setFile(e.target.files[0])} hidden type='file' ref={fileRef} accept='image/*' />
        <img onClick={()=>fileRef.current.click()} className='mx-auto rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2' src={formData.avatar || currentUser.avatar} />

        <p className='self-center'>
          {fileUploadError ? <span className='text-red-600'>Error Image Upload(Image must be less than 2 mb)</span>:
          filePer>0 && filePer<100 ? <span className='text-slate-700'> `Uploading ${filePer}%` </span> :
           filePer===100 ? <span className='text-green-700'>File Successfully Uploaded </span>
          :""
          }
        </p>

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
