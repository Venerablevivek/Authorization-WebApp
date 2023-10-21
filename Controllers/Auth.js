
const bcrypt = require("bcrypt");
const User = require("../Models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();


//signup
exports.signup = async(req,res) => {
    try{
        //fetch data
        const {name, email, password, role} = req.body;
        //check existing user

        const existingUser = await User.findOne({email});

        if(existingUser){
            return res.status(400).json({
                success:false,
                message:"User Already Exists",
            })
        }

        //Secure Paasword
        let hashedPassword;
        try{
            hashedPassword = await bcrypt.hash(password,10);
        }catch(err){
            return res.status(500).json({
                success:false,
                message:"Error in hashing Paaword",
            })
        }

        //create new User
        const user = await User.create({
            name,email,password:hashedPassword,role
        });

        return res.status(200).json({
            success:true,
            message:"User Created Successfully",
        })

    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"User Cannot be created, Please try Again Later",
        })
    }
}

//login
exports.login = async(req,res) => {
    try{

        //fetch data
        const {email, password} = req.body;

        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"Please fill all the required fields",
            })
        }

        //check user exist or not
        let user = await User.findOne({email});

        if(!user){
            return res.status(401).json({
                success:false,
                message:"User is not registered",
            })
        }

        const payload = {
            email: user.email,
            id:user._id,
            role:user.role,
        }
        //Verify password and generate a JWT token
        if(await bcrypt.compare(password, user.password)){
            //password match
            let token  = jwt.sign(payload,
                                  process.env.JWT_SECRET,
                                  {
                                    expiresIn:"2h",
                                  });

            // user.token = token;
             user = user.toObject();
           // user.token = token;
            user.password = undefined;
            const options = {
                expires: new Date(Date.now() + 3*24*60*60*1000 ),
                httpOnly: true,
            }

            res.cookie("token", token, options).status(200).json({
                success:true,
                token,
                user,
                message:"User logged in Successfully",
            });

        }else{

            //password do not match

            return res.status(403).json({
                success:false,
                message:"Paasword Incorrect",
            });
        }

    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Login Failure",
        })
    }
}