const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 3000;
const Listing = require("./models/listing.js");
const engine = require("ejs-mate");
const path = require("path");
const methodOverride = require("method-override");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

app.engine("ejs", engine);
app.use(methodOverride("_method"));

app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

async function main() {
  await mongoose.connect(MONGO_URL);
}

main()
  .then(() => {
    console.log("Connection was successfull");
  })
  .catch((err) => console.log(err));

//index route
app.get("/listings", async (req, res) => {
  let listings = await Listing.find({});
  res.render("listings/index.ejs", { listings });
});
//new route
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});
//show route
app.get("/listings/:id", async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  res.render("listings/show.ejs", { listing });
});

//create route
app.post("/listings", async (req, res) => {
  let { title, description, image, price, location, country } =
    req.body.listing;
  let newListing = new Listing({
    title: title,
    description: description,
    "image.filename": "listingimage",
    "image.url": image,
    price: price,
    location: location,
    country: country,
  });
  await newListing.save();
  res.redirect("/listings");
});

//edit route
app.get("/listings/:id/edit", async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
});

//update route
app.put("/listings/:id", async (req, res) => {
  let { id } = req.params;
  let { title, description, image, price, location, country } =
    req.body.listing;
  let editListings = await Listing.findByIdAndUpdate(id, {
    title: title,
    description: description,
    "image.filename": "listingimage",
    "image.url": image,
    price: price,
    location: location,
    country: country,
  });
  res.redirect(`/listings/${id}`);
});

//delete route
app.delete("/listings/:id", async (req, res) => {
  let deleteListings = await Listing.findByIdAndDelete(req.params.id);
  res.redirect("/listings");
});

app.listen(port, () => {
  console.log(`server is listening on port ${port}`);
});
