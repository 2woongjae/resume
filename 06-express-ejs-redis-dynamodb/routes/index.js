'use strict';

const insert = require('./insert');
const express = require('express');
const mongojs = require('mongojs');
const router = express.Router();
const fs = require('fs');
require('date-utils');
const multer = require('multer');
const path = require('path');
const upload = multer({
  dest: '/home/ubuntu/lotte-server/public/upload/'
});

const AWS = require('aws-sdk');

AWS.config = {
  region: 'ap-northeast-2'
};

const s3 = new AWS.S3({signatureVersion: 'v4'});

const sendMail = require('../vtouch/sns');
const execLambda = require('../vtouch/lambda');

const hash = require('./passwd').hash;

sendMail('LOTTE-SERVER restart', '서버가 재시작되었습니다.');

router.get('/system', (req, res) => {

  if (req.session.login) res.render('system.html');
  else res.redirect('/login');

});

router.get('/', (req, res) => {
  	
  if (req.session.login) res.render('index.html');
  else res.redirect('/login');

});

router.get('/login', (req, res) => {

  if (req.session.login) res.redirect('/');
  else res.render('login.html');
  
});

/* 로그인 submit [post] */
router.post('/login', (req, res) => {
  
  if (req.session.login) res.redirect('/');
  else {

    const mongodb = req.app.locals.config.mongodb;	// db
    const salt = req.app.locals.config.salt;		// salt

    // post
    const email = req.body.email;
    const passwd = req.body.passwd;

    const db = mongojs(mongodb, ['user']);
    db.user.find({"email":email}, (error, data) => {

      db.close();

      if (error) console.log(error);

      if (data.length > 0) {

        hash(passwd, salt, (err, str) => {

          if (err) res.redirect('/');

          if (data[0].passwd === str) {

            req.session.login = true;
            req.session.email = email;

          }

          res.redirect('/');

        });

      } else res.redirect('/');
      
    });
        
  }
  
});

router.get('/logout', (req, res) => {
  
  if (req.session.login) {
	  
    req.session.destroy(() => {

      res.redirect('/');

    });
	
  } else res.redirect('/');
  
});

router.get('/movie', (req, res) => {
  
  if (!req.session.login) res.redirect('/');
  
  else res.render('movie/list.html');
	
});

router.get('/movie/add', (req, res) => {
  
  if (!req.session.login) res.redirect('/');
  
  else res.render('movie/add.html');
	
});

function s3Upload(type, path, filename) {

  var key = (type === 'wmv') ? 'lotte/movie/' : 'lotte/poster/';

  fs.readFile(path + filename, (err, file_buffer) => {

    if (err) {

      console.log(err);

      return;

    }

    s3.putObject({
      Bucket: 'public.vtouchinc.com',
      Key: key + filename,
      Body: file_buffer
    }, (err, data) => {

      if (err) {

        sendMail('lotte-server 에서 s3 로 업로드 실패', filename);
        return;

      }

      fs.unlinkSync(path + filename);

      if (type === 'wmv') console.log('success movie : ' + filename);
      else if (type === 'jpg') console.log('success poster : ' + filename);

    });

  });

}

router.post('/movie/add', upload.array('files', 2), (req, res) => {

  if (!req.session.login) {

    res.redirect('/');

  } else {

    const mongodb = req.app.locals.config.mongodb;
	
    const title = req.body.title;
    const files = req.files;
    const time = new Date();
    const time_str = time.toFormat('YYYYMMDDHH24MISS');
    const email = req.session.email;
    const ip = req.ip;
	
    // object
    const movie = {
      title: title,
      reg_date: time_str,
      reg_id: email,
      reg_ip: ip
    };
	
    for (let i = 0; i < files.length; i++) {
		
      if (i === 0) {

        fs.renameSync(files[i].path, '/home/ubuntu/lotte-server/public/upload/' + files[i].filename + '.jpg');
        movie.poster_url = 'http://public.vtouchinc.com/lotte/poster/' + files[i].filename + '.jpg';
        s3Upload('jpg', '/home/ubuntu/lotte-server/public/upload/', files[i].filename + '.jpg');			

      } else {
				
        fs.renameSync(files[i].path, '/home/ubuntu/lotte-server/public/upload/' + files[i].filename + '.wmv');
        movie.video_url = 'http://public.vtouchinc.com/lotte/movie/' + files[i].filename + '.wmv';
        s3Upload('wmv', '/home/ubuntu/lotte-server/public/upload/', files[i].filename + '.wmv');

      }
	
    }
	
    execLambda({
      operation: 'setMovie',
      payload: movie
    }, data => {

      res.redirect('/movie');

    });

  }

});

// json
router.get('/list', (req, res) => {

  if (!req.session.login) res.redirect('/');
	
  else {

    execLambda({operation: 'getMovies'}, data => {

      res.send(data);

    });

  }

});

router.get('/wall', (req, res) => {
  
  if (!req.session.login) res.redirect('/');
  else res.render('wall/index.html');
	
});

router.post('/wall/search', (req, res) => {

  if (!req.session.login) res.redirect('/');
	  
  else {

    const text = req.body.text;

    execLambda({
      operation: 'searchMovies',
      payload: {
        text: text
      }
    }, data => {

      res.send(data);

    });

  }

});

router.get('/movie/:id', (req, res) => {

  if (!req.session.login) res.redirect('/');
	
  else {

    const id = req.params.id;

    execLambda({
      operation: 'getMovie',
      payload: {
        mid: id
      }
    }, data => {

      res.send(data);

    });  

  }

});

router.post('/movie/apply', (req, res) => {

  if (!req.session.login) res.redirect('/');

  else {
	
    const location = '신도림';
    const movies = JSON.parse(req.body.movies);
    const time = new Date();
    const time_str = time.toFormat('YYYYMMDDHH24MISS');
    const email = req.session.email;
    const ip = req.ip;

    const wall = {
      location: location,
      movies: movies,
      reg_date: time_str,
      reg_id: email,
      reg_ip: ip
    };

    execLambda({
      operation: 'setWall',
      payload: wall
    }, data => {

      res.redirect('/wall');

    });

  }
	
});

module.exports = router;
