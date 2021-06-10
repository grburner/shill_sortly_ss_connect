const fs = require('fs');
const { format } = require('path');
const { formatSsProduct } = require('./orgFunctions');

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
        newString += '\n'
      }
      fs.appendFile('./logs/productAdds.csv', newString, (err,data) => {
        if (err) {rej(err)};
        res('addProductAdd complete')
      });
    });
  })
}

function addInventorySKU(product) {
  return new Promise((res, rej) => {
    let newString = [];
    const formattedHeader = ['SKU','ProductName','Loc1','Loc2','Loc3','Loc4','Stock','ReorderThreshold','Cost'];
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
        newString += '\n'
      }
      fs.appendFile('./logs/productInv.csv', newString, (err,data) => {
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

exports.getBinNumber = getBinNumber;
exports.addProductAdd = addProductAdd;
exports.addSortlySKU = addSortlySKU;
exports.addInventorySKU = addInventorySKU;