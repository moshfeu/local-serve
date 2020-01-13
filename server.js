const express = require('express')
const handler = require('serve-handler');
const fileUpload = require('express-fileupload');
const { resolve, join } = require('path');
const dns = require('dns');
const os = require('os');
const port = 5000;

const app = express();
app.use(fileUpload());

app.use("/axios", express.static(join(__dirname, 'node_modules/axios')));
app.use( express.static('files'));

const targetFolder = `${__dirname}/files`;

app.post('/upload', async (req, res) => {
  try {
    console.log('got request');
    const { file } = req.files;
    try {
      await file.mv(`${targetFolder}/${file.name}`);
    } catch (error) {
      console.error(error);
    }
    res.send('' + ((Object.keys(req.files) || []).length));
  } catch (error) {
    console.error(error);
  }
})

app.use('/files', (request, response) => handler(request, response, {
  public: targetFolder
}));

app.get('/', (request, response) => {
  response.sendFile(resolve('index.html'));
})

app.listen(port, () => {
  dns.lookup(os.hostname(), (_, add) => {
    console.log(`Running at http://${add}:${port}`);
  })
});
