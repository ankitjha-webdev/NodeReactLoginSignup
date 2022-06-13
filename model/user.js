const mongoose = require('mongoose');
var Schema = mongoose.Schema;

userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}
),

user = mongoose.model('user', userSchema);

module.exports = user;