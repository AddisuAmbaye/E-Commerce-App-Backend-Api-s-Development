const { default: mongoose } = require('mongoose');

const dbConnect = () => {
    try {
       const conn = mongoose.connect(process.env.MONGO_URL);
        console.log("Database connected successfully");
        
    } catch (error) {
        console.log("Database error");
    }

}
 
dbConnect()