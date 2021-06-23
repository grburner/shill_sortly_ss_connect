const fs = require('fs');
const util = require('util');

const readDir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);

const AdmZip = require('adm-zip');
const zip = new AdmZip();

let rootPath = './logs/'

async function zipFiles(root) {
  let roots = []
  try {
    const files = await readDir(root);
    files.forEach(file => {
      roots.push(`${root}${file}`)
    })
    return roots
  } catch {
    console.log(error);
  }
}

async function addToZip(filePath) {
  const bufferData = await readFile(filePath)

  try {
    zip.addFile(filePath, Buffer.alloc(bufferData.length, bufferData))
  } catch {
    console.log(error);
  }
}

function getZips(paths) {
  const zip2 = new AdmZip('./logs/testzip.zip');
  const zipEntries = zip2.getEntries();
  zipEntries.forEach(entry => {
    // console.log(entry.entryName)
    if (paths.includes(entry.entryName)) {
      // console.log(entry.getData().toString('utf8'))
    }
  })
}

function createZipFiles() {
  return new Promise(async(res, rej) => {
    let promises = [];
    const roots = await zipFiles(rootPath);
    roots.forEach(root => promises.push(addToZip(root)))
  
    Promise.all(promises)
    .then(() => {
      zip.writeZip('./logs/testzip.zip');
      res('./logs/testzip.zip')
      // getZips(roots)
    })
  })
}

exports.createZipFiles = createZipFiles;