const express = require('express');
const authRoute = require('./routes/auth');

const app = express();

app.use(express.json());

app.use('/api', authRoute);

const port = process.env.PORT || 5000;

app.listen(port, console.log(`Server running on port ${port} 🔥`));
