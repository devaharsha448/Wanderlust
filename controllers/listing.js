const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding.js');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({accessToken : mapToken});



module.exports.index = async (req, res) => {
    
    const allListings = await Listing.find({});
    res.render("index.ejs", { allListings }); 

};

module.exports.createListing = (req,res)=>{
    //console.log(req.user);
    res.render("new.ejs");
};

module.exports.uploadNewListing = async (req, res, next) => {
    try {
      let response = await geocodingClient
        .forwardGeocode({
          query: req.body.listing.location,
          limit: 1,
        })
        .send();
  
      let url = req.file.path;
      let filename = req.file.filename;
      
      const newListing = new Listing(req.body.listing);
      newListing.owner = req.user._id;
      // Ensure the category from the form is used
      newListing.category = req.body.listing.category;
      newListing.image = { url, filename };
      newListing.geometry = response.body.features[0].geometry;
      
  
      await newListing.save();
      req.flash("success", "New Listing created!");
      res.redirect("/listings");
    } catch (error) {
      console.error("Error creating new listing:", error);
      req.flash("error", "Something went wrong while creating the listing.");
      res.redirect("/listings/new"); // Redirect back to the form if there's an error
    }
  };
  

module.exports.showEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error"," Listing you requested for not exists !");
        res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload","/upload/h_300,w_250")
    res.render("edit.ejs", { listing ,originalImageUrl});
};

module.exports.searchListings = async (req, res) => {
  const { location } = req.query;
  const listings = await Listing.find({ location: new RegExp(location, 'i') }); // Case-insensitive search
  res.render("search", { listings, location });
};

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    const updatedData = {
        ...req.body.listing,
        category: req.body.listing.category, // Ensure category is included
    };
    let listing = await Listing.findByIdAndUpdate(id, updatedData);

    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }

    req.flash("success", "Listing Updated successfully!");
    res.redirect(`/listings/${id}`);
};


module.exports.showListing = async (req,res)=>{
    let{ id } = req.params;
    const listing = await Listing.findById(id)
    .populate({
        path:"reviews",
        populate : {
            path : "author",
        },
    }).populate("owner");
    if(!listing){
        req.flash("error"," Listing you requested for not exists !");
        res.redirect("/listings");
    }
    res.render("show.ejs",{listing});
    };

module.exports.index = async (req, res) => {
        const { category } = req.query;
        let filter = {};
      
        if (category) {
          filter = { category };
        }
      
        const allListings = await Listing.find(filter);
        res.render("index.ejs", { allListings });
};

module.exports.destroyListing = async(req,res)=>{
        let { id } = req.params;
        let deletedListing = await Listing.findByIdAndDelete(id);
        console.log(deletedListing);
        req.flash("success"," Listing deleted successfully!");
        res.redirect("/listings");
        };