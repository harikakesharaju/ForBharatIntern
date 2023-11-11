import mongoose from "mongoose";
import Blog from "../model/Blog";
import User from "../model/User";

export const getallblogs=async(req,res,next)=>{
    let blogs;
    try{
        blogs=await Blog.find().populate('user');
    }
    catch(e){
        console.log(e);
    }
    if(!blogs){
        return res.status(404).json({message:"no blogs found!"});
    }
    return res.status(200).json({blogs})
}

export const addBlog=async(req,res,next)=>{
    const {title,description,image,user}=req.body;
    let existinguser;
    try{
        existinguser=await User.findById(user);
    }
    catch(er){
        return console.log(er);
    }
    if(!existinguser){
        return res.status(400).json({message:"unable to find user by this id"})
    }
    const blog=new Blog({
        title,description,image,user,
    });
    try{
        const session =await mongoose.startSession();
        session.startTransaction();
        await blog.save({session});
        existinguser.blogs.push(blog);
        await existinguser.save({session});
        await session.commitTransaction();
    }
    catch(er){
        console.log(er);
        return res.status(500).json({message:{er}});
    }
    return res.status(200).json({blog});
}

//import mongoose from 'mongoose';

// export const addBlog = async (req, res, next) => {
//     const { title, description, image, user } = req.body;
//     let existingUser;

//     try {
//         existingUser = await User.findById(user);
//         if (!existingUser) {
//             return res.status(400).json({ message: "Unable to find user by this id" });
//         }

//         const session = await mongoose.startSession();
//         session.startTransaction();

//         const blog = new Blog({ title, description, image, user });

//         await blog.save({ session });
//         existingUser.blogs.push(blog);
//         await existingUser.save({ session });
//         await session.commitTransaction();
//         session.endSession();
        
//         return res.status(200).json({ blog });
//     } catch (err) {
//         console.error(err);
//         return res.status(500).json({ message: "Internal Server Error" });
//     }
// }

export const updateblog=async(req,res,next)=>{
    const {title,description}=req.body;
    const blogid=req.params.id;
    let blog;
    try{
    blog=await Blog.findByIdAndUpdate(blogid,{
        title,description
    })
}
    catch(er){
        return console.log(er);
    }
    if(!blog){
        return res.status(500).json({message:"unable to update"});
    }
    return res.status(200).json({blog});
}


export const getBlogId=async(req,res,next)=>{
    const id=req.params.id;
    let blog;
    try{
        blog=await Blog.findById(id);
    }
    catch(er){
       return console.log(er);
    }
    if(!blog){
        return res.status(500).json({message:"cannot find"})
    }
    return res.status(200).json({blog});
}

// export const delblog=async(req,res,next)=>{
//     const id=req.params.id;
//     let blog;
//     try{
//         blog=await Blog.findByIdAndRemove(id).populate('user');
//         await blog.user.blogs.pull(blog)
//         await blog.user.save();
//     }
//     catch(er){
//         console.log(er);
//     }
//     if(!blog){
//         return res.status(500).json({message:"cannot delete"})
//     }

//     return res.status(200).json({message:"successfully deleted"});
// }

export const delblog = async (req, res, next) => {
    const id = req.params.id;
    let blog;
    try {
        blog = await Blog.findByIdAndRemove(id).populate('user');

        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        // Remove the blog reference from the user's 'blogs' array
        const userId = blog.user;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.blogs.pull(blog);
        await user.save();
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }

    return res.status(200).json({ message: "Successfully deleted" });
};


// export const getByuserId=async(req,res,next)=>{
//     const userid=req.params.id;
//     let userblogs;
//     try{
//         userblogs=await User.findById(userid),populate("blogs");
//     }
//     catch(er){
//        return  console.log(er);
//     }
//     if(!userblogs){
//         return res.status(404).json({message:"no blogs found"});
//     }
//     return res.status(200).json({blogs:userblogs});
// }

export const getByuserId = async (req, res, next) => {
    const userid = req.params.id;
    let userblogs;
    try {
        userblogs = await User.findById(userid).populate("blogs");
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
    if (!userblogs) {
        return res.status(404).json({ message: "No blogs found" });
    }
    return res.status(200).json({ user: userblogs });
};
