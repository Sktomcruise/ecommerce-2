const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const url = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/ecommercesite";
    await mongoose
      .connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .catch((error) => console.log(error));
    const connection = mongoose.connection;
    console.log("MONGODB CONNECTED SUCCESSFULLY!");
  } catch (error) {
    console.log(error);
    return error;
  }
};

module.exports = connectDB;