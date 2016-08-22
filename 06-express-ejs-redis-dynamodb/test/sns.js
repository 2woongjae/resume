'use strict';

const AWS = require('aws-sdk');

AWS.config = {
  region: 'ap-northeast-2'
};

const sns = new AWS.SNS({apiVersion: '2010-03-31'});

const params = {
  Subject: 'lotte-server test',
  Message: 'test/sns.js 에서 테스트로 보내짐.',
  TopicArn: 'arn:aws:sns:ap-northeast-2:961228086927:lotteTopic'
};

sns.publish(params, (err, data) => {
  
  if (err)
    console.log(err, err.stack);
  else
    console.log(data);

});

