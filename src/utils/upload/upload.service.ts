import { Req, Res, Injectable } from '@nestjs/common';
import * as multer from 'multer';
import * as multerS3 from 'multer-s3';
import { s3 } from 'src/configs/s3';

@Injectable()
export class UploadService {
    async fileupload(@Req() req, @Res() res) {
        this.upload(req, res, async function (error) {
            if (error) {
                console.log(error);
                return res
                    .status(404)
                    .json(`Failed to upload image file: ${error}`);
            }
            const files = req.files;

            const file_data = await files.map((element) => {
                return {
                    file_image: element.location,
                    file_key: element.key,
                };
            });

            return res.json({
                file_data,
            });
        });
    }

    upload = multer({
        storage: multerS3({
            s3: s3,
            bucket: 'wooyc/RoYal',
            acl: 'public-read',
            contentType: multerS3.AUTO_CONTENT_TYPE,
            cacheControl: 'max-age=31536000',
            metadata: (req, file, cb) => {
                cb(null, { fieldName: file.fieldname });
            },
            key: (req, file, cb) => {
                cb(null, `${Date.now()}_${file.originalname}`);
            },
        }),
    }).array('files', 10);
}
