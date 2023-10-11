// const multer = require("multer");
// const storage = multer.memoryStorage();

// const singleUpload = multer({storage}).single("file")

// module.exports = singleUpload;

const multer = require('multer');

module.exports = multer({
  storage: multer.diskStorage({}),
  limits: { fileSize: 500000 }
});