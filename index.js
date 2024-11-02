require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const path = require('path');
const port = process.env.PORT || 3000;


const UserRoute = require('./routes/userRoute');
const AdminRoute = require('./routes/recordRoute');


app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));




app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/', UserRoute);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api', AdminRoute);

// app.use('/admin-route', AdminRoute);

mongoose.connect(process.env.MONGODB_URI, {
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
