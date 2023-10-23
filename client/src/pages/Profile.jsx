import  { useState } from 'react'
import { useEffect } from 'react';
import { useSelector } from 'react-redux'
import { useRef } from 'react';
import {getDownloadURL, getStorage, uploadBytesResumable} from 'firebase/storage';
import { app } from '../firebase';
import { ref } from 'firebase/storage';
import { Link } from 'react-router-dom';
import {  useDispatch } from 'react-redux';
import { SignOutUserSuccess, deleteUserSuccess, updateError, updateStart, updateSuccess } from '../redux/user/userSlice';



export default function Profile() {
  const {currentUser}=useSelector((state)=>state.user);
  const fileRef=useRef(null);
  const [file, setFile]=useState(undefined);
  const [filePer, setFilePer]=useState(0);
  const [fileUploadError, setFileUploadError]=useState(false);
  const [formData, setFormData]=useState({});
  const dispatch=useDispatch();
  const[successUpdate, setSuccessUpdate]=useState(false);

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

  const handleChange=(e)=>{
     setFormData({...formData, [e.target.id]:e.target.value});
  }

  const handleSubmit=async (e)=>{
    e.preventDefault();
    try{
      dispatch(updateStart());
    const res= await fetch(`/api/user/update/${currentUser._id}`,{
      method:"POST",
      headers:{
      "Content-Type":"application/json"
      },
      body:JSON.stringify(formData),
    });
    const data=await res.json();
    if(data.success===false){
      dispatch(updateError(data.message))
    }
    dispatch(updateSuccess(data));
    setSuccessUpdate(true);
   } catch(error){
     dispatch(updateError(error.message));
   }
  }

  const handleDelete=async ()=>{
    const res=await fetch(`/api/user/delete/${currentUser._id}`,{
      method:"DELETE",
      headers:{
        "Content-Type":"application/json"
      },
    });
    const data= await res.json();
    dispatch(deleteUserSuccess());
    console.log(data);
  }
  
  return (
    <div className='mx-auto p-3 max-w-lg'>
      <h1 className='font-semibold text-center text-3xl my-7'>Profile</h1>
      <form onSubmit={handleSubmit} className='mx-auto flex flex-col max-w-lg gap-4'>
        <input onChange={(e)=>setFile(e.target.files[0])} hidden type='file' ref={fileRef} accept='image/*' />
        <img onClick={()=>fileRef.current.click()} className='mx-auto rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2' src={formData.avatar || currentUser.avatar} />

        <p className='self-center'>
          {fileUploadError ? <span className='text-red-600'>Error Image Upload(Image must be less than 2 mb)</span>:
          filePer>0 && filePer<100 ? <span className='text-slate-700'> `Uploading ${filePer}%` </span> :
           filePer===100 ? <span className='text-green-700'>File Successfully Uploaded </span>
          :""
          }
        </p>

        <input type='text'  onChange={handleChange} defaultValue={currentUser.username} placeholder='username' id="username" className='rounded-lg p-3' />
        <input type='text' onChange={handleChange} defaultValue={currentUser.email} placeholder='email' id="email" className='rounded-lg p-3 ' />
        <input type='password' onChange={handleChange} placeholder='password' id="password" className='rounded-lg p-3' />
        <button className='bg-slate-700 p-3 rounded-lg hover:opacity-80 text-white cursor-pointer disabled:opacity-70 uppercase'>Update</button>
        <Link className='bg-green-700 rounded-lg p-3 text-white uppercase text-center hover:opacity-80' to={"/create-listing"}>
        Create listing
        </Link>
      </form>
      
      <div className='flex justify-between mt-5'>
        <span onClick={handleDelete} className='text-red-700 cursor-pointer'>Delete account</span>
        <span onClick={()=>{
          dispatch(SignOutUserSuccess());
        }} className='text-red-700 cursor-pointer'>Sign out</span>
      </div>
      <p className='text-green-700'>{successUpdate ? "User is updated successfully!" : ""}</p>
    </div>
  )
}
