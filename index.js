const express = require('express');
const userRouter = require('./routes/authRoutes');
const {notFoundErr, globalErrHandler} = require('./middlewares/globalErrHandler');
const cookieParser = require('cookie-parser');
const productRouter = require('./routes/productRoutes');
const morgan = require('morgan');
const bodyParser = require('body-parser');

require('dotenv').config();
require('./config/dbConnect');

const app = express();

// middlewares
app.use(express.json());
app.use(morgan());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


// routes
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);

app.use(globalErrHandler)
app.use(notFoundErr)

PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`server is up and running at Port ${PORT}`);
});