const fs = require('fs-extra');
const upload = require('../handler/mongodb.js');
const config = require('../config.js');
class uploadFile {
  constructor() {
    this.name = 'uploadFile';
    this.method = 'POST';
    this.handler = this.handler;
  }
  async handler(req, res) {
    var { type, data, code } = req.body;
    if (type && data && code) {
      switch (config.type) {
        case 'mongodb':
          var uploadPhoto = new upload({
            type: type,
            code: code,
            data: data
          });
          uploadPhoto.save(function (err, uploadPhoto) {
            if (err) return console.error(err);
            res.send({
              status: 200,
              message: 'Upload thành công',
              link : `photo/${code}`
            });
          });
          break;
        case 'json':
          var json = fs.readFileSync('./cache/data.json');
          var obj = JSON.parse(json);
          obj.push({
            type: type,
            code: code,
            data: data
          });
          fs.writeFileSync('./cache/data.json', JSON.stringify(obj));
          res.send({
            status: 200,
            message: 'Upload thành công',
            link: `photo/${code}`
          });
          break;
        default:
          res.send({
            status: 500,
            message: 'Lỗi hệ thống'
          });
          break;
      }
    }
  }
}
module.exports = new uploadFile();