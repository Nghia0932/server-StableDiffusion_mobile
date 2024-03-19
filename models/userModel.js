const { default: mongoose, mongo } = require('mongoose');

const UserSchema = new mongoose.Schema({
    fullname: {
        type: String,
    },
    email: {
        type: String,
        require: true,
    },
    password: {
        type: String,
        require: true,
    },
    photoUrl: {
        type: String,
    },
    createAt: {
        type: Date,
        default: Date.now(),
    },
    updateAt: {
        type: Date,
        default: Date.now(),
    },
});
const UserModel = mongoose.model('user', UserSchema);
module.exports = UserModel;