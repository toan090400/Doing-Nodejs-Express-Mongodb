const express = require('express')
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser')

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

//1 Middleware
// Set security HTTP headers
app.use(helmet());

// Development logging
if( process.env.NODE_ENV === 'development' ){
    app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
// app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());



app.use((req, res,next) => {
    req.requestTime = new Date().toISOString();
    // console.log(req.cookies);
    next();
});

// console.log(slugify('Duc Toan',{lower:'true'}));

// 2 handler
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');

// 3 routers

app.use('/api/v1/tours',tourRouter);
app.use('/api/v1/users',userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/views', viewRouter);


app.all('*',(req, res,next)=>{
    res.status('404').json({
        status: 'fail',
        message: `Can't find ${req.originalUrl} on server`,
    });
    next();
});


// 4 server
module.exports = app;
