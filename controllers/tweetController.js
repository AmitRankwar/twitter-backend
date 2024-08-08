import { Tweet } from "../model/tweetSchema.js";
import {User}  from "../model/userSchema.js"
export const createTweet = async (req, res) => {
    try {
        const { description, userId } = req.body;
        // console.log(description);
        // console.log(userId)
        if (!description || !userId) {
            return res.status(401).json({
                message: "All fields are required",
                success: false
            });
        }
        await Tweet.create({
            description,
            userId: userId
        });
        return res.status(201).json({
            message: "Tweet Created Successfully",
            success: true
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
};
export const deleteTweet = async (req,res) => {
    const {id} = req.params;
    await Tweet.findByIdAndDelete(id);
    return res.status(201).json({
        message:"Tweet deleted successfully",
        success:true
    })
}


export const likeOrDislike = async (req, res) => {
    try {
        const loggedInUserId = req.body.id;
        const tweetId = req.params.id;
        const tweet = await Tweet.findById(tweetId);

        console.log(loggedInUserId)

        if (!tweet) {
            return res.status(404).json({
                message: "Tweet not found",
                success: false
            });
        }

        // Ensure the likes array is defined
        if (!Array.isArray(tweet.like)) {
            tweet.like = [];
        }
       // console.log(loggedInUserId)
        if (tweet.like.includes(loggedInUserId)) {
            // Dislike
            await Tweet.findByIdAndUpdate(
                tweetId,
                { $pull: { like: loggedInUserId } },
                { new: true } // Return the updated document
            );
            return res.status(200).json({
                message: "User disliked tweet",
                success: true
            });
        } else {
            // Like
            await Tweet.findByIdAndUpdate(
                tweetId,
                { $push: { like: loggedInUserId } },
                { new: true } // Return the updated document
            );
            return res.status(200).json({
                message: "User liked tweet",
                success: true
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
};


export const getAllTweet = async (req, res) => {
    try {
        const id = req.params.id;
        const loggedInUser = await User.findById(id);
        
        if (!loggedInUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const loggedInUserTweets = await Tweet.find({ userId: id });
        // console.log(loggedInUserTweets)
        const followingUserTweets = await Promise.all(
            loggedInUser.following.map(otherUserId => {
                return Tweet.find({ userId: otherUserId });
            })
        );

        return res.status(200).json({
            tweets: loggedInUserTweets.concat(...followingUserTweets)
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "An error occurred",
            error: error.message
        });
    }
};

export const getFollowingTweet = async (req, res) => {
    try {
        const id = req.params.id;
        const loggedInUser = await User.findById(id);

        if (!loggedInUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const followingUserTweets = await Promise.all(
            loggedInUser.following.map(otherUserId => {
                return Tweet.find({ userId: otherUserId });
            })
        );

        return res.status(200).json({
            tweets: [].concat(...followingUserTweets)
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "An error occurred",
            error: error.message
        });
    }
};
