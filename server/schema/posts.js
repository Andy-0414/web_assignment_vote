var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');

var posts = new Schema({
    isOpen: Boolean,
    title: String,
    img: String,
    list: Array,
    isMulti: Boolean,
    date: String,

    subTitle: String,
    content: String,

    viewCount: Number,

    join: Array,
    comment: Array,

    ownerName: String,
    owner: String,
})

posts.plugin(autoIncrement.plugin, {
    model: 'posts',
    field: 'id',
    start: 0,
    step: 1
})
module.exports = mongoose.model('posts', posts);