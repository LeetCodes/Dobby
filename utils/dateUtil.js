/**
 * Project : 141Tops
 * Package :
 * @author Alexandre CAZALA <alexandre.cazala@gmail.com>
 * @date 21/08/2017
 */
const millisecondsPerHour = 1000*60*60;
function isFlooding (date) {

  let res = date && ((date.getTime() - new Date().getTime())/millisecondsPerHour)<2;
  console.log("isFlooding " + res);
  return res;
}

module.exports = {
  isFlooding: isFlooding
};
