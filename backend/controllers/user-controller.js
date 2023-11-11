import express from 'express';
import User from "../model/User";
import bcrypt from 'bcrypt';

export const getalluser=async(req,res,next)=>{
    let users;
    try{
        users=await User.find();
    }
    catch(e){
       return  console.log(e);
    }
    if(!users){
        return res.status(404).json({message:"No user found"});
    }
    return res.status(200).json({users});
}
export const signup = async (req, res, next) => {
    const { name, email, password } = req.body;
    
    try {
      // Check if a user with the same email already exists
      const existing = await User.findOne({ email });
  
      if (existing) {
        return res.status(400).json({ message: "User already exists. Please log in." });
      }
  
      // Hash the user's password
      const saltRounds = 10;
      const salt = bcrypt.genSaltSync(saltRounds);
      const hashPassword = bcrypt.hashSync(password, salt);
  
      // Create and save the new user
      const user = new User({
        name,
        email,
        password: hashPassword,
        blogs: [],
      });
  
      await user.save();
      return res.status(201).json({ user });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error." });
    }
  };
  
export const login=async(req,res,next)=>{
    const {email,password}=req.body;
    let existing;
    try{
        existing=await User.findOne({ email});
    }
    catch(e){
        console.log(e);
    }
    if(!existing){
        return res.status(404).json({message:"couldnt find user with this email"})
    }
    const ispass=bcrypt.compareSync(password,existing.password);
    if(!ispass){
        return res.status(400).json({message:"incorrect password"})
    }
    return res.status(200).json({message:"login successfull",user:existing})

}