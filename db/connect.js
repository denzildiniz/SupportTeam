const mongoose = require('mongoose')

const connDb = (url) =>{
    return mongoose.connect(url);
};

module.exports = connDb;