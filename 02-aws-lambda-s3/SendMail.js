'use strict';

const AWS = require("aws-sdk");

AWS.config = {
  region: 'ap-northeast-2'
};

const sns = new AWS.SNS({apiVersion: '2010-03-31'});

module.exports = function(args) {

  console.log('SendMail start / 라이크가 눌린 영화의 수 : ' + args.prints.length);

  return new Promise((resolve, reject) => {

    const mail = {
      subject: args.date + " 롯데시네마 사용현황.",
      message: "전체 사용 횟수 : " + args.likes.length + '\r\n\r\n'
    };

    for (let i = 0 ; i < args.prints.length ; i++) {
			
      mail.message = mail.message + args.prints[i].Title + " : " + args.prints[i].Like + '\r\n';

    }

    const params = {
      Subject: mail.subject,
      Message: mail.message,
      TopicArn: 'arn:aws:sns:ap-northeast-2:961228086927:lotteReportTopic'
    };

    //resolve(mail.subject + ', ' + mail.message);
    
    sns.publish(params, (err, data) => {
  
      if (err) {
          
        console.log('sns 실패 : ' + mail.subject + ', ' + mail.message);

        reject('sns failed');

      } else {
          
        console.log('sns 성공 : ' + mail.subject + ', ' + mail.message);

        resolve('sns success');

      }
      

    });
    
  });

}