const multer = require("multer");
const { nanoid } = require("nanoid");

const fileUploader = ({
	destinationFolder = "",
	prefix = "POST",
	fileType = "image",
}) => {
	const storageConfig = multer.diskStorage({
		destination: (req, file, cb) => {
			cb(null, `${__dirname}/../public/${destinationFolder}`);
		},

		filename: (req, file, cb) => {
			const fileExtension = file.mimetype.split("/")[1];

			const filename = `${prefix}_${nanoid()}.${fileExtension}`;
			cb(null, filename);
		},
	});
	const uploader = multer({
		limits: {
			fileSize: 1000000,
		},
		storage: storageConfig,
		fileFilter: (req, file, cb) => {
			try {
				if (file.mimetype.split("/")[0] !== fileType) {
					return cb(null, false);
				}
				cb(null, true);
			} catch (error) {
				cb(error);
			}
		},
	});

	return uploader;
};

module.exports = { fileUploader };
