const mongoose = require("mongoose");

//to connect mongoose to databae
const connectDb = async () => {
   try {
     await mongoose.connect(process.env.MONGO_URL);
    console.log("connected to database");
   }
   catch (error) {
    console.error("Error connecting to database", error);
    //to exit application age nhi chaLE 
    process.exit(1);
   }  
};

module.exports = connectDb;//to use it further in other folders and files 