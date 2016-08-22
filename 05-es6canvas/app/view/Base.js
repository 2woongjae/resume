import StackBlur from 'stackblur-canvas';

import Outside from '../Outside';
import Effect from '../Effect';

import * as Constant from '../Constant';

const CONSTANT = Constant.Base;

class Base {
  
  constructor(_app) {
    
    this.app = _app;
    this.canvas = document.getElementById('canvas');
    this.context = canvas.getContext('2d');
    
    this.outside = new Outside(_app);
    this.effect = new Effect(_app);
    this.effectLock = new Effect(_app);
    
    this.isPlay = false;
    
    this.dragX = 0;
    this.drags = null;
    
  }
  
  easing(t, b, c, d) {
  
    t /= d/2;
    if (t < 1) return c/2*t*t + b;
  
    t--;
    return -c/2 * (t * (t - 2) - 1) + b;
  
  }
  
  drawRect(_rect) {
    
    const context = (_rect.context === undefined) ? this.context : _rect.context;
    
    const color = _rect.color;
    
    const left = _rect.shape.cx - (_rect.shape.w / 2);
    const top = _rect.shape.cy - (_rect.shape.h / 2);
    const width = _rect.shape.w;
    const height = _rect.shape.h;
    
    context.save();
    
    context.fillStyle = color;
    context.fillRect(left, top, width, height);
    
    context.restore();
    
  }
  
  drawCircle(_context, _color, _circle) {
    
    _context.save();
    
    _context.fillStyle = _color;
    
    _context.beginPath();
    _context.arc(_circle.cx, _circle.cy, _circle.r, 0, 2 * Math.PI);
    _context.closePath();
    
    _context.fill();
        
    _context.restore();
    
  }
  
  drawText(_context, _basic, _stroke, _shadow) {
    
    _context.save();
    
    if(_stroke !== undefined) {
      _context.strokeStyle = _stroke.strokeStyle;
      _context.lineWidth = _stroke.lineWidth;
    }
    if(_shadow !== undefined) {
      _context.shadowColor = _shadow.shadowColor;
      _context.shadowBlur = _shadow.shadowBlur;
      _context.shadowOffsetX = _shadow.shadowOffsetX;
      _context.shadowOffsetY = _shadow.shadowOffsetY;
    }
    _context.font = _basic.font;
    _context.fillStyle = _basic.fillStyle;
    _context.textAlign = _basic.textAlign;
    if(_stroke !== undefined) {
      _context.strokeText(_basic.title, _basic.width, _basic.height);
    }
    _context.fillText(_basic.title, _basic.width, _basic.height);
    
    _context.restore();
    
  }
  
  drawImage(_context, _img, _rect, _shadow, _alpha) {
    
    _context.save();
        
    if (_shadow !== null) {
    
      _context.shadowColor = _shadow.color;
      _context.shadowBlur = _shadow.blur;
		  _context.shadowOffsetX = _shadow.x;
		  _context.shadowOffsetY = _shadow.y;  
      
    }
    
    if (_alpha !== null) {
      
      _context.globalAlpha = _alpha;
      
    }
    
    const left = _rect.cx - Math.round(_rect.w / 2);
    const top = _rect.cy - Math.round(_rect.h / 2);
    
		_context.drawImage(_img, left, top, _rect.w, _rect.h);
    
    _context.restore();
      
  }
  
  drawSpriteImage(_context, _img, _rect, _shadow, _alpha) {
    
    _context.save();
        
    if (_shadow !== null) {
    
      _context.shadowColor = _shadow.color;
      _context.shadowBlur = _shadow.blur;
		  _context.shadowOffsetX = _shadow.x;
		  _context.shadowOffsetY = _shadow.y;  
      
    }
    
    if (_alpha !== null) {
      
      _context.globalAlpha = _alpha;
      
    }
    
    if(_rect.l === undefined) _rect.l = 0;
    if(_rect.t === undefined) _rect.t = 0;
    
    const left = _rect.cx - Math.round(_rect.w / 2);
    const top = _rect.cy - Math.round(_rect.h / 2);
    
		_context.drawImage(_img, _rect.l, _rect.t, _rect.w, _rect.h, left, top, _rect.w, _rect.h);
    
    _context.restore();
      
  }
  
