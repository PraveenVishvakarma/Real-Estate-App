import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import ListingItems from '../components/ListingItems';

export default function Search() {
    const[sitebarData, setSidebarData]=useState({
        searchTerm:'',
        type:'all',
        parking:false,
        furnished:false,
        offer:false,
        sort:'created_at',
        order:'desc',
    });
    const navigate=useNavigate();
    const [loading, setLoading]=useState(false);
    const [listings, setListings]=useState(null);
    console.log(listings);

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        const typeFromUrl = urlParams.get('type');
        const parkingFromUrl = urlParams.get('parking');
        const furnishedFromUrl = urlParams.get('furnished');
        const offerFromUrl = urlParams.get('offer');
        const sortFromUrl = urlParams.get('sort');
        const orderFromUrl = urlParams.get('order');
    
        if (
          searchTermFromUrl ||
          typeFromUrl ||
          parkingFromUrl ||
          furnishedFromUrl ||
          offerFromUrl ||
          sortFromUrl ||
          orderFromUrl
        ) {
          setSidebarData({
            searchTerm: searchTermFromUrl || '',
            type: typeFromUrl || 'all',
            parking: parkingFromUrl === 'true' ? true : false,
            furnished: furnishedFromUrl === 'true' ? true : false,
            offer: offerFromUrl === 'true' ? true : false,
            sort: sortFromUrl || 'created_at',
            order: orderFromUrl || 'desc',
          });
        }
        
        const getListings=async()=>{
            setLoading(true);
            const searchQuery=urlParams.toString();
            const res=await fetch(`/api/listing/get?${searchQuery}`);
            const data=await res.json();
            setListings(data);
            setLoading(false);
        }

        getListings();
      }, [location.search]);
    

    const handleChange=(e)=>{
        if(e.target.id==='all' || e.target.id==='rent'  || e.target.id==='sell'){
            setSidebarData({...sitebarData, type:e.target.id});
        }

        if(e.target.id==='searchTerm'){
            setSidebarData({...sitebarData, searchTerm:e.target.value});
        }

        if(e.target.id==='parking' || e.target.id==='furnished' || e.target.id==='offer'){
            setSidebarData({...sitebarData, [e.target.id]:e.target.checked || e.target.checked==='true' ? true : false});
        }

        if(e.target.id==='sort_order'){
            const sort=e.target.value.split('_')[0] || 'created_at';
            const order=e.target.value.split('_')[1] || 'desc';

            setSidebarData({...sitebarData, sort, order})
        }
    };

    const handleSubmit=(e)=>{
        e.preventDefault();
        const urlParams = new URLSearchParams();
        urlParams.set('searchTerm', sitebarData.searchTerm);
        urlParams.set('type', sitebarData.type);
        urlParams.set('parking', sitebarData.parking);
        urlParams.set('furnished', sitebarData.furnished);
        urlParams.set('offer', sitebarData.offer);
        urlParams.set('sort', sitebarData.sort);
        urlParams.set('order', sitebarData.order);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    }

  return (
    <div className='flex flex-col md:flex-row'>
        <div className='p-7 border-b-2 md:border-r-2 md:min-h-screen'>
            <form  onSubmit={handleSubmit} action=""className='flex flex-col gap-8'>
                <div className='flex  gap-3 items-center'>
                    <label className='whitespace-nowrap font-semibold'>Search Term:</label>
                    <input 
                    id='searchTerm' 
                    placeholder='Search' 
                    className='p-3 rounded-lg w-full'
                    value={sitebarData.searchTerm}
                    onChange={handleChange}
                    ></input>
                </div>
                <div className='flex flex-wrap gap-2 items-center'>
                    <label className='font-semibold'>Type:</label>
                    <div className='flex gap-2 '>
                        <input 
                        type="checkbox" 
                        name="" id="all" 
                        className='w-5'
                        onChange={handleChange}
                        checked={sitebarData.type==='all'}
                        />
                        <label>Rent & Sell </label>
                    </div>
                    <div className='flex gap-2 '>
                        <input type="checkbox" name="" id="rent" className='w-5' 
                        onChange={handleChange}
                        checked={sitebarData.type==='rent'}
                        />
                        <label>Rent </label>
                    </div>
                    <div className='flex gap-2 '>
                        <input type="checkbox" name="" id="sell" className='w-5' 
                        onChange={handleChange}
                        checked={sitebarData.type==='sell'}
                        />
                        <label>Sell </label>
                    </div>
                    <div className='flex gap-2 '>
                        <input type="checkbox" name="" id="offer" className='w-5' 
                        onChange={handleChange}
                        checked={sitebarData.offer}
                        />
                        <label>offer </label>
                    </div>
                </div>
                <div className='flex flex-wrap gap-2 items-center'>
                    <label className='font-semibold'>Amenities:</label>
                    <div className='flex gap-2 '>
                        <input type="checkbox" name="" id="parking" className='w-5' 
                        onChange={handleChange}
                        checked={sitebarData.parking}
                        />
                        <label>Parking </label>
                    </div>
                    <div className='flex gap-2 '>
                        <input type="checkbox" name="" id="furnished" className='w-5' 
                        onChange={handleChange}
                        checked={sitebarData.furnished}
                        />
                        <label>Furnished</label>
                    </div>
                </div>
                <div className='flex items-center gap-2'>
                    <label className='font-semibold'>Sort:</label>
                    <select 
                    onChange={handleChange}
                    defaultValue={'created_at_desc'}
                    id='sort_order' className='border rounded-lg p-3'>
                        <option value="regularPrice_desc">Price high to low</option>
                        <option value="regularPrice_asc">Price low to high</option>
                        <option value="createdAt_desc">latest</option>
                        <option value="createdAt_asc">oldest</option>
                    </select>
                </div>
                <button className='bg-slate-700 rounded-lg p-3 text-white hover:opacity-80 uppercase'>search</button>
            </form>
        </div>
        <div className='flex-1'>
            <h1 className='text-3xl font-semibold border-b mt-5 p-3 text-slate-700'>Listing results:</h1>
            <div className='p-7 flex flex-wrap gap-4'>
                 {!loading && listings && listings.length===0 && <p className='text-xl text-slate-700'>No Listing found!</p>}
                 {loading && <p className='text-xl text-slate-700 text-center w-full'>Loading...</p>}
                 {!loading && listings && listings.map((listing)=>(
                    <ListingItems key={listing.id} listing={listing}/>
                 ))}
            </div>
        </div>
    </div>
  )
}
