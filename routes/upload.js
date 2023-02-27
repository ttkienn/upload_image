const fs = require('fs-extra');
const Upload = require('../handler/mongodb.js');
const config = require('../config.js');

class UploadFile {
  constructor() {
    this.name = 'uploadFile';
    this.method = 'POST';
    this.handler = this.handler.bind(this);
  }

  async handler(req, res) {
    const { type, data, code } = req.body;

    if (!type || !data || !code) {
      return res.send({ status: 400, message: 'Missing required fields' });
    }

    try {
      let link;
      switch (config.type) {
        case 'mongodb':
          const uploadPhoto = new Upload({ type, code, data });
          const savedPhoto = await uploadPhoto.save();
          link = `photo/${savedPhoto.code}`;
          break;

        case 'json':
          const json = fs.readFileSync('./cache/data.json');
          const obj = JSON.parse(json);
          obj.push({ type, code, data });
          fs.writeFileSync('./cache/data.json', JSON.stringify(obj));
          link = `photo/${code}`;
          break;

        default:
          return res.send({ status: 500, message: 'Internal server error' });
      }

      res.send({ status: 200, message: 'Upload thành công', link });
    } catch (error) {
      res.send({ status: 500, message: error.message });
    }
  }
}

module.exports = new UploadFile();
