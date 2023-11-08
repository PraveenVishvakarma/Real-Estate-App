import express from 'express';
import { deleteUser, getUser, getUserListing, test, updateUser } from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const userRouter=express.Router();

userRouter.get("/auth/tests", test);
userRouter.post("/update/:id", verifyToken, updateUser);
userRouter.delete("/delete/:id", verifyToken, deleteUser);
userRouter.get("/listings/:id", verifyToken, getUserListing);
userRouter.get("/:id", verifyToken, getUser);

export default userRouter;