const swagger = require('./swagger');

const port = process.env.PORT || 3000;

let server;
swagger.then(() => {
    const app = require('./app');
    server = app.listen(port, () => {
        console.log(`Listening on port ${port}...`);
    });
}).catch(err => {
    console.error(err);
});

module.exports = server;
