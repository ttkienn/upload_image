const fs = require("fs-extra");
const config = require("../config");
const Mongoose = require("../handler/mongodb");
const _ = require("lodash");

class Photo {
    constructor() {
        this.name = "photo/:type";
        this.method = "GET";
        this.handler = this.handler.bind(this);
    }

    async handler(req, res) {
        try {
            const type = req.params.type;

            let data;
            switch (config.type) {
                case "mongodb":
                    data = await Mongoose.find({ code: type }).exec();
                    break;
                case "json":
                    const json = fs.readFileSync("./cache/data.json");
                    data = JSON.parse(json).filter(item => item.code === type);
                    break;
                default:
                    throw new Error("Lỗi hệ thống");
            }

            if (_.isEmpty(data)) {
                return res.status(404).json({ status: 404, message: "Không tìm thấy ảnh" });
            }

            const img = Buffer.from(data[0].data.split(",")[1], "base64");

            res.writeHead(200, {
                "Content-Type": "image/png",
                "Content-Length": img.length
            });

            res.end(img);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: true, message: error.message });
        }
    }
}

module.exports = new Photo();
