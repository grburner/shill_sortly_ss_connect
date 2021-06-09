const dataRoutes = require('./routes');

function sortSortly(productList) {
  productList.forEach(async product => {
    const ssProdData = await dataRoutes.getSsProd(product.notes)

    // the product does not exist in ship station -> add a record to the inv sheet
    if (ssProdData.data.products.length === 0) {
      console.log('run add record to inventory sheet')
    } else {
      console.log('product exists')
    }
  })
}

function getBinNumber(obj) {
  let retVal;
  obj.forEach((entry) => {
    if (entry.custom_attribute_id === 184670) {
      retVal = entry.value;
    }
  });
  return retVal;
}

function addSsInvData(obj) {
  console.log(
    `ADD TO INVENTORY SHEET: sku: ${obj.sku}, name: ${obj.name}, stock: ${obj.quantity}`
  );
}

function addSsProductData(obj) {
  console.log(`ADD TO PRODUCT SHEET`);
  console.log(obj);
}

async function formatSsProduct(ss, sortly) {
  console.log(`into update SS product: ${sortly.sku}`);

  ss.products[0].price = parseFloat(sortly.price);
  ss.products[0].warehouseLocation = sortly.warehouse;

  return ss.products[0];
}

exports.sortSortly = sortSortly;
exports.getBinNumber = getBinNumber;
exports.addSsInvData = addSsInvData;
exports.addSsProductData = addSsProductData;
exports.formatSsProduct = formatSsProduct;
