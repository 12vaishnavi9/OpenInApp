import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
    {
        title:{
            type:String,
            required:true
        },
        description:{
            type:String,
            required:true
        },
        due_date:{
            type:Date,
            required:true
        },
        priority: {
            type: Number,
            default: 2, // Default priority
        },
        status:{
            type:String,
            default:"TODO"
        },
        user_id:{
            type:mongoose.ObjectId,
            ref:"users"
        }
    },{
        timestamps:true
    }
);


export default mongoose.model('tasks',TaskSchema);
