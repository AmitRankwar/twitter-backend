import mongoose from 'mongoose';
import { User } from "../model/userSchema.js";
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken'

export const Register = async(req, res) => {
    try {
        const { name, username, email, password } = req.body;

        // Check if all fields are provided
        if (!name || !username || !email || !password) {
            return res.status(401).json({
                message: "All fields are required",
                success: false
            });
        }

        // Check if the user already exists
        const user = await User.findOne({ email });
        if (user) {
            return res.status(401).json({
                message: "User already exists",
                success: false
            });
        }
        const hashedPassword = await bcryptjs.hash(password,16)

     await User.create({
        name,
        username,
        email,
        password:hashedPassword
     })

        res.status(201).json({
            message: "User registered successfully",
            success: true
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Server error",
            success: false
        });
    }
};

export const Login = async (req,res)=>{
    try {
        const {email, password } =req.body;
        if(!email || !password){
            return res.status(401).json({
                message: "All fields are required",
                success: false
            });
        }
        const user = await User.findOne({email});
        if(!user){
            return res.status(401).json({
                message:"user doest not exists with this email",
                success:false
            })

        }
        const isMatch = await bcryptjs.compare(password,user.password)
        if(!isMatch){
            return res.status(401).json({
                message:"wrong password",
                success:true
            })
        }
        const tokenData = {
            userId: user._id
        }
         const token = await jwt.sign(tokenData,process.env.TOKEN_SECRET,{expiresIn:"1d"})

        return res.status(201).cookie("token",token,{expiresIn:"1d",httpOnly:true})  .json({
            message: "User login successfully",
            user,
            success: true
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Server error",
            success: false
        });
        
    }
}

export const Logout = (req, res) => {
    return res.cookie("token", "", { expires: new Date(0), httpOnly: true })
        .json({
            message: "Logged out successfully",
            success: true
        });
};

export const Bookmark = async (req, res) => {
    try {
        const loggedInUserId = req.body.id;
        const tweetId = req.params.id;
        const user = await User.findById(loggedInUserId);
        if (user.bookmarks.includes(tweetId)) {
            // Bookmark exists, so remove it
            await User.findByIdAndUpdate(loggedInUserId, { $pull: { bookmarks: tweetId } });
            return res.status(201).json({
                message: "Removed from bookmark"
            });
        } else {
            // Bookmark doesn't exist, so add it
            await User.findByIdAndUpdate(loggedInUserId, { $push: { bookmarks: tweetId } });
            return res.status(201).json({
                message: "Added to bookmark section"
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
};

export const getMyProfile = async (req,res) => {
    try {
        const id = req.params.id;
        const user = await User.findById(id).select("-password");
        return res.status(201).json({
            user
        })
        
    } catch (error) {
        console.log(error)
    }
}



export const getOtherUser = async (req, res) => {
    try {
        const { id } = req.params;
        const otherUsers = await User.find({ _id: { $ne:new  mongoose.Types.ObjectId(id) } }).select("-password");
        if (otherUsers.length === 0) {
            return res.status(401).json({
                message: "Currently no other users present"
            });
        }
        return res.status(201).json({
            otherUsers
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
};
export const follow = async (req, res) => {
    try {
        const loggedInUserId = req.body.id;
        const userId = req.params.id;

        const loggedInUser = await User.findById(loggedInUserId); // sumit
        const user = await User.findById(userId); // amit

        if (!loggedInUser || !user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (!user.followers.includes(loggedInUserId)) {
            await user.updateOne({ $push: { followers: loggedInUserId } });
            await loggedInUser.updateOne({ $push: { following: userId } });

            return res.status(200).json({
                message: `${loggedInUser.name} started following ${user.name}`
            });
        } else {
            return res.status(400).json({
                message: `User already follows ${user.name}`
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "An error occurred",
            error: error.message
        });
    }
};

export const unFollow = async (req, res) => {
    try {
        const loggedInUserId = req.body.id;
        const userId = req.params.id;

        const loggedInUser = await User.findById(loggedInUserId); // sumit
        const user = await User.findById(userId); // amit

        if (!loggedInUser || !user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (loggedInUser.following.includes(userId)) {
            await user.updateOne({ $pull: { followers: loggedInUserId } });
            await loggedInUser.updateOne({ $pull: { following: userId } });

            return res.status(200).json({
                message: `${loggedInUser.name} unfollows ${user.name}`,
                success: true
            });
        } else {
            return res.status(400).json({
                message: `User does not follow ${user.name} yet`
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "An error occurred",
            error: error.message
        });
    }
};
