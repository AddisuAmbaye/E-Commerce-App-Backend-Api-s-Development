const express = require('express');
const userRouter = require('./routes/authRoutes');
const {notFoundErr, globalErrHandler} = require('./middlewares/globalErrHandler');
const cookieParser = require('cookie-parser');

require('dotenv').config();
require('./config/dbConnect');

const app = express();

app.use(cookieParser());
app.use(express.json());

app.use('/api/user', userRouter);

app.use(globalErrHandler)
app.use(notFoundErr)

PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`server is up and running at Port ${PORT}`);
});