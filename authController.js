const userModel = require('../models/user-model');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');

module.exports.registerUser =async (req,res)=>{
    const {name,email,password} = req.body;

  try{
    let user =  await userModel.findOne({email});
    //if user is already logged in using this email then 
    if(user){
     return res.status(400).send('Email already exists, please login');
    }
 
    //hashing the password before storing it in the database
    let salt = await bcrypt.genSalt();
    let hash = await bcrypt.hash(password,salt);
 
    //creating a user with the entered email
    user = await userModel.create({
     email,
     password: hash,
     name
    })
 
    //if user created his profile or logged in we will automatically login the user into the system
 
     let token = generateToken({
     email //jiksa token bana na h vo bhejenge 
    });
 
    //creating a cookie 
    res.cookie('token',token,{
     httpOnly : true,
     secure : true,
     maxAge : 30*24*60*60*1000, //for 30 days 
    });
 
    res.status(201).send(user);
  }
  catch(error){
    console.error(error);
    res.status(500).send('Server Error');
  }

};

module.exports.loginUser = async (req,res) => {
    //jo jo data ayega 
    const {email,password} = req.body;
   try{
     //find if acct already exists
     let user = await userModel.findOne({email});

     //agr acct nhi h to 
     if(!user){
      return res.status(404).send('User not found');
     }
 
     //if account exists 
     let result = await bcrypt.compare(password, user.password); //we will match that the sent password is equal to the user pASSword or not
 
     if(result){//if password matches 
          let token = generateToken({email});
 
          res.cookie('token',token,{
              httpOnly : true,
              secure : true,
              maxAge : 30*24*60*60*1000, //for 30 days 
          });
          res.status(200).send("logged in successfully");
     }else{
         //if password does not match
         res.status(401).send('Invalid Password');
     }
   }catch{
     console.error(error);
     res.status(500).send('Server Error');
   }
};

module.exports.logoutUser = function(req,res){
    //in this we just want to delete the token that we have saved in the cookie so we just gonna write the cookie and setting its token to blank 
    res.cookie('token','',{
       secure:true,
        httpOnly : true,
    });
    res.status(200).send('Logged out successfully');
};

module.exports.getUserProfile = function(req,res){
    //in this we just want to get the user profile from the database based on the token that we have saved in the cookie
    //we will use the token to find the user in the database and send the user's profile back to the client
    console.log(req.user);
    res.send("logged in already");
};