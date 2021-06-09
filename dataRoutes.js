require('dotenv').config();
const axios = require('axios');

const orgFunc = require('./orgFunc');

async function pullSortlyData() {
  let prodsToUpdate = []

  const config = {
    method: 'get',
    url: 'https://api.sortly.co/api/v1/items/?include=custom_attributes&per_page=1000&page=1&',
    headers: { 
      'Authorization': `Bearer ${process.env.SORTLY_SECRET}`
    }
  };

  const result = await axios(config);

  let data = result.data.data

  try {
    data.forEach(data => {
      data.tags.forEach(tag => {
        if (tag.name === 'Update') {
          prodsToUpdate.push(data)
        }
      })
    });
    // prodsToUpdate.forEach(product => {
    //   let buildObj = {
    //     id: product.id,
    //     sku: product.notes, 
    //     quantity: product.quantity,
    //     price: product.price,
    //     name: product.name,
    //     warehouse: getBinNumber(product.custom_attribute_values)
    //   };
    //   this.updateSsProduct(buildObj)
    //   addSsInvData(buildObj)
    // })
  } catch (error) {
    console.log(error);
  }
  // await issue here
  orgFunc.sortSortly(prodsToUpdate).then(result => {console.log(result)});
}

async function getSsProd(prodID) {
  let config = {
    method: 'get',
    url: `https://ssapi.shipstation.com/products?sku=${prodID}`,
    headers: { 
      'Authorization': `Basic ${process.env.SS_ENCODED}`
    }
  };
  
  const result = await axios(config)

  try {
    return result.data;
  } catch (error) {
    console.log(error);
  }
}



exports.pullSortlyData = pullSortlyData;
exports.getSsProd = getSsProd;