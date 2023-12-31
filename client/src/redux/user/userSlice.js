import { createSlice } from '@reduxjs/toolkit'

const initialState={
    currentUser:null,
    error:null,
    loading:false,
};

const userSlice=createSlice({
    name:"user",
    initialState,
    reducers:{
        signInStart:(state)=>{
            state.loading=true;
        },
        signInSuccess:(state, action)=>{
            state.currentUser=action.payload;
            state.loading=false;
            state.error=null;
        },
        signInFailure:(state, action)=>{
            state.error=action.payload;
            state.loading=false;
        },
        updateStart:(state)=>{
            state.loading=true;
        },
        updateSuccess:(state, action)=>{
            state.currentUser=action.payload;
            state.loading=false;
            state.error=null;
        },
        updateError:(state, action)=>{
            state.error=action.payload;
            state.loading=false;
        },
        deleteUserSuccess:(state)=>{
            state.currentUser=null;
        },
        SignOutUserSuccess:(state)=>{
            state.currentUser=null;
        },
    }
});

export const {signInStart, signInFailure, signInSuccess, updateError, updateStart, updateSuccess, deleteUserSuccess, SignOutUserSuccess}=userSlice.actions;

export default userSlice.reducer;