import mongoose from 'mongoose';
const userSchema = mongoose.Schema({
    username:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    boards :[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Board'
        }
    ]
},{timestamps:true});

const User = mongoose.model('User',userSchema);
export default User;