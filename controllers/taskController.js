import taskModel from "../models/taskModel.js";
import userModel from "../models/userModel.js";
import subTaskModel from "../models/subTaskModel.js";
import moment from 'moment';
export const createTaskController = async (req, res) => {
    try {
        const { title, description, due_date } = req.body;
        let priority = 2; 
        const today = new Date();
        const parsedDueDate = moment(due_date, 'DD-MM-YYYY').toDate();
        const timeDiff = parsedDueDate.getTime() - today.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

        if (daysDiff === 0) {
            priority = 0;
        } else if (daysDiff >= 1 && daysDiff <= 2) {
            priority = 1;
        } else if (daysDiff >= 3 && daysDiff <= 4) {
            priority = 2;
        } else if (daysDiff >= 5) {
            priority = 3;
        }
        const user_id = req.user._id;

        const newTask = new taskModel({
            title,
            description,
            due_date: parsedDueDate,
            priority,
            user_id,
        });
        await newTask.save();
        const formatOptions = {
            timeZone: 'Asia/Kolkata',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        };

        const formattedTask = {
            ...newTask._doc,
            due_date: newTask.due_date.toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' }),
            updatedAt: new Date(newTask.updatedAt).toLocaleString('en-IN', formatOptions),
            createdAt: new Date(newTask.createdAt).toLocaleString('en-IN', formatOptions),
        };

        res.status(201).json({
            success: true,
            message: 'Task created successfully',
            task: formattedTask,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Error while creating the task',
            error,
        });
    }
};
  
