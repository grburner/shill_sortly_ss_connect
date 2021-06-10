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
  let newString = [];
  let formattedHeader = ['SKU','Name','WarehouseLocation','WeightOz','Category','Tag1','Tag2','Tag3','Tag4','Tag5','CustomsDescription','CustomsValue','CustomsTariffNo','CustomsCountry','ThumbnailUrl','UPC','FillSKU','Length','Width','Height','UseProductName','Active','ParentSKU','IsReturnable']
  let prodObj = product.params;

  fs.readFile('./logs/productAdds.csv', (err, data) => {
    if (err) throw err;
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
      if (err) throw err;
      console.log('product record added')
    });
  });
}

function addSortlySKU(entry) {
  let dataToWrite = `${entry.params.id}, ${entry.params.name}, NO SKU`
  fs.writeFile('./logs/sortlySKU.csv', dataToWrite, 'utf8', (err) => {
    if (err) throw err;
    else console.log('Sortly file saved');
  })
}

exports.getBinNumber = getBinNumber;
exports.addProductAdd = addProductAdd;
exports.addSortlySKU = addSortlySKU;