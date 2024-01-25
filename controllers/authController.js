import userModel from "../models/userModel.js";
import {compareNumber } from "../helpers/authHelper.js";
import Jwt from "jsonwebtoken";


export const registerController = async (req, res) => {
    try {
        const { id, phone_number, priority } = req.body;

        if (!phone_number) {
            return res.status(400).send({ message: "Phone Number is Required" });
        }
        const checkUser = await userModel.findOne({ id });

        if (checkUser) {
            return res.status(200).send({
                success: false,
                message: "Already registered or Choose another id!",
            });
        }

        const user = await new userModel({ id, phone_number, priority }).save();

        res.status(201).send({
            success: true,
            message: "User Registered Successfully",
            user,
        });
    } catch (err) {
        console.log(err);
        res.status(500).send({
            success: false,
            message: "Error in Registration",
            err,
        });
    }
};

export const loginController=async(req,res)=>{
    try{
        const {id,phone_number}=req.body
        if(!id || !phone_number){
            return res.status(404).send({
                success:false,
                message:"Invalid id or Contact Number"
            })
        }
        const user=await userModel.findOne({id})
        if(!user){
            return res.status(404).send({
                success:false,
                message:"Id is not registered"
            })
        }
        const match=await compareNumber(phone_number,user.phone_number)
        if(!match){
            return res.status(200).send({
                success:false,
                message:"Incorrect Phone Number"
            })
        }
    const token=await Jwt.sign({_id:user._id},process.env.JWT_SECRET,{expiresIn:"7d"})
    res.status(200).send({
        success:true,
        message:"Login successfully",
        user:{
            id:user.id,
            phone_number:user.phone_number,
        },
        token
    })
    }catch(err){
        console.log(err)
        res.status(500).send({
            success:false,
            message:"Error in login",
            err
        })
    }
}

