// import * as multer from 'multer';
// import * as multerS3 from 'multer-s3';
// import { s3 } from 'src/configs/s3';

// export const upload = multer({
//     limits: { fileSize: 500 * 1024 * 1024 },
//     storage: multerS3({
//         s3,
//         bucket: 'dadrill-files',
//         acl: 'public-read',
//         contentType: multerS3.AUTO_CONTENT_TYPE,
//         cacheControl: 'max-age=31536000',
//         metadata: (req, file, cb) => {
//             cb(null, { fieldName: file.fieldname });
//         },
//         key: (req, file, cb) => {
//             cb(null, `${Date.now()}_${file.originalname}`);
//         },
//     }),
// });
