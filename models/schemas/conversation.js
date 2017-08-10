/**
 * Project : 141Tops
 * Package :
 * @author Alexandre CAZALA <alexandre.cazala@gmail.com>
 * @date 07/07/2017
 */
const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema({
  threadID: {type: String, required: true},
  messages : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }]
}, {
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  }
});

ConversationSchema
  .virtual('messageCount')
  .get(function () {
    return this.messages.length;
  });

module.exports = mongoose.model('Conversation', ConversationSchema);
