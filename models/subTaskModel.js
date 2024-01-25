import mongoose from "mongoose";

const subTaskSchema = new mongoose.Schema(
    {
        task_id:{
            type:mongoose.ObjectId,
            ref:"tasks",
            required:true
        },
        status:{
            type:Number,
            required:true,
            default:0
        },
        deletedAt:{
            type:Date,
            default:null
        }
    },{timestamps:true}
)

export default mongoose.model('subtasks',subTaskSchema);
