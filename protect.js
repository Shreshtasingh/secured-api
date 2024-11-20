//this middleware will run before running any routes , so whenever this route is attched with any route it will run first and we will use it when we want that our route run only when user is logged in
const jwt = require("jsonwebtoken");
const userModel = require("../models/user-model");

module.exports.protect = async (req,res,next) => {
    //if there is a user it must be having some cookie 
    if (!req.cookies.token) {
        return res.status(401).send("Not authorized, you don't have a token");
    }

    try {
        const data = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
        req.user = await userModel
            .findOne({ email: data.email })
            .select("-password"); // Exclude password
        if (!req.user) {
            return res.status(401).send("User not found");
        }
        next(); // Proceed to the next middleware
    } catch (error) {
        res.status(401).send("Not authorized");
    }
};