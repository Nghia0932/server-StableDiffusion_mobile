const SocialModel = require('../../models/socialmodel');
const bcrypt = require('bcrypt');
const asyncHandle = require('express-async-handler');

const multer = require('multer');

const upload = multer({dest: 'uploads/'});

const postContent = asyncHandle(async (req, res) => {
  upload.array('imageUrls')(req, res, async (err) => {
    if (err) {
      return res.status(500).json({
        message: 'Error parsing form data',
        error: err.message,
      });
    }
    const {email, content} = req.body;
    console.log(req.body.email);

    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      // Nếu có tệp tin được tải lên, lưu các đường dẫn của chúng
      imageUrls = req.files.map((file) => file.path);
    } else {
      // Nếu không có tệp tin được tải lên, sử dụng các đường dẫn được gửi từ client (nếu có)
      imageUrls = req.body.imageUrls ? [req.body.imageUrls] : [];
    }
    console.log(imageUrls);
    const newSocial = new SocialModel({
      email: email,
      content: content,
      imageUrls: imageUrls,
    });
    await newSocial.save();

    res.status(200).json({
      message: 'Post social successfully',
      data: {},
    });
  });
});

const getContentOneEmail = asyncHandle(async (req, res) => {
  const {email} = req.body;
  console.log(email);
  const userPosts = await SocialModel.find({email});
  console.log(userPosts[0]);
  if (userPosts.length === 0) {
    res.status(403).json({
      message: 'None of content posted !',
    });
    throw new Error('None of content posted !');
  } else {
    res.status(200).json({
      message: '',
      data: {
        message: 'Success',
        data: userPosts,
      },
    });
  }
});

module.exports = {postContent, getContentOneEmail};
