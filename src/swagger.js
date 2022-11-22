const swaggerAutogen = require('swagger-autogen')({
    openapi: '3.0.0',
});

const doc = {
    info: {
        title: 'YSpotify',
        description: '....',
    },
    host: 'localhost:3000',
    schemes: ['http'],
    securityDefinitions: {
        basic: {
            type: 'http',
            scheme: 'basic',
            in: 'header',
            description: 'Basic authentification (only needed for FT-1).',
        },
        jwt: {
            "type": "http",
            "scheme": "bearer",
            "in": "header"
        }
    },
    security: [
        {
            jwt: [],
        }
    ]
};

const outputFile = './swagger.json';
const endpointsFiles = ['./src/router.js'];

/* NOTE: if you use the express Router, you must pass in the
   'endpointsFiles' only the root file where the route starts,
   such as index.js, app.js, routes.js, ... */

module.exports = swaggerAutogen(outputFile, endpointsFiles, doc);
