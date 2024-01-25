import taskModel from "../models/taskModel.js";
import userModel from "../models/userModel.js";
import subTaskModel from "../models/subTaskModel.js"; 

export const createSubTaskController = async (req, res) => {
    try {
        const { task_id } = req.body;

        if (!task_id) {
            return res.send({ message: "Task_id is required" });
        }

        const userId = req.user._id;
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        const task = await subTaskModel.create({ task_id, user_id: userId });
        const formatOptions = {
            timeZone: 'Asia/Kolkata',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        };

        const newtask = {
            ...task.toObject(),
            updatedAt: new Date(task.updatedAt).toLocaleString('en-IN', formatOptions),
            createdAt: new Date(task.createdAt).toLocaleString('en-IN', formatOptions),
        };

        res.status(201).send({
            success: true,
            message: "Sub task Added Successfully",
            task: newtask,
        });
    } catch (err) {
        console.log(err);
        res.status(500).send({
            success: false,
            message: 'Error in adding a Sub task',
            err,
        });
    }
};

export const getAllUserSubTasksController = async (req, res) => {
    try {
        const { id } = req.params; 
        const { user_id } = req.user; 

        const filter = { task_id: id, user_id };
        const subTasks = await subTaskModel.find(filter);
        const formatOptions = {
            timeZone: 'Asia/Kolkata',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        };

        const tasks = subTasks.map(subTask => ({
            ...subTask.toObject(), 
            updatedAt: new Date(subTask.updatedAt).toLocaleString('en-IN', formatOptions),
            createdAt: new Date(subTask.createdAt).toLocaleString('en-IN', formatOptions),
        }));

        res.status(200).json({
            success: true,
            tasks,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'Error in getting user subtasks',
            err,
        });
    }
};

export const updateSubTaskStatusController = async (req, res) => {
    try {
        const { subtaskId } = req.params;
        const { status } = req.body;

        console.log('Subtask ID:', subtaskId); 

        if (![0, 1].includes(status)) {
            return res.status(400).json({ message: 'Invalid status value. Must be 0 or 1.' });
        }

        const updatedSubTask = await subTaskModel.findByIdAndUpdate(
            subtaskId,
            { status },
            { new: true }
        );

        if (!updatedSubTask) {
            return res.status(404).json({ success: false, message: 'Subtask not found' });
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

        const formattedSubTask = {
            ...updatedSubTask.toObject(),
            updatedAt: new Date(updatedSubTask.updatedAt).toLocaleString('en-IN', formatOptions),
            createdAt: new Date(updatedSubTask.createdAt).toLocaleString('en-IN', formatOptions),
        };

        res.status(200).json({
            success: true,
            message: 'Subtask status updated successfully',
            subTask: formattedSubTask,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'Error updating subtask status',
            err,
        });
    }
};

export const deleteSubTaskByIdController = async (req, res) => {
    try {
        const { subtaskId } = req.params;
        const userId = req.user._id;

        const deletedSubTask = await subTaskModel.findByIdAndUpdate(
            subtaskId,
            {
                $set: {
                    deletedAt: new Date(),
                    deletedBy: userId,
                },
            },
            { new: true }
        );

        if (!deletedSubTask) {
            return res.status(404).json({ success: false, message: 'Subtask not found' });
        }

        res.status(200).json({
            success: true,
            message: 'Subtask deleted successfully',
            subTask: {
                ...deletedSubTask.toObject(),
                deletedAt: new Date(deletedSubTask.deletedAt).toLocaleString('en-IN', {
                    timeZone: 'Asia/Kolkata',
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                }),
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'Error deleting subtask',
            err,
        });
    }
};
