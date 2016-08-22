'use strict';

const AWS = require("aws-sdk");

AWS.config = {
  region: 'ap-northeast-1'
};

const lambda = new AWS.Lambda({apiVersion: '2015-03-31'});

const execLambda = (payload, callback) => {

  const params = {
    FunctionName: 'lotte-dynamo',
    Payload: JSON.stringify(payload)
  };

  lambda.invoke(params, (err, data) => {

    if (err)
      console.log('lambda 실패');
    else {

      console.log('lambda 성공');

      callback(JSON.parse(data.Payload));

    }

  });

}

module.exports = execLambda;
