const fs = require('fs');

const express = require('express');
const AdmZip = require('adm-zip');

const app = express();

const routes = require('./routes');
const dataRoutes = require('./dataRoutes')

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
    .then(resp => {
      if (resp) {
        res.download('./logs/testzip.zip')
      }
    });
});

app.get('/test_zip', (req, res) => {
  const zip = new AdmZip();
  let productAdds;
  let productInv;

  function addToZip() {
    return new Promise((res, rej) => {
      fs.readFile('./logs/productAdds.csv', (err, data) => {
        if (err) throw err;
        productAdds = data;
        res(true)
      })
    })
  }
  // fs.readFile('./logs/productInv.csv', (err, data) => {
  //   if (err) throw err;
  //   productInv = data;
  // });

  function addFileToZip() {
    addToZip()
    .then(() => zip.addFile('./logs/productAdds.csv', Buffer.alloc(productAdds.length, productAdds), 'enter productAdds'))
    .then(() => {zip.writeZip('./logs/testzip.zip')})
  }

  addFileToZip();

  // zip.addFile('./logs/productAdds.csv', Buffer.alloc(productAdds.length, productAdds), 'enter productAdds');
  // zip.addFile('./logs/productInv.csv', Buffer.alloc(productInv.length, productInv), 'enter productInv')
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}
app.listen(port);