const jwt = require('jsonwebtoken');
//function for creating the token 
const generateToken = (data) =>{
    console.log(process.env.JWT_SECRET);
    //token me vhi data hoga jo hmne bheja tha 
    jwt.sign(data, process.env.JWT_SECRET)};

module.exports = generateToken;
