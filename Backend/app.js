const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const expressJwt = require('express-jwt');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

// Database connection
mongoose.connect('mongodb://localhost:27017/mydb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log("DATABASE CONNECTED");
  })
  .catch(err => console.log("Error connecting to MongoDB: " + err));

// Routes
app.get('/', (req, res) => {
  res.send('Hello, this is your Express server!');
});

// Error handling middleware
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).send('Unauthorized');
  } else {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running at ${PORT} ......`);
});

