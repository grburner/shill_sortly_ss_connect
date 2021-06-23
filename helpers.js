const fs = require('fs');
const { formatSsProduct } = require('./orgFunctions');
const path = require('path');

function getBinNumber(obj) {
  let retVal;
  obj.forEach((entry) => {
    if (entry.custom_attribute_id === 184670) {
      retVal = entry.value;
    }
  });
  return retVal;
}

function addProductAdd(product) {
  return new Promise((res, rej) => {
    let newString = [];
    let formattedHeader = ['SKU','Name','WarehouseLocation','WeightOz','Category','Tag1','Tag2','Tag3','Tag4','Tag5','CustomsDescription','CustomsValue','CustomsTariffNo','CustomsCountry','ThumbnailUrl','UPC','FillSKU','Length','Width','Height','UseProductName','Active','ParentSKU','IsReturnable']
    let prodObj = product.params;
    console.log(Object.keys(prodObj))
    console.log(Object.entries(prodObj))
  
    fs.readFile('./logs/productAdds.csv', (err, data) => {
      if (err) {rej(err)}
      else {
        // formattedHeader = data.toString().split(',');
        formattedHeader.forEach(heading => {
          if (Object.keys(prodObj).indexOf(heading) !== -1) {
            Object.entries(prodObj).forEach(entry => {
              if (entry[0] === heading) {
                newString += `${entry[1]},`
              }
            })
          } else { newString += ','}
        });
      }
      fs.appendFile('./logs/productAdds.csv', '\n' + newString, (err,data) => {
        if (err) {rej(err)};
        res('addProductAdd complete')
      });
    });
  })
}

function addInventorySKU(product) {
  return new Promise((res, rej) => {
    let newString = [];
    const formattedHeader = ["SKU","ProductName","Loc1","Loc2","Loc3","Loc4","Stock","ReorderThreshold","Cost"];
    let prodObj = product.params;
  
    fs.readFile('./logs/productInv.csv', (err, data) => {
      if (err) {rej(err)}
      else {
        formattedHeader.forEach(heading => {
          if (Object.keys(prodObj).indexOf(heading) !== -1) {
            Object.entries(prodObj).forEach(entry => {
              if (entry[0] === heading) {
                newString += `${entry[1]},`
              }
            });
          }
          else { newString += ','}
        });
      }
      fs.appendFile('./logs/productInv.csv', '\n' + newString, (err,data) => {
        if (err) {rej(err)};
        console.log('inventory record added')
        res('addInventorySKU complete')
      });
    })
  })
}

function addSortlySKU(entry) {
  return new Promise((res, rej) => {
    let dataToWrite = `${entry.params.id}, ${entry.params.name}, NO SKU`
    fs.writeFile('./logs/sortlySKU.csv', dataToWrite, 'utf8', (err) => {
      if (err) rej(err);
      res('addSortlySKU complete');
    })
  })
}

function destroyFiles() {
  console.log('running destroy files');
  fs.readdir('./logs', (err, files) => {
    if (err) throw err;
    files.forEach(file => {
      if (file != '.DS_store')
        fs.unlink(path.join('./logs', file), err => {
          if (err) throw err;
        });
    });
  });
};

function remakeFiles() {
  console.log('running remake files')
  const productRow = ["SKU","Name","WarehouseLocation","WeightOz","Category","Tag1","Tag2","Tag3","Tag4","Tag5","CustomsDescription","CustomsValue","CustomsTariffNo","CustomsCountry","ThumbnailUrl","UPC","FillSKU","Length","Width","Height","UseProductName","Active","ParentSKU","IsReturnable"]
  const invRow = ["SKU","ProductName","Loc1","Loc2","Loc3","Loc4","Stock","ReorderThreshold","Cost"]

  fs.writeFileSync(`./logs/productAdds.csv`, productRow, (err) => {
    if (err) throw err;
  });

  fs.writeFileSync(`./logs/productInv.csv`, invRow, (err) => {
    if (err) throw err;
  });

  fs.writeFileSync(`./logs/sortlySKU.csv`, '',(err) => {
    if (err) throw err;
  });

  fs.writeFileSync(`./logs/testzip.zip`, '',(err) => {
    if (err) throw err;
  });
}

exports.getBinNumber = getBinNumber;
exports.addProductAdd = addProductAdd;
exports.addSortlySKU = addSortlySKU;
exports.addInventorySKU = addInventorySKU;
exports.destroyFiles = destroyFiles;
exports.remakeFiles = remakeFiles;