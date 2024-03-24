const UserModel = require('../../models/userModel');
const bcrypt = require('bcrypt');
const asyncHandle = require('express-async-handler');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    //secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
        user: process.env.USERNAME_EMAIL,
        pass: process.env.PASSWORD,
    },
    tls: {
        rejectUnauthorized: false,
    },
});

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
        throw new Error(`Email đã đăng ký trước đó rồi !`);
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
        message: 'Đăng ký tài khoản thành công',
        data: {
            fullname: existingUser.fullname,
            photoUrl: existingUser.photoUrl,
            email: newUser.email,
            id: newUser.id,
            accesstoken: await getJsonwebtoken(email, newUser.id),
        },
    });
});

const login = asyncHandle(async(req, res) => {
    const { email, password } = req.body;
    const existingUser = await UserModel.findOne({ email });
    if (!existingUser) {
        res.status(403).json({
            message: 'Tài khoản không tồn tại!!',
        });
        throw new Error('Không tìm thấy tài khoản !!');
    }
    const isMactchPassword = await bcrypt.compare(
        password,
        existingUser.password
    );
    if (!isMactchPassword) {
        res.status(401);
        throw new Error('Email hoặc Password không đúng!');
    }
    res.status(200).json({
        message: '',
        data: {
            fullname: existingUser.fullname,
            photoUrl: existingUser.photoUrl,
            id: existingUser.id,
            email: existingUser.email,
            accesstoken: await getJsonwebtoken(email, existingUser.id),
        },
    });
});
const handleSendMail = async(val) => {
    try {
        await transporter.sendMail(val);
        return 'OKAY';
    } catch (error) {
        return error;
    }
};
const verification = asyncHandle(async(req, res) => {
    const { email } = req.body;
    const verificationCode = Math.round(1000 + Math.random() * 9000);
    try {
        const data = {
            from: `'APP STABLE-DIFFUSION' <${process.env.USERNAME_EMAIL}>`,
            to: email, // list of receivers
            subject: 'Mã xác nhận của cậu nè ', // titlr
            text: 'Mã xác nhận của bạn là', // plain text body
            html: `<h1>${verificationCode}</h1>`, // html body
        };
        await handleSendMail(data);
        res.status(200).json({
            messgae: 'Gửi yêu cầu mã xác nhận thành công',
            data: {
                code: verificationCode,
            },
        });
    } catch (error) {
        res.status(401);
        throw new Error('khong gui duoc');
    }
});

const resetPassword = asyncHandle(async(req, res) => {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (user) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(`${password}`, salt);

        await UserModel.findByIdAndUpdate(user._id, {
            password: hashedPassword,
            isChangePassword: true,
        });
        await handleSendMail(data)
            .then(() => {
                res.status(200).json({
                    message: 'reset password was successfully !',
                    data: [],
                });
            })
            .catch((error) => {
                res.status(401);
                throw new Error(`Can not reset password`, { error });
            })
            .then(() => {
                console.log('Done');
            })
            .catch((error) => console.log(error));
    } else {
        res.status(401);
        throw new Error(`User not found`);
    }
});

module.exports = { register, login, verification, resetPassword };