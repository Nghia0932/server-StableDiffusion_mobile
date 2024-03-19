const UserModel = require('../../models/userModel');
const bcrypt = require('bcrypt');
const asyncHandle = require('express-async-handler');
const jwt = require('jsonwebtoken');

const getJsonwebtoken = async(email, id) => {
    const payload = {
        email,
        id,
    };
    const token = jwt.sign(payload, process.env.SECRET_KEY, {
        expiresIn: '7h',
    });

    return token;
};

const register = asyncHandle(async(req, res) => {
    const { fullname, email, password } = req.body;

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
        res.status(401);
        throw new Error(`Email đã được đăng ký`);
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new UserModel({
        email,
        fullname: fullname,
        password: hashedPassword,
    });
    await newUser.save();

    res.status(200).json({
        message: 'Register new user successfully',
        data: {
            email: newUser.email,
            id: newUser.id,
            accesstoken: await getJsonwebtoken(email, newUser.id),
        },
    });
});
module.exports = { register };