  drawFullImage(_context, _img, _rect, _shadow, _alpha) {
    
    _context.save();
        
    if (_shadow !== null) {
    
      _context.shadowColor = _shadow.color;
      _context.shadowBlur = _shadow.blur;
		  _context.shadowOffsetX = _shadow.x;
		  _context.shadowOffsetY = _shadow.y;  
      
    }
    
    if (_alpha !== null) {
      
      _context.globalAlpha = _alpha;
      
    }
    
    if(_rect.l === undefined) _rect.l = 0;
    if(_rect.t === undefined) _rect.t = 0;
    if(_rect.sx === undefined) _rect.sx = _img.width;
    if(_rect.sy === undefined) _rect.sy = _img.height;
    
    const left = _rect.cx - Math.round(_rect.w / 2);
    const top = _rect.cy - Math.round(_rect.h / 2);
        
		_context.drawImage(_img, _rect.l, _rect.t, _rect.sx, _rect.sy, left, top, _rect.w, _rect.h);
    
    _context.restore();
      
  }
  
  drawVideo = (_video) => {
            
		this.context.drawImage(_video, 0, 0, 1920, 1080);
        
    if (this.isPlay) setTimeout(this.drawVideo, 30, _video);
      
  }
  
  drawRotatedImage(image, x, y, angle , _alpha) { 

    const TO_RADIANS = Math.PI/180; 

		this.context.save(); 

		this.context.translate(x, y);

		this.context.rotate(angle * TO_RADIANS);
    
    if (_alpha !== undefined) this.context.globalAlpha = _alpha;
      
		this.context.drawImage(image, -(image.width/2), -(image.height/2));

		this.context.restore();
     
	}
  
  appearUser() {
    
    
  }
  
  disappearUser() {
    
    
  }
  
  pause() {
    
    
  }
  
  trigger(_eventName, _id, _hit) {
    
    
  }

  triggerLock(_eventName) {
    
    if (_eventName === '[매니저] 락유저의 우선권이 생김') {
      
      this.effectLock.selectEffect(960, 1050);
      
    } else if (_eventName === '[매니저] 락유저의 우선권이 사라짐 : 영역에서 나감') {
       
       this.effectLock.cancelEffect();
       
    } else if (_eventName === '[매니저] 락유저의 우선권이 사라짐 : 취소') {
      
       this.effectLock.cancelEffect();
      
    } else if (_eventName === '[매니저] 락유저의 우선권이 사라짐 : 컴펌 성공') {
    
      this.effectLock.confirmEffect();
      
      this.hideLock();
      
    } else if (_eventName === '[매니저] 락유저의 우선권이 있는 상태에서 한번 더 셀렉트') {
      
    } else if (_eventName === '[매니저] 락유저의 우선권이 있는 상태에서 그대로') {
     
    }
    
  }

  getDrag() {
    
    let sum = 0;
    
    this.drags.forEach(drag => {
      
      sum = sum + drag;
      
    });
    
    return Math.round(sum / this.drags.length);
    
  }

  addImageResource(prop, src) {

    if (this.img === undefined) {
      
      this.img = {};
      this.imageCount = 0;

    }

    return new Promise((resolve, reject) => {

      this.img[prop] = new Image();
      this.img[prop].src = src;
      this.img[prop].addEventListener('load', () => {

        resolve();

      }, false);

    });

  }

  selectDrag = (x) => {

    this.drag = x;        // 첫 x 의 좌표와 다음 x 들을 비교하여 드래그의 시작점을 잡기 위한 프로퍼티
    this.drags = [];      // 평균을 내서 드래그의 실제 이동 위치를 덜 튀게 하기 위한 배열 프로퍼티
    this.drags.push(x);

  }

  addX = (x) => {

    if (this.drags.length > CONSTANT.DRAG_AVG_LENGTH - 1) this.drags.shift();
              
    this.drags.push(x);

  }
  
}

export default Base;
