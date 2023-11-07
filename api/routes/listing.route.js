import  express  from "express";
import { create, deleteListing, getListing, updateListing } from "../controllers/listing.contoller.js";
import { verifyToken } from "../utils/verifyUser.js";

const listingRouter=express.Router();

listingRouter.post("/create", verifyToken, create);
listingRouter.delete("/delete/:id", verifyToken, deleteListing);
listingRouter.post("/update/:id", verifyToken, updateListing);
listingRouter.get("/get/:id", getListing);

export default listingRouter;