var AWS = require("aws-sdk");

AWS.config = {
  region: 'ap-northeast-2'
};

var sns = new AWS.SNS({apiVersion: '2010-03-31'});

var sendMail = function(subject, message) {

  var params = {
    Subject: subject,
    Message: message,
    TopicArn: 'arn:aws:sns:ap-northeast-2:961228086927:lotteSystemTopic'
  };

  sns.publish(params, function(err, data) {
  
    if (err)
      console.log('sns 실패 : ' + subject + ', ' + message);
    else
      console.log('sns 성공 : ' + subject + ', ' + message);

  });

}

module.exports = sendMail;
