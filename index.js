const express = require("express");
const cors = require("cors");
const app = express();

const corsOptions = {
  origin: [
    "https://stalwart-zuccutto-ff1300.netlify.app",
    "http://localhost:3000",
    "https://shoppinglist-19c2d.firebaseapp.com",
    "https://shoppinglist-19c2d.web.app",
  ],
};
const PORT = 8080;

app.use(cors(corsOptions));
app.use(express.json());
require("dotenv").config();

app.listen(PORT, () => {
  console.log(`[RUNNING] on port: ${PORT}`);
});
