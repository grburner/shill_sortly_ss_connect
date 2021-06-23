const fs = require('fs');

const express = require('express');
const AdmZip = require('adm-zip');

const app = express();

// const routes = require('./routes');
const dataRoutes = require('./dataRoutes');
const zipFiles = require('./zipFiles');
const { destroyFiles } = require('./helpers');

app.use(express.json());

app.get('/ss_get_prod/:prod_id?', async (req, res) => {
  let tagged = false;
  const mainTag = 61635;
  const resp = await dataRoutes.getSsProd(req.params.prod_id);
  let prod_list = resp.products;
  for (i = 0; i < prod_list.length; i++) {
    if (prod_list[i].tags) {
      if (prod_list[i].tags[0].tagId === mainTag) {
        tagged = i;
      }
    }
  };
  if (tagged === false) {
    // write new tagging function here
    // routes.tagSsProd(prod_list[0]);
  } else {
  }
});

app.get('/ss_prod/:prod_id?', async (req, res) => {
  const resp = await dataRoutes.getSsProd(req.params.prod_id);
  res.send(resp)
})

app.get('/pull_sortly', (req, res) => {
  console.log('success', 3, 'index.js - /pull_sortly', `req.hostname = ${req.hostname}`)
  dataRoutes.pullSortlyData()
  .then(() => {
    zipFiles.createZipFiles()
    .then(resp => {
      console.log('success', 3, 'index.js - /pull_sortly - pullSortlyData()', `into res.download()`)
      res.download(`${resp}`)
      destroyFiles()
    })
  })
  .catch(error => {
    console.log('fail', 1, 'index.js - /pull_sortly - pullSortlyData()', error)
  });
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}
app.listen(port);