import mongoose, { model }   from "mongoose";

const tweetSchema = mongoose.Schema ({
    description:{
        type: String,
        require:true
    }
    ,like:{
        type: [String],
        default:[]
    }
    ,  userId:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"User",
    }
  
},{
    timestamps:true
})

export const Tweet = mongoose.model("Tweet",tweetSchema) 