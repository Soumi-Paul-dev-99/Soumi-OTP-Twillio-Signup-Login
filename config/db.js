const mongoose = require("mongoose");
const connectDB = async ()=>{
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)
console.log(`DATABESE CONNECTION SUCCESSFULL ${conn.connection.host}`)
    } catch (error) {
        console.log(`database not connected ${error.message}`);
        process.exit(1)
    }
}

module.exports = connectDB;