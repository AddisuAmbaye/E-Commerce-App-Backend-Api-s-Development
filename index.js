const express = require('express');
const userRouter = require('./routes/authRoutes');
const globalErrHandler = require('./middlewares/globalErrHandler');

require('dotenv').config();
require('./config/dbConnect');

const app = express();

app.use(express.json());

app.use('/api/user', userRouter);

app.use(globalErrHandler)

PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`server is up and running at Port ${PORT}`);
});