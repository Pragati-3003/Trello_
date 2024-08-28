import mongoose from "mongoose";

const cardSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    description:{
        type:String,
    },
    listId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'List',
        required:true,
    },
    boardId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Board',
        required:true,
    },
}, { timestamps: true });

const Card = mongoose.model('Card',cardSchema);
export default Card;