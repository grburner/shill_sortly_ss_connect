require('dotenv').config();
const axios = require('axios');
const { sortSortly, getBinNumber, addSsInvData, formatSsProduct, addSsProductData } = require('./orgFunctions')

// async function getSsProd(prodID) {
//   let config = {
//     method: 'get',
//     url: `https://ssapi.shipstation.com/products?sku=${prodID}`,
//     headers: { 
//       'Authorization': `Basic ${process.env.SS_ENCODED}`
//     }
//   };
  
//   const result = await axios(config)
//   console.log(result.data)

//   try {
//     return result.data;
//   } catch (error) {
//     console.log(error);
//   }
// }

const routes = {
  getSsProd: async function(prodID) {
    let config = {
      method: 'get',
      url: `https://ssapi.shipstation.com/products?sku=${prodID}`,
      headers: { 
        'Authorization': `Basic ${process.env.SS_ENCODED}`
      }
    };
    
    const result = await axios(config)
    console.log(result.data)

    try {
      return result.data;
    } catch (error) {
      console.log(error);
    }
  },
  tagSsProd: async function(prodData) {
    const mainTag = [ { tagId: 61635, name: 'MAIN_SORTLY' } ];
    prodData.tags = mainTag
    JSON.stringify(prodData)

    const config = {
      method: 'put',
      url: `https://ssapi.shipstation.com/products/${prodData.productId}`,
      headers: { 
        'Authorization': `Basic ${process.env.SS_ENCODED}`,
        'Content-Type': 'application/json'
      },
      data : prodData
    };
    
    const result = await axios(config);

    try {
      console.log(JSON.stringify(result.data))
    } catch (error) {
      console.log(error);
    }
  },

  pullSortlyData: async function() {
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

    sortSortly(prodsToUpdate);
  },
  // updateSsProduct: async function(sortlyData) {
  //   const ssData = await routes.getSsProd(sortlyData.sku);

  //   try {
  //     if (ssData.data.products.length === 0) {
  //       addSsProductData(sortlyData)
  //     } else {
  //       let data = await formatSsProduct(ssData, sortlyData)
  //       const config = {
  //         method: 'put',
  //         url: `https://ssapi.shipstation.com/products/${data.productId}`,
  //         headers: { 
  //           'Authorization': `Basic ${process.env.SS_ENCODED}`,
  //           'Content-Type': 'application/json'
  //         },
  //         data: data
  //       }
  //     };
  
  //     axios(config)
  //     .then(resp => {
  //       console.log(resp.data)
  //     })
  //     .catch(error => {
  //       console.log(error)
  //     })
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }
}

module.exports = routes;