/**
 * Created by A663945 on 05/07/2017.
 */

function formatSentence (sentence) {

  return sentence.trim()
    .toLowerCase();
}

function formatMessage(message) {
  return {
    type: message.type,
    createdAt: new Date(message.timestamp * 1000),
    body: message.body,
    senderID: message.senderID,
    messageID: message.messageID
  };
}
module.exports = {
  formatSentence: formatSentence,
  formatMessage: formatMessage
};
