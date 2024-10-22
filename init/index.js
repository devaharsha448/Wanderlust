const mongoose = require("mongoose");
const initData = require("./data.js"); // This is an array
const Listing = require("../models/listing.js");

main()
  .then(() => {
    console.log("connection successful");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/Wanderlust");
}

const initDB = async () => {
  await Listing.deleteMany({});
  const updatedData = initData.map((obj) => ({
    ...obj,
    owner: "66963bc80be186d91dcdaa0a",
  }));
  await Listing.insertMany(updatedData).then((res) => {
    console.log(res);
  });
  console.log("data was initialized");
};

initDB();
