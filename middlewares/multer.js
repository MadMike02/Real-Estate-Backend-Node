const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileValidate = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/jpg") {
    cb(null, true);
  } else {
    cb(
      {
        message: "Unsupported file type. Use JPEG or JPG only!",
        status: "error",
      },
      false
    );
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileValidate,
});

module.exports = upload;
