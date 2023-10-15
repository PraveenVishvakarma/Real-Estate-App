import express from 'express';
import { signup } from '../controllers/auth.contoller.js';


const authRouter=express.Router();

authRouter.post("/signup", signup);

export default authRouter;