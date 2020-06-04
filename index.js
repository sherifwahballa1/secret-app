const path = require('path');
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize'); //for nosql injection
const xxs = require('xss-clean'); //for injection
const hpp = require('hpp');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const compression = require('compression');

const rateLimit = require('express-rate-limit'); // to prevent many of requests from the same ip and prevent from attakers
const userRouter = require('./routers/userRouter');
const AppError = require('./utils/appError');
const globalError = require('./controllers/errorController');
const postRouter = require('./routers/postRouter');
const commentRouter = require('./routers/commentRouter');
const viewRouter = require('./routers/viewRoutes');
const followerRouter = require('./routers/followerRouter');
const likeRouter = require('./routers/likeRouter');

const passportFacebook = require('./passport/facebook');

const app = express();
app.enable('trust proxy');
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// 1) GLOBAL MIDDLEWARES
// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

// Set security HTTP headers
app.use(helmet());

//Development Logging
if (process.env.NODE_ENV === 'development') {
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
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

//Data sanitization against NoSQL Query injection
app.use(mongoSanitize()); // prevent from NoSQL injection like (email:{"$gt":""}) in body

// Data sanitization aganist cross-site scripting (XSS)
app.use(xxs()); //prevent if code contain html code or js code in body and convert it to symboles known

app.use(compression());

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  console.log('Hello From the Middleware 😁');
  next();
});

app.use('/', viewRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/posts', postRouter);
app.use('/api/v1/comments', commentRouter);
app.use('/api/v1/followers', followerRouter);
app.use('/api/v1/likes', likeRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`can't find ${req.originalUrl} on this server`, 404));
});

//create global error middleware
app.use(globalError);

module.exports = app;
