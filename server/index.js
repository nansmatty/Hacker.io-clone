const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const authRoute = require('./routes/auth');

const app = express();

dotenv.config();

app.use(express.json());

app.use('/api', authRoute);

const port = process.env.PORT || 5000;

app.listen(port, console.log(`Server running on port ${port} 🔥`));
