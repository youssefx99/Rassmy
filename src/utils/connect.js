const mongoose = require("mongoose");

const DataBaseConnect = (str) => {
  mongoose.connect(str, console.log("DataBase Connected"));
};

module.exports = DataBaseConnect;
