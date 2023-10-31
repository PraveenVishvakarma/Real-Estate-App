import React, { useState } from 'react'
import { app } from '../firebase';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';

export default function CreateListing() {
    const [files, setFiles]=useState([]);
    const [formData, setFormData]=useState({
        imageUrls:[],
    })
    console.log(formData);
    const [imageUploadError, setImageUploadError]=useState(false);
    const handleImageSubmit=(e)=>{
        if(files.length > 0 && files.length + formData.imageUrls.length < 7){
            const promises=[];
            for(let i=0; i<files.length; i++){
                promises.push(storeImage(files[i]));
            }
            Promise.all(promises).then((urls)=>{
                setFormData({...formData, imageUrls:formData.imageUrls.concat(urls)});
            })
            .catch((err)=>{
                setImageUploadError('image upload failed');
            })
        } else{
            setImageUploadError('You can only upload max 6 images !');
        }
    };
    const storeImage= async (file)=>{
        return new Promise((resolve, reject)=>{
            const storage=getStorage(app);
            const fileName=new Date().getTime()+file.name;
            const reference=ref(storage, fileName);
            const uploadTask=uploadBytesResumable(reference, file);
            uploadTask.on("state_changed",
            (snapshot)=>{
                const progress=(snapshot.bytesTransferred /
                snapshot.totalBytes) *100;
                console.log(`upload is ${Math.round(progress)}% done`);
               },
            (error)=>{
                reject(error);
            },
            ()=>{
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
                    resolve(downloadURL);
                });
            })
        })
    }

    const handleRemoveImage=(index)=>{
        setFormData({
            ...formData,
            imageUrls:formData.imageUrls.filter((_, i)=> i !== index)
        });
    }

  return (
    <main className='p-3 max-w-3xl mx-auto'>
        <h1 className='text-3xl font-semibold text-center my-7'>Create a Listing</h1>
        <form className='flex flex-col sm:flex-row gap-4 '>
            <div className='flex flex-col gap-4 flex-1'>
               <input type='text' placeholder='Name' id='name' className='rounded-lg p-3 border' required />
               <textarea type='text' placeholder='Description' id='description' className='rounded-lg p-3 border' required />
               <input type='text' placeholder='Address' id='address' className='rounded-lg p-3 border' required />
               <div className='flex flex-wrap gap-6'>
                <div className='flex gap-2'>
                    <input type='checkbox' id='sell' className='w-5' />
                    <span>Sell</span>
                </div>
                <div className='flex gap-2'>
                    <input type='checkbox' id='rent' className='w-5' />
                    <span>Rent</span>
                </div>
                <div className='flex gap-2'>
                    <input type='checkbox' id='parking' className='w-5' />
                    <span>Parking Spot</span>
                </div>
                <div className='flex gap-2'>
                    <input type='checkbox' id='furnished' className='w-5' />
                    <span>Furnished</span>
                </div>
                <div className='flex gap-2'>
                    <input type='checkbox' id='offer' className='w-5' />
                    <span>Offer</span>
                </div>
               </div>
               <div className='flex flex-wrap gap-6'>
                <div className='flex items-center gap-3'>
                    <input type='number' id='bedrooms'  className='p-3 border border-gray-300 rounded-lg' min='1' max="10" required />
                    <p>Beds</p>
                </div>
                <div className='flex items-center gap-3'>
                    <input type='number' id='bathrooms'  className='p-3 border border-gray-300 rounded-lg' min='1' max="10" required />
                    <p>Baths</p>
                </div>
                <div className='flex items-center gap-3'>
                    <input type='number' id='regularPrice'  className='p-3 border border-gray-300 rounded-lg' min='1' max="10" required />
                    <div className='flex flex-col items-center'>
                        <p>Regular Price</p>
                        <span className='text-xs'>($/month)</span>
                    </div>
                </div>
                <div className='flex items-center gap-3'>
                    <input type='number' id='discountPrice'  className='p-3 border border-gray-300 rounded-lg' min='1' max="10" required />
                    <div className='flex flex-col items-center'>
                        <p>Discounted Price</p>
                        <span className='text-xs'>($/month)</span>
                    </div>
                </div>
               </div>
            </div>
            <div className='flex flex-col flex-1 gap-4'>
                <p className='font-semibold'>Images:
                <span className='font-normal ml-2'>The first image will be the cover(max 6)</span>
                </p>
                <div className='flex flex-col sm:flex-row gap-4 '>
                    <input onChange={(e)=>setFiles(e.target.files)} className='p-3 border border-slate-300 rounded w-full' type='file' id='images' accept='image/*' multiple />
                    <button type='button' onClick={handleImageSubmit} className='p-3 border border-green-700 uppercase disabled:opacity-80 text-green-700 rounded hover:shadow-lg'>Upload</button>
                </div>
                <p className='text-red-500 text-sm'> {imageUploadError && imageUploadError} </p>

                {formData.imageUrls.length >0 && formData.imageUrls.map((url, index)=>(
                    <div key={url} className='flex justify-between p-3 border items-center'>
                        <img src={url} alt="Listing image" className='h-20 w-20  object-contain rounded-lg' />
                        <button type='button' onClick={()=>handleRemoveImage(index)} className='text-red-600 rounded-lg uppercase hover:opacity-60'>Delete</button>
                    </div>
                ))}


                <button className='p-3 bg-slate-700 rounded-lg text-white uppercase hover:opacity-80 disabled:opacity-80'>Create Listing</button>
            </div>
            
        </form>
    </main>
  )
}
