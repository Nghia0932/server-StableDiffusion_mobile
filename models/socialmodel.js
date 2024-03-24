const {default: mongoose} = require('mongoose');

const SocialSchema = new mongoose.Schema({
  email: {
    type: String,
    require: true,
  },
  content: {
    type: String,
  },
  imageUrls: {
    type: [String],
    default: [],
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
const SocialModel = mongoose.model('socials', SocialSchema);
module.exports = SocialModel;
