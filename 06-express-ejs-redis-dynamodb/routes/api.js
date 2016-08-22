var moment = require('moment');
var express = require('express');
var router = express.Router();
var execLambda = require('../vtouch/lambda');
require('date-utils');

var mongojs = require('mongojs');

/* 서버가 다운인지 체크하는 함수 */
router.get("/check", function(req, res) {

  res.send("Y");

});

/* 시간 기준으로 영화가 바뀌었는지 체크하는 함수 */
router.get("/update/:time", function(req, res) {

  var time = req.params.time;

  execLambda({
    operation: 'getLastWall'
  }, function(data) {

    if (data.id === undefined) res.send('N');
    else {

      if (Number(data.reg_date) > Number(time)) res.send(data);
      else res.send('N');

    }

  });

});

/* 영화 아이디로 클릭을 체크 */
router.get("/like/:id", function(req, res) {

  var mongodb = req.app.locals.config.mongodb;
	
  var mid = req.params.id;
  var wall = "신도림";
  var time = moment().utcOffset('+09:00').format('YYYYMMDDHHmmss');
  var ip = req.ip;
	
  var like = {
    movie: mid,
    wall: wall,
    reg_date: time,
    reg_ip: ip
  }

  var db = mongojs(mongodb, ['like']);
  db.like.insert(like, function() {
	
    db.close();
    res.send("Y");
		
  });

});

/* */
router.get("/like", function(req, res) {

  var mongodb = req.app.locals.config.mongodb;	// db
	
  var db = mongojs(mongodb, ['like']);
  db.like.find({reg_date: { $gt: "20151110000000" }}, function(error, data) {
		
    db.close();

    if (data.length > 0) res.send(data);
    else res.send("N");
		
  });

});

/* 영화 아이디로 영화 객체 리턴 */
router.get("/movie/:id", function(req, res) {
	
  var mid = req.params.id;

  execLambda({
    operation: 'getMovie',
    payload: {
      mid: mid
    }
  }, function(data) {

    if (data.mid !== undefined) res.send(data);
    else res.send("N");

  });

});

/* 영화 객체 전체를 배열로 리턴 */
router.get("/movie", function(req, res) {
	
  execLambda({
    operation: 'getMovies'
  }, function(data) {

    if (data.length > 0) res.send(data);
    else res.send("N");

  });

});

/* 가장 최신 무비월 객체를 리턴 */
router.get("/wall", function(req, res) {

  execLambda({
    operation: 'getLastWall'
  }, function(data) {

    if (data.id !== undefined) res.send(data);
    else res.send("N");

  });

});

module.exports = router;
