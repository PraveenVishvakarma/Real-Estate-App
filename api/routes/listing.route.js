import  express  from "express";
import { create } from "../controllers/listing.contoller.js";
import { verifyToken } from "../utils/verifyUser.js";

const listingRouter=express.Router();

listingRouter.post("/create", verifyToken, create);

export default listingRouter;