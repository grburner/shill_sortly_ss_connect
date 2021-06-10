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
    dataRoutes.removeUpdateTag(product)
    sortedList.push(new Promise((res, rej) => {
      // no notes(SKU number) in Sortly, create entry in sortlySKU
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
                  SKU: product.notes,
                  Name: product.name,
                  WarehouseLocation: helpers.getBinNumber(product.custom_attribute_values),
                },
              });
            } else {
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
      case 'noSKUNumber':
        helpers.addSortlySKU(item)
        break;
      case 'addSsProduct':
        helpers.addProductAdd(item)
        break;
      default:
        console.log('no match');
    }
  })
};

exports.sortSortly = sortSortly;
