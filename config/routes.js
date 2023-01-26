const express = require('express')

module.exports = function (server) {
    const protectedApi = express.Router();
    server.use('/api', protectedApi);

    server.use('/status', (req, res) =>
        res.send(`BACKEND is runner.`)
    );

    const register = require('../api/register/registerService');
    register.register(protectedApi, '/register');

    server.use(express.static(require('path').join(__dirname, '../public')));
}