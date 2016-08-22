'use strict';

const AWS = require("aws-sdk");

AWS.config = {
  region: 'ap-northeast-1'
};

var lambda = new AWS.Lambda({apiVersion: '2015-03-31'});

function dynamo() {
    
  return new Promise((resolve, reject) => {

    var params = {
      FunctionName: 'lotte-dynamo',
      Payload: `{"operation": "getMovie", "payload": {"mid": "12"}}`
    };

    lambda.invoke(params, function(err, data) {

      if (err) reject(err.stack);
      else resolve(data.Payload);

    });

  });

}

Promise.resolve()
       .then(dynamo)
       .then(e => console.log(e))
       .catch(err => console.log(err));