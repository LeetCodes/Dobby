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
    },
    switchState: (name, state) => {
      if (typeof(state) !== "boolean") {
        return;
      }
      catalogue.forEach(function(action) {
        if (action.name === name) {
          action.activated = state;
        }
      })
    }
  };
};
