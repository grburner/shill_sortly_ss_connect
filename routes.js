require('dotenv').config();
const axios = require('axios');

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
    const config = {
      method: 'get',
      url: 'https://api.sortly.co/api/v1/items?per_page=1000&page=1&',
      headers: { 
        'Authorization': `Bearer ${process.env.SORTLY_SECRET}`
      }
    };

    const result = await axios(config);

    let data = result.data.data

    try {
      let prodsToUpdate = []
      data.forEach(data => {
        data.tags.forEach(tag => {
          if (tag.name === 'Update') {
            prodsToUpdate.push(data)
          }
        })
      });
      prodsToUpdate.forEach(product => {
        this.updateSsProduct(product)
      })
    } catch (error) {
      console.log(error);
    }
  },
  updateSsProduct: async function(product) {
    const result = await this.getSsProd(product.notes)
    console.log(result)
  }
}

module.exports = routes;