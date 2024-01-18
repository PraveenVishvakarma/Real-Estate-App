import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {Swiper, SwiperSlide} from 'swiper/react'
import 'swiper/css/bundle';
import { Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
import ListingItems from '../components/ListingItems';

export default function Home() {
  const [offerListings, setOfferListins]=useState(null);
  const [sellListings, setSellListins]=useState(null);
  const [rentListings, setRentListins]=useState(null);
  SwiperCore.use([Navigation]);


  useEffect(()=>{
      const fetchOfferListings=async()=>{
        const res=await fetch('/api/listing/get?offer=true&limit=4');
        const data=await res.json();
        setOfferListins(data);
        fetchRentListings();
      };
    
    const fetchRentListings=async()=>{
      const res=await fetch('/api/listing/get?type=rent&limit=4');
      const data=await res.json();
      setRentListins(data);
      fetchSellListings();
    };
    const fetchSellListings=async()=>{
      const res=await fetch('/api/listing/get?type=sell&limit=4');
      const data=await res.json();
      setSellListins(data);
    };


    fetchOfferListings();
  },[])
  return (
    <div className=''>
      <div className=' flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto'>
        <h1 className='text-slate-700 font-bold text-3xl lg:text-6xl'
        >Find your next <span className='text-slate-500'>perfect</span>
        <br />
        place with ease
        </h1>
        <div className='text-gray-400 text-xs sm:text-sm'>
          Rohit Estate is the best place to find your next perfect place to live.
          <br />
          We have a wide range of properties for you to choose from.
        </div>
        <Link to={'/search'} className=' text-xs sm:text-sm text-blue-800 font-bold hover:underline'>
          Let's get started...
        </Link>
      </div>
      <Swiper navigation>
        {offerListings && offerListings.length>0 && offerListings.map((listing)=>(
          <SwiperSlide>
            <div style={{background:`url(${listing.imageUrls[0]}) center no-repeat`, backgroundSize:'cover'}} className='h-[550px]'></div>
          </SwiperSlide>
        )) }
      </Swiper>
      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10'>
        {offerListings && offerListings.length>0 &&(
          <div>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Recent Offers</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?offer=true'}>
                Show more offers...
              </Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {offerListings.map((listing)=>(
                <ListingItems key={listing._id} listing={listing} />
              ))}
            </div>
          </div>
        )}
        {rentListings && rentListings.length>0 &&(
          <div>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Recent Rents</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=rent'}>
                Show more rents...
              </Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {rentListings.map((listing)=>(
                <ListingItems key={listing._id} listing={listing} />
              ))}
            </div>
          </div>
        )}
        {sellListings && sellListings.length>0 &&(
          <div>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Recent Sells</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=sell'}>
                Show more sells...
              </Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {sellListings.map((listing)=>(
                <ListingItems key={listing._id} listing={listing} />
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  )
}
