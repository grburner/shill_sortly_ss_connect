const { getSsProd, testLog } = require('./routes')

const orgFunctions = {
  getBinNumber: function(obj) {
    let retVal
    obj.forEach(entry => {
      if (entry.custom_attribute_id === 184670) {
        retVal = entry.value
      }
    })
    return retVal;
  },
  addSsInvData: function(obj) {
    console.log(`ADD TO INVENTORY SHEET: sku: ${obj.sku}, name: ${obj.name}, stock: ${obj.quantity}`)
  },
  addSsProductData: function(obj) {
    console.log(`ADD TO PRODUCT SHEET`)
    console.log(obj)
  },
  formatSsProduct: async function(ss, sortly) {
    console.log(`into update SS product: ${sortly.sku}`)
    
    ss.products[0].price = parseFloat(sortly.price);
    ss.products[0].warehouseLocation = sortly.warehouse

    return ss.products[0];
  }
}

module.exports = orgFunctions;