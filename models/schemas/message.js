/**
 * Project : 141Tops
 * Package :
 * @author Alexandre CAZALA <alexandre.cazala@gmail.com>
 * @date 07/07/2017
 */
const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  type: {type: String, required: true},
  senderID: { type: String, required: true},
  body: { type: String},
  createdAt: { type: Date, required: true},
  messageID: {type: String, required: true}
}, {
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  }
});

module.exports = mongoose.model('Message', MessageSchema);
