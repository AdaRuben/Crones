const express = require('express');

const morgan = require('morgan');
const path = require('path');
const cookieParser = require('cookie-parser');

const adminAuthRouter = require('./routes/adminAuth.routes');
const orderRouter = require('./routes/order.routes');

const authRouter = require('./routes/auth.router');

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/api/admin', adminAuthRouter);
app.use('/api/orders', orderRouter);
app.use('/api/auth', authRouter);

module.exports = app;
