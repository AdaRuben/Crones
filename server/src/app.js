const express = require('express');

const morgan = require('morgan');
const path = require('path');
const cookieParser = require('cookie-parser');

const adminAuthRouter = require('./routes/adminAuth.routes');
const orderRouter = require('./routes/order.routes');
const customerOrderRouter = require('./routes/customerOrder.routes');
const driverRouter = require('./routes/driver.routes');

const authRouter = require('./routes/auth.routes');

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/api/admin', adminAuthRouter);
app.use('/api/orders', orderRouter);
app.use('/api/drivers', driverRouter);
app.use('/api/auth', authRouter);
app.use('/api/customer/orders', customerOrderRouter);

module.exports = app;
