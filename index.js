const express = require('express');
const dbConnect = require('./config/dbConnect');
require('dotenv').config();

const app = express();
PORT = process.env.PORT || 3000;
 
dbConnect();
app.listen(PORT, () => {
    console.log(`server is up and running at Port ${PORT}`);
});