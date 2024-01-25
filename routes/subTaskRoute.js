import express from "express";
import { } from "../controllers/authController.js";
import {requireSignIn,formatDate} from "../middlewares/authMiddleware.js";
import { createSubTaskController, deleteSubTaskByIdController, getAllUserSubTasksController, updateSubTaskStatusController } from "../controllers/subTaskController.js";

const router=express.Router();

router.post('/create-subtask',requireSignIn,createSubTaskController);
router.get('/get-subtasks/:id',requireSignIn,getAllUserSubTasksController);
router.put('/update-subtask/:subtaskId',requireSignIn,updateSubTaskStatusController);
router.delete('/delete-subtask/:subtaskId',requireSignIn,deleteSubTaskByIdController)

export default router;