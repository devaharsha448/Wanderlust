const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema , reviewSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner , validateListing} = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer = require('multer');
const {storage} = require("../cloudconfig.js");
const upload = multer({ storage });


// Route to fetch listings and render index.ejs  and Create Routes
router.route("/").get( wrapAsync(listingController.index))
.post(isLoggedIn,
    upload.single('listing[image]'),
    wrapAsync(listingController.uploadNewListing))
.get(wrapAsync(listingController.index));

//New 
router.get("/new",isLoggedIn,listingController.createListing);

// Search Route
router.get("/search", wrapAsync(listingController.searchListings));

// Update route - submit form
//show route
//delete
router.route("/:id").put(isLoggedIn,isOwner,upload.single('listing[image]'),validateListing,wrapAsync(listingController.updateListing))
.get(wrapAsync(listingController.showListing))
.delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));

// Update route - show edit form
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.showEditForm));





module.exports = router;
