var AWS = require("aws-sdk");

AWS.config = {
  region: 'ap-northeast-1'
};

var lambda = new AWS.Lambda({apiVersion: '2015-03-31'});

var execLambda = function(payload, callback) {

  var params = {
    FunctionName: 'lotte-dynamo',
    Payload: JSON.stringify(payload)
  };

  lambda.invoke(params, function(err, data) {

    if (err)
      console.log('lambda 실패');
    else {

      console.log('lambda 성공');

      callback(JSON.parse(data.Payload));

    }

  });

}

module.exports = execLambda;
