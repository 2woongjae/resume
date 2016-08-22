import CryptoJS from 'crypto-js';
import aws from 'aws-sdk';
import { awsOptions } from '../config';

const s3Bucket = 'public.vtouchinc.com';
const s3Hostname = 's3.ap-northeast-2.amazonaws.com';
aws.config.update({
  region: awsOptions.region
});
const s3 = new aws.S3();

export const getS3handler = (req, res) => {
  const file = `vtv/${req.query.filename}`;

  const s3Params = {
    Bucket: s3Bucket,
    Key: file,
    Expires: 7200,
    ContentType: req.query.filetype,
    ACL: 'public-read'
  };
  s3.getSignedUrl('putObject', s3Params, (error, data) => {
    if(error)
      return res.status(400).json({
        meta: {
          status: 400,
          error: 's3sign_error',
          message: error
        }
      });

    res.status(200).json({
      meta: {
        status: 200
      },
      data: {
        signed_request: data,
        url: `https://${s3Hostname}/${s3Bucket}/${file}`
      }
    });
  });
};
