const express = require('express');
const {notFoundErr, globalErrHandler} = require('./middlewares/globalErrHandler');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const userRouter = require('./routes/authRoutes');
const productRouter = require('./routes/productRoutes');
const blogRouter = require('./routes/blogRoutes');

require('dotenv').config();
require('./config/dbConnect');

const app = express();

// middlewares
app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


// routes
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/blog', blogRouter);

app.use(globalErrHandler);
app.use(notFoundErr);

PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`server is up and running at Port ${PORT}`);
});