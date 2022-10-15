const fs = require("fs-extra"),
    config = require("../config"),
    Mongoose = require("../handler/mongodb");
class photo {
    constructor() {
        this.name = "photo/:type",
        this.method = "GET",
        this.handler = this.handler
    }
    handler(req, res) {
        var type = req.params.type;
        switch (config.type) {
            case "mongodb":
                Mongoose.find({
                    code: type
                }, (function (err, docs) {
                    if (err) return console.error(err);
                    if (0 == docs.length) res.send({
                        status: 404,
                        message: "Không tìm thấy ảnh"
                    });
                    else {
                        var img = Buffer.from(docs[0].data.split(",")[1], "base64");
                        res.writeHead(200, {
                            "Content-Type": "image/png",
                            "Content-Length": img.length
                        }), res.end(img)
                    }
                }));
                break;
            case "json":
                var json = fs.readFileSync("./cache/data.json"),
                    data = JSON.parse(json).filter((function (item) {
                        return item.code == type
                    })),
                    img = Buffer.from(data[0].data.split(",")[1], "base64");
                res.writeHead(200, {
                    "Content-Type": "image/png",
                    "Content-Length": img.length
                }), res.end(img);
                break;
            default:
                res.send({
                    status: 500,
                    message: "Lỗi hệ thống"
                })
        }
    }
}
module.exports = new photo;