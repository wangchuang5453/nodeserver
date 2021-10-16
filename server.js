const http = require('http');
const path = require('path');
const mime = require('mime');
const fs = require('fs');
const fsPromise = require('fs/promises');

async function readFile(filePathName, fileName = '') {
  try {
    const file = await fsPromise.readFile(path.join(filePathName, fileName));
    return file;
  } catch (error) {
    console.log('index.html read fail');
    return null;
  }
}

async function readStaticFile(filePathName) {
  if (fs.existsSync(filePathName)) {
    const ext = path.parse(filePathName).ext;
    const mimeType = mime.getType(ext) || 'text/html';
    let resData;
    if (ext) {
      resData = await readFile(filePathName);
    } else {
      resData = await readFile(filePathName, './index.html');
    }
    return {resData, mimeType};
  } else {
    console.log('file or dir not found');
    return null;
  }
}

http.createServer(async (request, response) => {
  const urlString = request.url;
  const filePathName = path.join(__dirname, './public', urlString);
  const req = await readStaticFile(filePathName);
  const { resData, mimeType } = req;
  if (req !== null) {
    response.writeHead(200, {
      'content-type': `${mimeType}; charset=utf-8`
    });
    response.write(resData);
  } else {
    response.write('fail');
  }
  response.end();
}).listen(9000, () => {
  console.log('localhost:9000 connected');
})