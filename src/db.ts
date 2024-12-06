import mongoose from "mongoose";

const {Schema} = mongoose;

const userSchema = new Schema({
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true}
})
const tagSchema = new Schema({
    title:{type:String}
})
const contentType = ["article","art","image","video","audio","politics","fun","personal"];
const contentSchema = new Schema({
    title:{type:String},
    link:{type:String},
    type:{type:String,enum:contentType},
    tags:[{type:mongoose.Schema.Types.ObjectId, ref:"Tag", required:true}],
    userId:{type:mongoose.Schema.Types.ObjectId, ref:"User", required:true}
})

const linkSchema = new Schema({
    hash:{type:String,required:true},
    userId:{type:mongoose.Schema.Types.ObjectId, ref:"User", required:true}
})

const UserModel = mongoose.model("User",userSchema);
const ContentModel = mongoose.model("Content",contentSchema);
const TagModel= mongoose.model("Tag",tagSchema);
const LinkModel= mongoose.model("Link",linkSchema);

export{
    UserModel,
    ContentModel,
    TagModel,
    LinkModel
}
