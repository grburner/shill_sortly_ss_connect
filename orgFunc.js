const dataRoutes = require('./dataRoutes');
const helpers = require('./helpers');

/**
 * description here
 * @param {array} productList - array of sortly objectss
 * @returns {array} sortedList - array of objects with next steps and paramaters
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
              res({
                nextFunc: 'runSsUpdates',
                params: {
                  sku: product.notes,
                  name: product.name,
                  location: helpers.getBinNumber(product.custom_attribute_values),
                  ssObj: ssProdData,
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
    .then(values => {console.log(values)})
    .then(retVal => {return retVal})
}

exports.sortSortly = sortSortly;
