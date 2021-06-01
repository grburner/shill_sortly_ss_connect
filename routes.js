require('dotenv').config();
const axios = require('axios');

const routes = {
  get_ss_prod: async (prodID) => {
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
  tag_ss_prod: async (prodData) => {
    console.log('product tag data')
    console.log(prodData)
  }
};

module.exports = routes;