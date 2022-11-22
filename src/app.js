const express = require('express');
const swaggerUI = require('swagger-ui-express');

const app = express();
const router = require('./router');

app.use(express.json());
app.use(router);

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(require('./swagger.json')));

module.exports = app;