export const getTaskController = async (req, res) => {
    try {
        const userId = req.user._id;

        const tasks = await taskModel.find({ user_id: userId });

        const formattedTasks = tasks.map(task => {
            return {
                ...task._doc,
                due_date: task.due_date.toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' }),
                updatedAt: new Date(task.updatedAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
                createdAt: new Date(task.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
            };
        });

        res.status(200).json({
            success: true,
            message: 'User tasks fetched successfully',
            tasks: formattedTasks,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export const getTaskByDueDateController = async (req, res) => {
    try {
        const { due_date } = req.params;
        if (!due_date) {
            return res.status(400).json({ success: false, message: 'Due date is required in the query parameters' });
        }
        const parsedDueDate = moment(due_date, 'DD-MM-YYYY').toDate();
        const tasks = await taskModel.find({ due_date: parsedDueDate  });

        if (!tasks || tasks.length === 0) {
            return res.status(404).json({ success: false, message: 'No tasks found for the specified due date' });
        }
        const formatOptions = {
            timeZone: 'Asia/Kolkata',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        };

        const formattedTasks = tasks.map((task) => ({
            ...task._doc,
            due_date: task.due_date.toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' }),
            updatedAt: new Date(task.updatedAt).toLocaleString('en-IN', formatOptions),
            createdAt: new Date(task.createdAt).toLocaleString('en-IN', formatOptions),
        }));

        res.status(200).json({
            success: true,
            message: 'Tasks fetched successfully',
            tasks: formattedTasks,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Error while fetching tasks by due date',
            error,
        });
    }
};

export const updateTaskControllerviaDueDate = async (req, res) => {
    try {
        const { due_date } = req.body;
        const { id } = req.params;

        if (!req.user || !req.user._id) {
            return res.status(401).send({ message: 'Unauthorized' });
        }
        const parsedDueDate = moment(due_date, 'DD-MM-YYYY').toDate();

        let priority = 2;

        const today = new Date();
        const timeDiff = parsedDueDate.getTime() - today.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

        if (daysDiff === 0) {
            priority = 0;
        } else if (daysDiff >= 1 && daysDiff <= 2) {
            priority = 1;
        } else if (daysDiff >= 3 && daysDiff <= 4) {
            priority = 2;
        } else if (daysDiff >= 5) {
            priority = 3;
        }

        const task = await taskModel.findByIdAndUpdate(
            id,
            { due_date: parsedDueDate, priority },
            { new: true }
        );

        if (!task) {
            return res.status(404).send({ message: 'Task not found' });
        }

        const formatOptions = {
            timeZone: 'Asia/Kolkata',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        };

        const formattedTask = {
            ...task._doc,
            due_date: task.due_date.toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' }),
            updatedAt: new Date(task.updatedAt).toLocaleString('en-IN', formatOptions),
            createdAt: new Date(task.createdAt).toLocaleString('en-IN', formatOptions),
        };

        res.status(200).send({
            success: true,
            message: 'Due Date and Priority Updated Successfully',
            task: formattedTask,
        });
    } catch (err) {
        console.log(err);
        res.status(500).send({
            success: false,
            message: 'Error while updating the task',
            err,
        });
    }
};

export const updateTaskStatusController= async (req, res) => {
    try {
        const { task_id } = req.params;

        if (!req.user || !req.user._id) {
            return res.status(401).send({ success: false, message: 'Unauthorized' });
        }
        const task = await taskModel.findById(task_id);

        if (!task) {
            return res.status(404).send({ success: false, message: 'Task not found' });
        }
        const subtasks = await subTaskModel.find({ task_id });

        if (subtasks.length === 0) {
            task.status = 'TODO';
        }
else{
    const completed=subtasks.every((subtask)=>subtask.status===1);
    if(completed)
    task.status='DONE';
    else
    task.status='IN_PROGRESS';
}
        await task.save();
        res.status(200).json({
            success: true,
            message: 'Task status updated successfully',
            task: {
                _id: task._id,
                status: task.status
            },
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: 'Error while updating the task status',
            err,
        });
    }
};


export const getTasksByPriorityController = async (req, res) => {
    try {
        const userId = req.user._id; 
        const tasks = await taskModel.find({ user_id: userId }).sort({ priority: 'asc' });
        const formatOptions = {
            timeZone: 'Asia/Kolkata', 
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        };

        const formattedTasks = tasks.map((task) => ({
            ...task._doc,
            createdAt: new Date(task.createdAt).toLocaleString('en-IN', formatOptions),
            updatedAt: new Date(task.updatedAt).toLocaleString('en-IN', formatOptions),
        }));

        res.status(200).json({
            success: true,
            message: 'Tasks fetched successfully',
            tasks: formattedTasks,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Error while fetching tasks by priority',
            error,
        });
    }
};

export const getTasksBySpecificPriorityController = async (req, res) => {
    try {
        const userId = req.user._id; 
        const { priority } = req.params;
        const parsedPriority = parseInt(priority, 10);
        if (isNaN(parsedPriority)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid priority provided in the URL path',
            });
        }
        const tasks = await taskModel.find({ user_id: userId, priority: parsedPriority });
        const formatOptions = {
            timeZone: 'Asia/Kolkata', 
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        };

        const formattedTasks = tasks.map((task) => ({
            ...task._doc,
            createdAt: new Date(task.createdAt).toLocaleString('en-IN', formatOptions),
            updatedAt: new Date(task.updatedAt).toLocaleString('en-IN', formatOptions),
        }));

        res.status(200).json({
            success: true,
            message: 'Tasks fetched successfully',
            tasks: formattedTasks,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Error while fetching tasks by specific priority',
            error,
        });
    }
};

export const getAllUserTasksWithPagination = async (req, res) => {
    try {
        const userId = req.user._id; 
        const { page , pageSize  } = req.params;
        const parsedPage = parseInt(page, 10);
        const parsedPageSize = parseInt(pageSize, 10);

        if (isNaN(parsedPage) || isNaN(parsedPageSize) || parsedPage <= 0 || parsedPageSize <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid page or pageSize provided in the query parameters',
            });
        }
        const skip = (parsedPage - 1) * parsedPageSize;
        const tasks = await taskModel.find({ user_id: userId })
            .sort({ createdAt: 'desc' }) 
            .skip(skip)
            .limit(parsedPageSize);
        const formatOptions = {
            timeZone: 'Asia/Kolkata', 
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        };

        const formattedTasks = tasks.map((task) => ({
            ...task._doc,
            createdAt: new Date(task.createdAt).toLocaleString('en-IN', formatOptions),
            updatedAt: new Date(task.updatedAt).toLocaleString('en-IN', formatOptions),
        }));

        res.status(200).json({
            success: true,
            message: 'Tasks fetched successfully',
            tasks: formattedTasks,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Error while fetching user tasks with pagination',
            error,
        });
    }
};

export const deleteTaskController = async (req, res) => {
    try {
        const { id } = req.params;

        if (!req.user || !req.user._id) {
            return res.status(401).send({ message: 'Unauthorized' });
        }

        const task = await taskModel.findByIdAndDelete(id);

        if (!task) {
            return res.status(404).send({ message: 'Task not found' });
        }

        const formatOptions = {
            timeZone: 'Asia/Kolkata',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        };

        const formattedTask = {
            ...task._doc,
            updatedAt: new Date(task.updatedAt).toLocaleString('en-IN', formatOptions),
            createdAt: new Date(task.createdAt).toLocaleString('en-IN', formatOptions),
        };

        res.status(200).send({
            success: true,
            message: "Task Deleted Successfully",
            task: formattedTask,
        });
    } catch (err) {
        console.log(err);
        res.status(500).send({
            success: false,
            message: "Error while deleting the task",
            err,
        });
    }
};
