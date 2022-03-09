const express = require('express');
require('dotenv').config();
const morgan = require('morgan');
const cors = require('cors');
const authRoute = require('./routes/auth');
const userRoute = require('./routes/user');
const categoryRoute = require('./routes/category');
const linkRoute = require('./routes/link');
const connectDB = require('./config/db');

const app = express();
connectDB();

app.use(morgan('dev'));
app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_URL }));

app.use('/api', authRoute);
app.use('/api', userRoute);
app.use('/api', categoryRoute);
app.use('/api', linkRoute);

const port = process.env.PORT || 8000;

app.listen(port, console.log(`Server running on port ${port} 🔥`));
