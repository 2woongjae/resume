import 'babel-polyfill';
import TV from './TV';

// 메인
(function() {
  
  window.addEventListener('load', function() {
    
    new TV();
 
  }, false);

})();
