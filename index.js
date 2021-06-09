const express = require('express');
const app = express();

const routes = require('./routes');

app.use(express.json());

app.get('/ss_get_prod/:prod_id?', async (req, res) => {
  let tagged = false;
  const mainTag = 61635;
  const resp = await routes.getSsProd(req.params.prod_id);
  let prod_list = resp.products;
  for (i = 0; i < prod_list.length; i++) {
    if (prod_list[i].tags) {
      if (prod_list[i].tags[0].tagId === mainTag) {
        tagged = i;
        console.log('tagged');
      }
    }
  };
  if (tagged === false) {
    routes.tagSsProd(prod_list[0]);
  } else {
    console.log('run changes here');
  }
});

app.get('/pull_sortly', async (req, res) => {
  const resp = await routes.pullSortlyData();
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}
app.listen(port);