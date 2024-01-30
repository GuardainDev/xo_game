const express = require('express').Router;
class api_router {

    create() {
        let route = express();

        route.use('/login', require('./api_routes/login'));
        route.use('/signup', require('./api_routes/signup'));
        route.use('/leaderboard', require('./api_routes/leaderboard'));
        route.use('/history', require('./api_routes/history'));
        return route;
    }
}

module.exports = new api_router();