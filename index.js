const fs = require('fs');

const express = require('express');

const app = express();

const routes = require('./routes');
const dataRoutes = require('./dataRoutes');
const zipFiles = require('./zipFiles');
const helpers = require('./helpers');

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
        // console.log('tagged');
      }
    }
  };
  if (tagged === false) {
    routes.tagSsProd(prod_list[0]);
  } else {
    // console.log('run changes here');
  }
});

app.get('/ss_prod/:prod_id?', async (req, res) => {
  const resp = await routes.getSsProd(req.params.prod_id);
  res.send(resp)
})

app.get('/pull_sortly', (req, res) => {
  dataRoutes.pullSortlyData()
  .then(() => {
    zipFiles.createZipFiles()
    .then(resp => {
      console.log(resp)
      res.download('./logs/output.zip')
      // res.end();
      // helpers.destroyFiles();
    })
  });
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}
app.listen(port);