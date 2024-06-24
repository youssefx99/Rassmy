const app = require("./app");
const connect = require("./src/utils/connect");
require("dotenv").config();
const port = process.env.PORT || 3000;


app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
