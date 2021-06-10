const dataRoutes = require('./dataRoutes');
const helpers = require('./helpers');

/**
 * description here
 * @param {array} productList - array of sortly objects
 * @returns {function} routeSortly - calls routeSortly after all products are categorized
 */

async function sortSortly(productList) {
  let sortedList = [];

  productList.forEach((product) => {
    sortedList.push(new Promise((res, rej) => {
      if (product.notes === null) {
        res({
          nextFunc: 'noSKUNumber',
          params: {
            id: product.id,
            name: product.name,
            notes: 'NULL',
          },
        });
      } else {
        const ssProdData = dataRoutes.getSsProd(product.notes);
        ssProdData.then(result => {
          try {
            if (result.products.length === 0) {
              res({
                nextFunc: 'addSsProduct',
                params: {
                  sku: product.notes,
                  name: product.name,
                  location: helpers.getBinNumber(product.custom_attribute_values),
                },
              });
            } else {
              console.log(result.products)
              res({
                nextFunc: 'runSsUpdates',
                params: {
                  sku: product.notes,
                  name: product.name,
                  location: helpers.getBinNumber(product.custom_attribute_values),
                  ssObj: result.products,
                },
              });
            }
          } catch (error) {
            rej(console.log(error));
          }
        })
      }
    }));
  });
  Promise.all(sortedList)
    .then(retVal => routeSortly(retVal))
}

function routeSortly(obj) {
  obj.forEach(item => {
    switch(item.nextFunc) {
      case 'runSsUpdates':
        dataRoutes.updateSsProduct(item)
        break;
      // case 'noSKUNumber':
      //   console.log('run noSKUnumber');
      //   console.log(item);
      //   break;
      // case 'addSsProduct':
      //   console.log('add SsProduct');
      //   console.log(item);
      //   break;
      default:
        console.log('no match');
    }
  })
};

exports.sortSortly = sortSortly;
