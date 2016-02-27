module.exports = {

    site: {
        host: 'http://localhost' || process.env.host,
        port: 8000 || process.env.port
    },

    database: {
        url: 'mongodb://localhost/duty-card-manager'
    }

};
