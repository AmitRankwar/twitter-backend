import mongoose, { model }   from "mongoose";

const userSchema = mongoose.Schema ({
    name:{
        type: String,
        require:true
    }
    ,username:{
        type: String,
        require:true,
        unique:true
    }
    ,  email:{
        type: String,
        require:true,
        unique:true
    },
    password:{
        type: String,
        require:true
        
    },  followers:{
        type:Array,
        default:[]
    },   
     following:{
        type:Array,
        default:[]
    },
    bookmarks:{
        type: Array,
        default:[]
        
    },
   
},{
    timestamps:true
})

export const User = mongoose.model("User",userSchema) 