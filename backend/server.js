
const express = require('express');
const session = require('express-session');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db');
const path = require('path');

const userRoute = require('./routes/userRoutes.js');
const schoolRoutes = require('./routes/schoolRoutes.js');
const adminRoutes = require('./admin/routes/adminRoutes.js');


//configure env
dotenv.config();

//database config
connectDB();

//rest object
const app = express();

// Configure session middleware
app.use(session({
    secret: 'SecretKey',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set secure: true if using HTTPS
}));

//middlewares
app.use(express.json());
app.use(morgan('dev'));

// Set EJS as template engine
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'admin/views'));


//rest api
// app.get('/', (req, res) => {
//     res.send({
//         message: "Welcome to Guidance Home",
//     })
// })

app.use('/api/v1/uploads', express.static(path.join(__dirname, 'uploads')));
//routes
app.use('/api/v1/user', userRoute);
app.use('/api/v1/school', schoolRoutes);

//---------------------Routes for Admin-------------------------//
app.use('/admin', adminRoutes);


//---------------------End Routes for Admin--------------------//


//port
const port = process.env.PORT || 5050;

//app listen
app.listen(port, () => console.log(`Server running at ${port}`));
