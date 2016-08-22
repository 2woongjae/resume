'use strict';

const moment = require('moment');
const request = require('request');
const SendMail = require('./SendMail');

function CheckTime(args) {

  console.log('CheckTime start : ' + args.time);
 
  return new Promise((resolve, reject) => {

    if (args.time === '0230') {
    
      args.date = moment().utcOffset('+09:00').subtract(1, 'days').format('YYYYMMDD');

      resolve(args);

    } else {

      reject('no check time');

    }

  });
  
}

function TotalMovie(args) {

  console.log('TotalMovie start / 메일로 보낼 날짜 : ' + args.date);

  return new Promise((resolve, reject) => {

    request('http://lotte.vtouchinc.com/api/movie', (error, response, body) => {
        
      if (!error && response.statusCode === 200) {
          
        const data = JSON.parse(body);

        args.movies = [];
			
        for (let i = 0; i < data.length; i++) {

          var movie = { MovieId : data[i].mid , Title : data[i].title , Like : 0 };

          args.movies.push(movie);

        } 

        resolve(args);

      }  
 
    });

  });

}

function MovieLike(args) {

  console.log('MovieLike start / 전체 영화의 수 : ' + args.movies.length);

  return new Promise((resolve, reject) => {

    request('http://lotte.vtouchinc.com/api/like', (error, response, body) => {
        
      if (!error && response.statusCode === 200) {

        const data = JSON.parse(body);

        args.likes = [];

        for (var i = 0 ; i < data.length; i++) {

          var temp = Number(data[i].reg_date.substring(0,8));

          if (temp === Number(args.date)) {

            var like = data[i];
            args.likes.push(like);

          }

        }

        resolve(args);

      }

    });

  });

};

function EachMovieDayMovie(args) {

  console.log('EachMovieDayMovie start / 메일 보낼 날짜의 라이크 수 : ' + args.likes.length);

  return new Promise((resolve, reject) => {

    for (let i = 0; i < args.movies.length; i++) {

      for (let j = 0; j < args.likes.length; j++) {

        if (args.likes[j].movie == args.movies[i].MovieId) args.movies[i].Like++;

      }

    }

    resolve(args);

  });

};

function ZeroLikeMovie(args) {

  console.log('ZeroLikeMovie start');

  return new Promise((resolve, reject) => {

    args.prints = [];

    for (let i = 0; i < args.movies.length; i++){

      if (args.movies[i].Like !== 0) args.prints.push(args.movies[i]);

    }

    resolve(args);

  });

};

function main(event, context) {

  Promise.resolve({time: moment().utcOffset('+09:00').format('HHmm')})
         .then(CheckTime)
         .then(e => {
           
           Promise.resolve(e)
                  .then(TotalMovie)
                  .then(MovieLike)
                  .then(EachMovieDayMovie)
                  .then(ZeroLikeMovie)
                  .then(e => {

                    Promise.resolve(e)
                           .then(SendMail)
                           .then(e => context.succeed(e))
                           .catch(err => context.fail(err));
                    
                  });

         })
         .catch(err => context.fail(err));

};

exports.handler = main;