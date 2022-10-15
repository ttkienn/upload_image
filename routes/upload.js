const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');
class upload {
  constructor() {
    this.name = 'uploadFile';
    this.method = 'POST';
    this.handler = this.handler;
  }

  handler(req, res) {
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, path.join('./cache/'));
      },
      filename: function (req, file, cb) {
        cb(null, file.originalname);
      }
    });
    const upload = multer({ storage: storage });
    upload.single('formFile')(req, res, function (err) {
      if (!req.file) return res.send('No file uploaded');
      if (err) return err;
      var img = fs.readFileSync(req.file.path).toString('base64');
      var data = {
        name: req.file.originalname,
        type: req.file.mimetype,
        code: "TTK_" + Math.floor(Math.random() * 1E9),
        size: req.file.size,
        data: img
      };
      if (req.file.mimetype == 'image/png' || req.file.mimetype == 'image/jpeg' || req.file.mimetype == 'image/jpg') {
        const json = fs.readFileSync('./cache/data.json', 'utf8');
        const obj = JSON.parse(json);
        obj.push(data);
        fs.writeFileSync('./cache/data.json', JSON.stringify(obj, null, 2));
        res.status(200).json({ status: 'success', message: 'File uploaded successfully', link: 'http://localhost:3000/photo/' + data.code }).on('finish', function () {
          fs.unlinkSync(req.file.path);
        });
      } else {
        res.json({ error: 'Invalid file type' });
      }
    });
  }
}
module.exports = new upload();