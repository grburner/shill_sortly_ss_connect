const express = require('express');
const app = express();

const routes = require('./routes');

app.use(express.json());

app.get('/ss_get_prod/:prod_id?', async (req, res) => {
  let tagged = false
  const resp = await routes.get_ss_prod(req.params.prod_id);
  resp.products.forEach(product => {
    product.tags.forEach(tag => {
      if (tag.name === 'MAIN_SORTLY') {
        tagged = true;
      }
    });
  });
  if (!tagged) {
    routes.tag_ss_prod(resp.products[0])
  } else {
    console.log('tagged')
  }
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}
app.listen(port);