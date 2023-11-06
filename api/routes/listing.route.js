import  express  from "express";
import { create, deleteListing } from "../controllers/listing.contoller.js";
import { verifyToken } from "../utils/verifyUser.js";

const listingRouter=express.Router();

listingRouter.post("/create", verifyToken, create);
listingRouter.delete("/delete/:id", verifyToken, deleteListing);

export default listingRouter;