const fs = require('fs');
const util = require('util');
const JSZip = require("jszip");

const readDir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);

let rootPath = './logs/'

const zip = new JSZip();

function createZipFiles() {
  return new Promise (async (res, rej) => {
    const filePaths = ['productAdds.csv', 'productInv.csv', 'sortlySKU.csv'];
    let promises = []
  
    filePaths.forEach(file => {
      promises.push(new Promise(async(res, rej) => {
        const bufferData = await readFile(`${rootPath}${file}`);
        try {
          zip.file(file, bufferData);
          res(true)
        } catch (error) {
          console.log(error);
          rej(error)
        }
      }))
    })
    await Promise.all(promises)
    .then(() => generateZip())
    .then(() => {res(true)})
  })
}

function generateZip() {
  return new Promise((res, rej) => {
    zip.generateNodeStream({"type":'nodebuffer', streamFiles:true})
    .pipe(fs.createWriteStream('./logs/output.zip'))
    .on('finish', function(error) {
      if (error) {
        console.log(error)
        rej(false)
      } else { 
        console.log('output written')
        res(true)
      }
    })
  })
}

exports.createZipFiles = createZipFiles;