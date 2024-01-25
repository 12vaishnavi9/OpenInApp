import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        id:{
            type:Number,
            required:true
        },
        phone_number:{
            type:String,
            required:true
        },
        priority:{
            type:Number
        },
        attendedCall: {
          type: Boolean,
          default: false, // Default value is false (not attended)
        }
    },{timestamps:true}
)

export default mongoose.model('users',userSchema);
