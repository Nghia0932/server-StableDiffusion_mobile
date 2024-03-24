const express = require('express');
const cors = require('cors');
const authRouter = require('./src/routers/authRouter');
const socialRouter = require('./src/routers/socialRouter');
const connectDB = require('./src/configs/connectDb');
const {errorMiddleHandle} = require('./src/middlewares/errorMiddleware');
const app = express();
require('dotenv').config();

app.use(cors());
app.use(express.json());

const PORT = 3001;

app.use('/auth', authRouter);
app.use('/social', socialRouter);
connectDB();

app.use(errorMiddleHandle);

app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log(`Server is starting on http://192.168.1.6:${PORT}`);
});
