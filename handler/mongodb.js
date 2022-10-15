const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const upload = new Schema({
    type: String,
    code: String,
    data: String
},{
    collection: 'uploadPhoto'
});
const uploadPhoto = mongoose.model('uploadPhoto', upload);
module.exports = uploadPhoto;