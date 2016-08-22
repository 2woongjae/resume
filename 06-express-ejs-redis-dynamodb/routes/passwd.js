var crypto = require('crypto'); // 내장 모듈

var len = 128; // Bytesize.
var iterations = 12000; // Iterations. ~300ms

exports.hash = function (pwd, salt, _callback) {
  
  // 3개짜리 인자 => 암호화 결과 (정해진 salt)
  if (3 == arguments.length) {
  
    crypto.pbkdf2(pwd, salt, iterations, len, function(err, hash){
      
      // # 에러 콜백
      if (err) return __callback(err);
      
      // # 정상 콜백
      _callback(err, hash.toString('base64'));
    
    });
  
  } else if (2 == arguments.length) { // 2개 짜리 인자 => 암호화 결과 (랜덤한 salt)
        
    _callback = salt;
    
    crypto.randomBytes(len, function(err, salt){
      
      // # 에러 콜백
      if (err) return __callback(err);
      
      salt = salt.toString('base64');
      
      crypto.pbkdf2(pwd, salt, iterations, len, function(err, hash){

        // # 에러 콜백
        if (err) return _callback(err);
        
        // # 정상 콜백
        _callback(null, salt, hash.toString('base64'));

      });
    
    });
  
  }

};