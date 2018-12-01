// Mongo DB
const mongoose = require('mongoose');
const _db = mongoose.connection;
const autoIncrement = require('mongoose-auto-increment');

_db.on('error', console.error);
_db.once('open', function () {
    console.log("MongoDB 연결");
});
mongoose.connect('mongodb://localhost/vote', { useNewUrlParser: true });
mongoose.set('useCreateIndex', true)
mongoose.set('useFindAndModify', false);

autoIncrement.initialize(_db);

module.exports = {
    getDB() {
        return _db
    }
}