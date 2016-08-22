'use strict';

const moment = require('moment');
const express = require('express');
const router = express.Router();
const execLambda = require('../vtouch/lambda');
require('date-utils');

const mongojs = require('mongojs');

/* 서버가 다운인지 체크하는 함수 */
router.get('/check', (req, res) => {

  res.send('Y');

});

/* 시간 기준으로 영화가 바뀌었는지 체크하는 함수 */
router.get('/update/:time', (req, res) => {

  const time = req.params.time;

  execLambda({
    operation: 'getLastWall'
  }, (data) => {

    if (data.id === undefined) res.send('N');
    else {

      if (Number(data.reg_date) > Number(time)) res.send(data);
      else res.send('N');

    }

  });

});

/* 영화 아이디로 클릭을 체크 */
router.get('/like/:id', (req, res) => {

  const mongodb = req.app.locals.config.mongodb;
	
  const mid = req.params.id;
  const wall = "신도림";
  const time = moment().utcOffset('+09:00').format('YYYYMMDDHHmmss');
  const ip = req.ip;
	
  const like = {
    movie: mid,
    wall: wall,
    reg_date: time,
    reg_ip: ip
  }

  const db = mongojs(mongodb, ['like']);
  db.like.insert(like, () => {
	
    db.close();
    res.send('Y');
		
  });

});

/* */
router.get('/like', (req, res) => {

  const mongodb = req.app.locals.config.mongodb;
	
  const db = mongojs(mongodb, ['like']);
  db.like.find({reg_date: { $gt: '20151110000000' }}, (error, data) => {
		
    db.close();

    if (data.length > 0) res.send(data);
    else res.send('N');
		
  });

});

/* 영화 아이디로 영화 객체 리턴 */
router.get('/movie/:id', (req, res) => {
	
  const mid = req.params.id;

  execLambda({
    operation: 'getMovie',
    payload: {
      mid: mid
    }
  }, data => {

    if (data.mid !== undefined) res.send(data);
    else res.send('N');

  });

});

/* 영화 객체 전체를 배열로 리턴 */
router.get('/movie', (req, res) => {
	
  execLambda({
    operation: 'getMovies'
  }, data => {

    if (data.length > 0) res.send(data);
    else res.send('N');

  });

});

/* 가장 최신 무비월 객체를 리턴 */
router.get('/wall', (req, res) => {

  execLambda({
    operation: 'getLastWall'
  }, data => {

    if (data.id !== undefined) res.send(data);
    else res.send('N');

  });

});

module.exports = router;
