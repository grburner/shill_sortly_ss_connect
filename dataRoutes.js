require('dotenv').config();
const axios = require('axios');
const helpers = require('./helpers');

const orgFunc = require('./orgFunc');

function pullSortlyData() {
  helpers.remakeFiles()
  return new Promise(async (res, rej) => {
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
        if (findTagged(data.custom_attribute_values)) {
          prodsToUpdate.push(data)
        }
      });
    } catch (error) {
      console.log(error);
    }
    orgFunc.sortSortly(prodsToUpdate)
      .then(resp => {
        if (resp) {
          res(true)
        };
      })
  })
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

function updateSsProduct(obj) {
  return new Promise((res, rej) => {
    let data = obj.params.ssObj[0];
    data.sku = obj.params.SKU;
    data.name = obj.params.ProductName;
    data.warehouseLocation = obj.params.Loc1
  
    const config = {
      method: 'put',
      url: `https://ssapi.shipstation.com/products/${data.productId}`,
      headers: { 
        'Authorization': `Basic ${process.env.SS_ENCODED}`,
        'Content-Type': 'application/json'
      },
      data: data
    }
    axios(config)
    .then(resp => {
      res('updateSsProduct complete')
    })
    .catch(error => {
      rej(error)
    })
  })
}

function removeUpdateTag(product) {
  console.log('remove tag function')
  
  product.custom_attribute_values.forEach(tag => {
    if (tag.custom_attribute_id === 201704) {
      tag.value = false
    }
  })
  console.log(product)

  const config = {
    method: 'put',
    url: `https://api.sortly.co/api/v1/items/${product.id}`,
    headers: {
      'Authorization': `Bearer ${process.env.SORTLY_SECRET}`,
      'Content-Type': 'application/json'
    },
    data: JSON.stringify(product)
  }
  
  axios(config)
  .then(resp => {
    console.log(`tag removed from sortly product id: ${product.id}`)
  })
  .catch(error => {
    console.log(error)
  })
}

function findTagged(tags) {
  const filterTag = tags.filter(tag => tag.custom_attribute_id === 201704)
  if (filterTag[0].value === true) {
    console.log(filterTag)
    return true;
  }
}



exports.pullSortlyData = pullSortlyData;
exports.getSsProd = getSsProd;
exports.updateSsProduct = updateSsProduct;
exports.removeUpdateTag = removeUpdateTag;