import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoute from "./routes/authRoute.js";
import taskRoute from "./routes/taskRoute.js";
import subTaskRoute from "./routes/subTaskRoute.js";
import cors from "cors";
import twilio from 'twilio';
import cron from "cron";
import taskModel from "./models/taskModel.js";
import userModel from "./models/userModel.js";

dotenv.config();
const app = express();
connectDB();
app.use(express.static('public'));

app.use(cors());
app.use(express.json());

app.use('/api/v1/auth', authRoute);
app.use('/api/v1/task', taskRoute);
app.use('/api/v1/subtask', subTaskRoute);
const accountSid = process.env.twilio_account_sid;
const authToken = process.env.twilio_auth_token;
const client = twilio(accountSid, authToken);

const job = new cron.CronJob('0 * * * * *', async () => {
  try {
    const overdueTasks = await taskModel
      .find({
        due_date: { $lt: new Date() }
      })
      .sort({ due_date: 'asc' });

    if (overdueTasks.length > 0) {
      const userIDs = overdueTasks.map(task => task.user_id);

      const users = await userModel
        .find({ _id: { $in: userIDs } })
        .sort({ priority: 'asc' });

      console.log('Users with overdue tasks sorted by priority:', users);
      for (const task of users) {
       const calls = await client.calls.list({
          to: task.phone_number,
          limit: 1
        });

        if (calls.length > 0 && calls[0].status === 'completed') {
          console.log(`User ${task.phone_number} already answered the call.`);
        } else {
          const call = await client.calls.create({
            url: 'http://demo.twilio.com/docs/voice.xml',
            to: task.phone_number,
            from: '+16306347109'
          });

          console.log('Twilio Call SID:', call.sid);
        }
      }
    } else {
      console.log('No overdue tasks found.');
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
});

// Start the CronJob
job.start();


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});










