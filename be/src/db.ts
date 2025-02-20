import mongoose from "mongoose";

const {Schema} = mongoose;

const userSchema = new Schema({
    userName:{type:String,required:true},
    email:{type:String},
    password:{type:String,required:true}
})
const tagSchema = new Schema({
    title:{type:String}
})
const contentType = ['image', 'video', 'article', 'audio','twitter','youtube'];
const contentSchema = new Schema({
    title:{type:String,required:true},
    link:{type:String},
    type:{type:String,enum:contentType,required:true},
    tags:[{type:mongoose.Schema.Types.ObjectId, ref:"Tag"}],
    userId:{type:mongoose.Schema.Types.ObjectId, ref:"User", required:true},
    contentId:{type:mongoose.Schema.Types.ObjectId, ref:"Content"}
})

const linkSchema = new Schema({
    hash:{type:String,required:true},
    userId:{type:mongoose.Schema.Types.ObjectId, ref:"User", required:true,unique:true}
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
