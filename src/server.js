const swagger = require('./swagger');

let server;
swagger.then(() => {
    const app = require('./app');
    server = app.listen(3000, () => {
        console.log('Server is listening on port 3000');
    });
}).catch(err => {
    console.error(err);
});

module.exports = server;
