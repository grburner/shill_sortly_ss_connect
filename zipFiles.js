const fs = require('fs');
const util = require('util');

const readDir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);

const AdmZip = require('adm-zip');
const zip = new AdmZip();
const zip2 = new AdmZip('./logs/testzip.zip');
const zipEntries = zip2.getEntries();

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
  zipEntries.forEach(entry => {
    console.log(entry.entryName)
    if (paths.includes(entry.entryName)) {
      console.log(entry.getData().toString('utf8'))
    }
  })
}

async function createZipFiles() {
  let promises = [];
  const roots = await zipFiles(rootPath);
  roots.forEach(root => promises.push(addToZip(root)))

  Promise.all(promises)
    .then(() => {
      zip.writeZip('./logs/testzip.zip');
      getZips(roots)
    })
}

createZipFiles();