const dataRoutes = require('./dataRoutes');
const helpers = require('./helpers');

/**
 * description here
 * @param {array} productList - array of sortly objects
 * @returns {function} routeSortly - calls routeSortly after all products are categorized
 */

async function sortSortly(productList) {
  return new Promise((res, rej) => {
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
                    ProductName: product.name,
                    Stock: product.quantity,
                    Loc1: helpers.getBinNumber(product.custom_attribute_values),
                    ssObj: result.products,
                  },
                });
              } else {
                res({
                  nextFunc: 'runSsUpdates',
                  params: {
                    SKU: product.notes,
                    Name: product.name,
                    WarehouseLocation: helpers.getBinNumber(product.custom_attribute_values),
                    ProductName: product.name,
                    Stock: product.quantity,
                    Loc1: helpers.getBinNumber(product.custom_attribute_values),
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
      .then(() => {
        res(true)})
      .catch(err => {
        console.log(err),
        rej(err)
      })
  })
}

function routeSortly(obj) {
  return new Promise((res, rej) => {
    let promises = []
  
    obj.forEach(item => {
      console.log(item.nextFunc)
      switch(item.nextFunc) {
        case 'runSsUpdates':
          promises.push(
            helpers.addInventorySKU(item)
          );
          // change this to helpers.addProductAdd
          promises.push(
            // dataRoutes.updateSsProduct(item)
            helpers.addProductAdd(item)
          );
          break;
        case 'noSKUNumber':
          promises.push(
            helpers.addSortlySKU(item)
          );
          break;
        case 'addSsProduct':
          promises.push(
            helpers.addProductAdd(item)
          );
          break;
        default:
          console.log('no match');
      }
    })
    Promise.all(promises)
      .then(() => {
        console.log(promises),
        res(promises)
      });
  })
};

exports.sortSortly = sortSortly;
