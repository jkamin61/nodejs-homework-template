const express = require('express');
const logger = require('morgan');
const cors = require('cors');
require('./config/config.passport')
const contactsRouter = require('./routes/api/contacts.routes');
const usersRouter = require('./routes/api/users.routes');
const uploadRoutes = require('./routes/api/upload.routes')
const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use('/api/contacts', contactsRouter);
app.use('/api/users', usersRouter);
app.use('/api/upload', uploadRoutes);
app.use((req, res) => {
    res.status(404).json({ message: 'Not found' });
});

app.use((err, req, res, next) => {
    res.status(500).json({ message: err.message });
});

module.exports = app;
