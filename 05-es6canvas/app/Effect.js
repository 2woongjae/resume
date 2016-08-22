const CONSOLE_STYLE = 'color: red';

class Effect {
  
  constructor(_app) {
    
    this.app = _app;
    this.canvas = document.getElementById('canvas');
    this.context = canvas.getContext('2d');
    
    this.isShow = false;
    this.position = {x: 0, y: 0};
    
    this.interval = {
      select: null,
      cancel: null,
      confirm: null,
      long: null
    };
    
    this.r = 50;
    this.opacity1 = 0.5;
    this.opacity2 = 0.8;
    this.isStart = false;
    
    this.longCount = 0;
    this.longStep = 0;
    
  }
  
  Update() {
    
  }
  
  Render() {
    
    if (this.isShow) {
      
      this.drawCircle(`rgba(255, 255, 255, ${this.opacity1})`, {cx: this.position.x, cy: this.position.y, r: this.r}, {color:'rgba(0, 0, 0, 0.5)', x: 0, y: 0, blur: 10});
      this.drawCircle(`rgba(255, 255, 255, ${this.opacity2})`, {cx: this.position.x, cy: this.position.y, r: this.r}, {color:'rgba(0, 0, 0, 0.5)', x: 0, y: 3, blur: 5});
    
    }
  
  }
  
  onResourceLoaded() {
    
  }
  
  drawCircle(_color, _circle, _shadow) {
    
    this.context.save();
    
    if (_shadow) {
    
      this.context.shadowColor = _shadow.color;
      this.context.shadowBlur = _shadow.blur;
		  this.context.shadowOffsetX = _shadow.x;
		  this.context.shadowOffsetY = _shadow.y;  
      
    }
        
    this.context.fillStyle = _color;

    this.context.beginPath();
    this.context.arc(_circle.cx, _circle.cy, _circle.r, 0, 2 * Math.PI, false);
    this.context.fill();
    
    this.context.restore();
    
  }
  
  selectEffect(cx, cy, callback) { // 200ms
       
    console.log('%c[이펙트] 셀렉트', CONSOLE_STYLE); 
        
    if (this.interval.confirm !== null) clearInterval(this.interval.confirm);
    if (this.interval.cancel !== null) clearInterval(this.interval.cancel);
    if (this.interval.select !== null) clearInterval(this.interval.select);
    if (this.interval.long !== null) clearInterval(this.interval.long);
    
    this.position.x = cx;
    this.position.y = cy;
    
    this.r = 50;
    this.isStart = true;
    this.opacity1 = 0;
    this.opacity2 = 0;
    this.isShow = true;
    this.longCount = 0;
    
    this.interval.select = setInterval(() => {
      
      if (this.r === 50) {
        
        if (this.isStart) {
        
          this.r = this.r - 1;
          this.opacity1 = this.opacity1 + 0.05;
          this.opacity2 = this.opacity2 + 0.08;  
          
        } else {
         
          if (callback === undefined) {
            
            clearInterval(this.interval.select);  
            
          } else {
            
            this.longCount++;
            
            //console.log(this.longCount);
          
            if (this.longCount > 100) {
              
              clearInterval(this.interval.select);
              
              this.longStep = 0;
              this.longEffect(callback); 
            
            }
            
          }
          
        }
        
      } else if (this.r === 40) {
        
        this.isStart = false;
        this.r = this.r + 1;
        
      } else {
        
        if (this.isStart) {
          
          this.r = this.r - 1;  
          this.opacity1 = this.opacity1 + 0.05;
          this.opacity2 = this.opacity2 + 0.08;  
          
        } else {
          
          this.r = this.r + 1;  
          
        }
        
      }
      
      
    }, 10);
    
  }
  
  cancelEffect() { // 200ms
    
    console.log('%c[이펙트] 캔슬', CONSOLE_STYLE);

    if (this.interval.confirm !== null) clearInterval(this.interval.confirm);    
    if (this.interval.select !== null) clearInterval(this.interval.select);
    if (this.interval.cancel !== null) clearInterval(this.interval.cancel);
    if (this.interval.long !== null) clearInterval(this.interval.long);
    
    this.isStart = false;
    
    this.interval.cancel = setInterval(() => {
       
      if (this.opacity1 > 0) this.opacity1 = this.opacity1 - 0.05;
      if (this.opacity2 > 0) this.opacity2 = this.opacity2 - 0.08;
       
      if (this.opacity1 === 0 && this.opacity2 === 0) {
        
        clearInterval(this.interval.cancel);
          
        this.isShow = false;
          
        this.position.x = 0; 
        this.position.y = 0;
        
      } 
      
    }, 20);
    
  }
  
  confirmEffect() { // 200ms
    
    console.log('%c[이펙트] 컨펌', CONSOLE_STYLE);
    
    if (this.interval.select !== null) clearInterval(this.interval.select);
    if (this.interval.confirm !== null) clearInterval(this.interval.confirm);
    if (this.interval.cancel !== null) clearInterval(this.interval.cancel);
    if (this.interval.long !== null) clearInterval(this.interval.long);

    this.isStart = false;
    
    this.opacity1 = 0.5;
    this.opacity2 = 0.8;
    this.r = 50;
    
    this.isShow = true;
    
    this.interval.confirm = setInterval(() => {
       
      if (this.opacity1 > 0) this.opacity1 = Math.round((this.opacity1 - 0.05) * 100) /100;
      if (this.opacity2 > 0) this.opacity2 = Math.round((this.opacity2 - 0.08) * 100) /100;
      if (this.r < 250) this.r = Math.round(this.r + 20); 
      
      //console.log(this.opacity1 + ', ' + this.opacity2 + ', ' + this.r);
       
      if (this.opacity1 === 0 && this.opacity2 === 0 && this.r === 250) {
        
        clearInterval(this.interval.confirm);
          
        this.isShow = false;
          
        this.position.x = 0; 
        this.position.y = 0;
        
      } 
      
    }, 20);
    
  }
  
  dragEffect() { // 0ms
    
    console.log('%c[이펙트] 드래그', CONSOLE_STYLE);

    if (this.interval.confirm !== null) clearInterval(this.interval.confirm);    
    if (this.interval.select !== null) clearInterval(this.interval.select);
    if (this.interval.cancel !== null) clearInterval(this.interval.cancel);
    if (this.interval.long !== null) clearInterval(this.interval.long);
    
    this.isStart = false;
    this.isShow = false;
          
    this.position.x = 0; 
    this.position.y = 0;
        
  }
  
  longEffect(callback) {
    
    console.log('%c[이펙트] 롱', CONSOLE_STYLE);
    
    if (this.interval.select !== null) clearInterval(this.interval.select);
    if (this.interval.confirm !== null) clearInterval(this.interval.confirm);
    if (this.interval.cancel !== null) clearInterval(this.interval.cancel);
    if (this.interval.long !== null) clearInterval(this.interval.long);
    
    if (callback.acc) this.longStep++;
    
    let time = 600;
    
    if (this.longStep > 8) time = 200;
    else if (this.longStep > 4) time = 400;
    
    this.interval.long = setInterval(() => {
      
      clearInterval(this.interval.long);
      
      callback.func();
      
      this.interval.long = setInterval(() => {
        
        clearInterval(this.interval.long);
        
        this.longEffect(callback);
        
      }, 200);
      
    }, time);
    
  }
  
}

export default Effect;
