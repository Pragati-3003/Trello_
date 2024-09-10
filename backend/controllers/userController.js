import User from "../models/User.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

//Genetate JWT token
const ganerateToken =(id)=>{
    return jwt.sign({id},
        process.env.JWT_SECRET,{
            expiresIn: '30d'
        })
}


const register = async(req,res)=>{
     const {username,email,password} = req.body;
     if (!username || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    try{
        const userExists = await User.findOne({email});
        if(userExists){
            res.status(400).json({message:"User already exists"})
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);
        const user = new User({
            username,
            email,
            password:hashedPassword,
        })
       const savedUser= await user.save();
        res.status(201).json({
            _id:savedUser._id,
            username:savedUser.username,
            email:savedUser.email,
            token:ganerateToken(savedUser._id),
            message:"User created successfully"
        })

    }
    catch (err) {
        console.log(err)
        res.status(500).json({ message: "Server Error" })
    }
}

const login = async(req,res)=>{
    try{
     
        const {email,password} = req.body;
        const user = await User.findOne({email});
        if(!user){
            res.status(400).json({message:"User does not exist"})
            return;
        }
        
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            res.status(400).json({message:"Wrong password"})
            return
        }
         res.status(200).json({
            _id:user._id,
            username:user.username,
            email:user.email,
            token:ganerateToken(user._id),
            message:"Login Successful"
        })

    }catch(err){
        console.error('Error logging in user:', err.message);
        res.status(500).json({ message: "Server Error" });
    }
}

const logout = async(req,res)=>{
    try{
        res.status(200).json({message:"Logged out successfully"})
    }catch(err){
        console.log(err)
        res.status(500).json({ message: "Server Error" })
    }
}

export {register,login,logout}