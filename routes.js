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
    
    axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
      console.log(error);
    });
  }
};

module.exports = routes;