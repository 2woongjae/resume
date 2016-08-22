var filename = process.argv[2];

var filecheck = filename.split('.');

var fs = require('fs');

console.log("filename : " + filename);

var AWS = require("aws-sdk");

AWS.config.update({region:'ap-northeast-2', accessKeyId:"AKIAI37LJO4AAAGZCHPA", secretAccessKey:"v4CSdooik24l/s8bfx121V+6w$

var s3 = new AWS.S3();

var key = (filecheck[1] === 'wmv') ? 'lotte/movie/' : 'lotte/poster/';

fs.readFile(filename, function(err, file_buffer) {

  if (err) {

    console.log(err);

    return;

  }

  s3.putObject({
    Bucket: 'public.vtouchinc.com',
    Key: key + filename,
    Body: file_buffer
  }, function (resp) {

    console.log('Successfully uploaded package.');

    fs.unlinkSync(filename);

  });

});

