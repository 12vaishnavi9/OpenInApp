import express from "express";
import {createTaskController,getTaskController, 
    updateTaskStatusController,deleteTaskController,getTaskByDueDateController, getTasksByPriorityController, getTasksBySpecificPriorityController, getAllUserTasksWithPagination, updateTaskControllerviaDueDate,} from "../controllers/taskController.js";
import {requireSignIn,formatDate} from "../middlewares/authMiddleware.js";

const router=express.Router();

router.post('/create-task',requireSignIn,formatDate('DD-MM-YY'),createTaskController);
router.get('/get-tasks',requireSignIn,getTaskController);
router.get('/get-task-due-date/:due_date',requireSignIn,getTaskByDueDateController);
router.put('/update-task-duedate/:id',requireSignIn,updateTaskControllerviaDueDate);
router.put('/update-task-status/:task_id',requireSignIn,updateTaskStatusController);
router.get('/get-tasks-by-priority',requireSignIn,getTasksByPriorityController);
router.get('/get-task-by-specefic-priority/:priority',requireSignIn,getTasksBySpecificPriorityController);
router.get('/get-tasks-pagination/:page/:pageSize',requireSignIn,getAllUserTasksWithPagination)
router.delete('/delete-task/:id',requireSignIn,deleteTaskController);

export default router;