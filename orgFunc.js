const dataRoutes = require('./dataRoutes');
const helpers = require('./helpers');

/**
 * description here
 * @param {array} productList - array of sortly objectss
 * @returns {array} sortedList - array of objects with next steps and paramaters
 */

async function sortSortly(productList) {
  let sortedList = []

  productList.forEach(async product => {
    if (product.notes === null) {
      sortedList.push({
        nextFunc: 'noSKUNumber',
        params: {
          id: product.id,
          name: product.name,
          notes: 'NULL'
        }
      });
    } else {
      const ssProdData = await dataRoutes.getSsProd(product.notes)  
      try {
        if (ssProdData.products.length === 0) {
          sortedList.push({
            nextFunc: 'addSsProduct',
            params: {
              sku: product.notes,
              name: product.name,
              location: helpers.getBinNumber(product.custom_attribute_values)
            }
          })
        } else {
          sortedList.push({
            nextFunc: 'runSsUpdates',
            params: {
              sku: product.notes,
              name: product.name,
              location: helpers.getBinNumber(product.custom_attribute_values),
              ssObj: ssProdData
            }
          })
        }
      } catch (error) {
        console.log(error)
      }
    };
  });
  await Promise.all(sortedList)
    .then((final) => {console.log(final)})
  // setTimeout(() => {console.log(sortedList)}, 10000)
  // console.log(sortedList);
  return sortedList;
};

exports.sortSortly = sortSortly;