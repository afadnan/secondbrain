import mongoose from "mongoose";

const {Schema} = mongoose;

const userSchema = new Schema({
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true}
})
const tagSchema = new Schema({
    title:{type:String}
})
const contentType = ['image', 'video', 'article', 'audio','tweets'];
const contentSchema = new Schema({
    title:{type:String,required:true},
    link:{type:String},
    type:{type:String,enum:contentType,required:true},
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
