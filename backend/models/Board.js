import mongoose from "mongoose";

const boardSchema = mongoose.Schema({
    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    color:{
        type:String,
        default:"white"
    },
    lists: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'List'
        }
    ]
}, { timestamps: true });

const Board = mongoose.model('Board',boardSchema);
export default Board;