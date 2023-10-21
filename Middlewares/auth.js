
//auth, isstudent, isAdmin

const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.auth = (req, res, next) => {
    try{

        console.log(req.cookies.token);
        console.log(req.body.token);

        //fetch token

        const token = req.cookies.token || req.body.token || req.header("Authentication").replace("Bearer ","") ;

        //check token
        if(!token || token==undefined){
            return res.status(401).json({
                success:false,
                message:"Token is Missing",
            })
        }

        try{

            const decode = jwt.verify(token, process.env.JWT_SECRET);
            console.log(decode);

            req.user = decode;
        }catch(err){
            return res.status(401).json({
                success:false,
                message:"Token is Invalid",
            })
        }

        next();

    } catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Error fetchging the middlewaare",
        });
    }
}

exports.isStudent = (req,res,next) =>{
    try{

        if(req.user.role !== "Student"){
            return res.status(401).json({
                success:false,
                message:"this is protected route for student",
            });
        }

        next();

    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"User role student not matching",
        });
    }
}

exports.isAdmin = (req,res,next) =>{
    try{

        if(req.user.role !== "Admin"){
            return res.status(401).json({
                success:false,
                message:"this is protected route for Admin",
            });
        }

        next();

    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"User role Admin not matching",
        });
    }
}