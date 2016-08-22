var insert = require('./insert');
var express = require('express');
var mongojs = require('mongojs');
var router = express.Router();
var fs = require('fs');
require('date-utils');
var multer = require('multer');
var path = require('path');
var upload = multer({
  dest:"/home/ubuntu/lotte-server/public/upload/"
});

var AWS = require("aws-sdk");

AWS.config = {
  region: 'ap-northeast-2'
};

var s3 = new AWS.S3({signatureVersion: 'v4'});

var sendMail = require('../vtouch/sns');
var execLambda = require('../vtouch/lambda');

var hash = require('./passwd').hash;

sendMail('LOTTE-SERVER restart', '서버가 재시작되었습니다.');

router.get('/system', function(req, res) {

  if (req.session.login) res.render("system.html");
  else res.redirect("/login");

});

router.get('/', function(req, res) {
  	
  if (req.session.login) res.render("index.html");
  else res.redirect("/login");

});

router.get('/login', function(req, res) {

  if (req.session.login) res.redirect("/");
  else res.render("login.html");
  
});

/* 로그인 submit [post] */
router.post('/login', function(req, res) {
  
  if (req.session.login) res.redirect("/");
  else {

    var mongodb = req.app.locals.config.mongodb;	// db
    var salt = req.app.locals.config.salt;		// salt

    // post
    var email = req.body.email;
    var passwd = req.body.passwd;

    var db = mongojs(mongodb, ['user']);
    db.user.find({"email":email}, function(error, data) {

      db.close();

      if (error) console.log(error);

      if (data.length > 0) {

        hash(passwd, salt, function(err, str) {

          if (err) res.redirect("/");

          if (data[0].passwd === str) {

            req.session.login = true;
            req.session.email = email;

          }

          res.redirect("/");

        });

      } else res.redirect("/");
      
    });
        
  }
  
});

router.get('/logout', function(req, res) {
  
  if (req.session.login) {
	  
    req.session.destroy(function() {

      res.redirect("/");

    });
	
  } else res.redirect("/");
  
});

router.get('/movie', function(req, res) {
  
  if (!req.session.login) res.redirect("/");
  
  else res.render("movie/list.html");
	
});

router.get('/movie/add', function(req, res) {
  
  if (!req.session.login) res.redirect("/");
  
  else res.render("movie/add.html");
	
});

function s3Upload(type, path, filename) {

  var key = (type === 'wmv') ? 'lotte/movie/' : 'lotte/poster/';

  fs.readFile(path + filename, function(err, file_buffer) {

    if (err) {

      console.log(err);

      return;

    }

    s3.putObject({
      Bucket: 'public.vtouchinc.com',
      Key: key + filename,
      Body: file_buffer
    }, function (err, data) {

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

router.post("/movie/add", upload.array("files", 2), function(req, res) {

  if (!req.session.login) {

    res.redirect("/");

  } else {

    var mongodb = req.app.locals.config.mongodb;	// db
	
    // post
    var title = req.body.title;
    var files = req.files;
    var time = new Date();
    var time_str = time.toFormat('YYYYMMDDHH24MISS');
    var email = req.session.email;
    var ip = req.ip;
	
    // object
    var movie = {
      title:title,
      reg_date:time_str,
      reg_id:email,
      reg_ip:ip
    };
	
    for (var i = 0; i < files.length; i++) {
		
      if (i === 0) {

        fs.renameSync(files[i].path, '/home/ubuntu/lotte-server/public/upload/' + files[i].filename + ".jpg");
        movie.poster_url = "http://public.vtouchinc.com/lotte/poster/" + files[i].filename + ".jpg";
        s3Upload('jpg', '/home/ubuntu/lotte-server/public/upload/', files[i].filename + '.jpg');			

      } else {
				
        fs.renameSync(files[i].path, '/home/ubuntu/lotte-server/public/upload/' + files[i].filename + ".wmv");
        movie.video_url = "http://public.vtouchinc.com/lotte/movie/" + files[i].filename + ".wmv";
        s3Upload('wmv', '/home/ubuntu/lotte-server/public/upload/', files[i].filename + '.wmv');

      }
	
    }
	
    execLambda({
      operation: 'setMovie',
      payload: movie
    }, function(data) {

      res.redirect('/movie');

    });

  }

});

// json
router.get("/list", function(req, res) {

  if (!req.session.login) res.redirect("/");
	
  else {

    execLambda({operation: 'getMovies'}, function(data) {

      res.send(data);

    });

  }

});

router.get('/wall', function(req, res) {
  
  if (!req.session.login) res.redirect("/");
  else res.render("wall/index.html");
	
});

router.post("/wall/search", function(req, res) {

  if (!req.session.login) res.redirect("/");
	  
  else {

    var text = req.body.text;

    execLambda({
      operation: 'searchMovies',
      payload: {
        text: text
      }
    }, function(data) {

      res.send(data);

    });

  }

});

router.get("/movie/:id", function(req, res) {

  if (!req.session.login) res.redirect("/");
	
  else {

    var id = req.params.id;

    execLambda({
      operation: 'getMovie',
      payload: {
        mid: id
      }
    }, function(data) {

      res.send(data);

    });  

  }

});

router.post("/movie/apply", function(req, res) {

  if (!req.session.login) res.redirect("/");

  else {
	
    var location = "신도림";
    var movies = JSON.parse(req.body.movies);
    var time = new Date();
    var time_str = time.toFormat('YYYYMMDDHH24MISS');
    var email = req.session.email;
    var ip = req.ip;

    var wall = {
      location:location,
      movies:movies,
      reg_date:time_str,
      reg_id:email,
      reg_ip:ip
    };

    execLambda({
      operation: 'setWall',
      payload: wall
    }, function(data) {

      res.redirect("/wall");

    });

  }
	
});

module.exports = router;
