/**
 * Project : 141Tops
 * Package :
 * @author Alexandre CAZALA <alexandre.cazala@gmail.com>
 * @date 25/08/2017
 */

let catalogue = [];
module.exports = function () {
  return {
    getInstances: () => {
      return catalogue;
    },
    pushInstance: (instance) => {
      catalogue.push(instance)
    },
  };
};
