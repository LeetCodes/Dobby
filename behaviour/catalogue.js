/**
 * Project : 141Tops
 * Package :
 * @author Alexandre CAZALA <alexandre.cazala@gmail.com>
 * @date 16/08/2017
 */
let catalogue = [];
module.exports = function () {

  return {
    getCatalogue: () => {
      return catalogue
    },
    push: (action) => {
      catalogue.push(action)
    }
  };
};
