/**
 * Project : 141Tops
 * Package :
 * @author Alexandre CAZALA <alexandre.cazala@gmail.com>
 * @date 21/08/2017
 */
function isFlooding (date) {
  return !(!date || ((date.getTime() - new Date().getTime())/millisecondsPerHour)>2);
}

module.exports = {
  isFlooding: isFlooding,
};
