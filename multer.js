const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, '..',"assets"));
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const filename = file.originalname.split(".")[0];
      cb(null, filename + "-" + uniqueSuffix + ".png");
    },

    // destination: function (req, file, cb) {
    //   cb(null, path.join(__dirname,"assets"));
    // },
    // filename: function (req, file, cb) {
    //   cb(null, file.originalname);
    // },
  });

const upload = multer({storage: storage});

module.exports = upload;

