const fs = require('fs-extra');
class photo {
    constructor() {
      this.name = 'photo/:type'; // This is the route name
      this.method = 'GET'; // This is the method (GET, POST, PUT, DELETE)
      this.handler = this.handler; // This is the handler
    }
  
    handler(req, res) {
        const json = fs.readFileSync('./cache/data.json');
        const obj = JSON.parse(json);
        var data = obj.find(o => o.code === req.params.type);
        if (data) {
            var img = Buffer.from(data.data, 'base64');
            res.writeHead(200, {
                'Content-Type': data.type,
                'Content-Length': img.length
            });
            res.end(img);
        }
        else {
            res.send('Not found');
        }
    }
  }
  module.exports = new photo();
  