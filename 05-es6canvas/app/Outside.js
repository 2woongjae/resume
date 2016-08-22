const CONSTANT = {
  TITLE_FONT: '24px Noto Sans CJK KR Thin',
};

class Outside {
  
  constructor(_app) {
    
    this.app = _app;
    this.canvas = document.getElementById('canvas');
    this.context = canvas.getContext('2d');
    
    this.id = '';
    
    this.img = {};
    
    this.img.home = new Image();
    this.img.home.src = "/app/resource/Outside/icon_home.png";
    this.img.home.addEventListener('load', this.onResourceLoaded, false);
    
    this.img.up = new Image();
    this.img.up.src = "/app/resource/Outside/icon_up.png";
    this.img.up.addEventListener('load', this.onResourceLoaded, false);
    
    this.img.down = new Image();
    this.img.down.src = "/app/resource/Outside/icon_down.png";
    this.img.down.addEventListener('load', this.onResourceLoaded, false);
    
    this.img.left = new Image();
    this.img.left.src = "/app/resource/Outside/icon_left.png";
    this.img.left.addEventListener('load', this.onResourceLoaded, false);
    
    this.img.right = new Image();
    this.img.right.src = "/app/resource/Outside/icon_right.png";
    this.img.right.addEventListener('load', this.onResourceLoaded, false);
    
    this.img.power = new Image();
    this.img.power.src = "/app/resource/Outside/icon_power.png";
    this.img.power.addEventListener('load', this.onResourceLoaded, false);
    
    this.img.back = new Image();
    this.img.back.src = "/app/resource/Outside/icon_back.png";
    this.img.back.addEventListener('load', this.onResourceLoaded, false);
    
    this.img.search = new Image();
    this.img.search.src = "/app/resource/Outside/icon_search.png";
    this.img.search.addEventListener('load', this.onResourceLoaded, false);
    
  }
  
  Update() {
    
  }
  
  Render() {
    
    if (this.id === 'Live') {
      
      this.drawRect('rgba(0, 0, 0, 0.5)', {cx: 960, cy: 1050, w: 960, h: 60}, {color: 'rgba(0, 0, 0, 0.1)', blur: 30, x: 0, y: 0});

      this.drawRect('rgba(0, 0, 0, 0.5)', {cx: 960, cy: 30, w: 1260, h: 60}, {color: 'rgba(0, 0, 0, 0.1)', blur: 30, x: 0, y: 0});
      
      this.drawImage(this.img.home, {x: 960, y: 1050, width: 60, height: 60}, null, null);
      this.drawImage(this.img.up, {x: 1890, y: 30, width: 60, height: 60}, null, null);
      this.drawImage(this.img.down, {x: 1890, y: 1050, width: 60, height: 60}, null, null);
      this.drawImage(this.img.left, {x: 540, y: 1050, width: 60, height: 60}, null, null);
      this.drawImage(this.img.right, {x: 1380, y: 1050, width: 60, height: 60}, null, null);
      this.drawImage(this.img.power, {x: 30, y: 30, width: 60, height: 60}, null, null);
      this.drawImage(this.img.back, {x: 30, y: 1050, width: 60, height: 60}, null, null);
      
      this.drawText(
        {title: 'Overview', width: 540, height: 35, font: CONSTANT.TITLE_FONT, fillStyle: 'rgb(238, 238, 238)', textAlign: 'center'},
        {strokeStyle: '#000', lineWidth: 1}, 
        {shadowColor: 'rgba(0, 0, 0, 0.5)', shadowBlur: 5, shadowOffsetX: 0, shadowOffsetY: 3}
      );

      this.drawRect('rgba(238, 238, 238, 0.1)', {cx: 750, cy: 30, w: 1, h: 20});
      
      this.drawText(
        {title: 'Clips / Episodes', width: 960, height: 35, font: CONSTANT.TITLE_FONT, fillStyle: 'rgb(238, 238, 238)', textAlign: 'center'},
        {strokeStyle: '#000', lineWidth: 1}, 
        {shadowColor: 'rgba(0, 0, 0, 0.5)', shadowBlur: 5, shadowOffsetX: 0, shadowOffsetY: 3}
      );

      this.drawRect('rgba(255, 255, 255, 0.1)', {cx: 1170, cy: 30, w: 1, h: 20});
      
      this.drawText(
        {title: 'More like this', width: 1380, height: 35, font: CONSTANT.TITLE_FONT, fillStyle: 'rgb(238, 238, 238)', textAlign: 'center'},
        {strokeStyle: '#000', lineWidth: 1}, 
        {shadowColor: 'rgba(0, 0, 0, 0.5)', shadowBlur: 5, shadowOffsetX: 0, shadowOffsetY: 3}
      );
      
    } else {
      
      this.drawRect('rgba(0, 0, 0, 0.5)', {cx: 960, cy: 1050, w: 960, h: 60}, {color: 'rgba(0, 0, 0, 0.1)', blur: 30, x: 0, y: 0});

      this.drawRect('rgba(0, 0, 0, 0.5)', {cx: 960, cy: 30, w: 420, h: 60}, {color: 'rgba(0, 0, 0, 0.1)', blur: 30, x: 0, y: 0});
      
      this.drawImage(this.img.home, {x: 960, y: 1050, width: 60, height: 60}, null, null);
      this.drawImage(this.img.up, {x: 1890, y: 30, width: 60, height: 60}, null, null);
      this.drawImage(this.img.down, {x: 1890, y: 1050, width: 60, height: 60}, null, null);
      this.drawImage(this.img.left, {x: 540, y: 1050, width: 60, height: 60}, null, null);
      this.drawImage(this.img.right, {x: 1380, y: 1050, width: 60, height: 60}, null, null);
      this.drawImage(this.img.power, {x: 30, y: 30, width: 60, height: 60}, null, null);
      this.drawImage(this.img.back, {x: 30, y: 1050, width: 60, height: 60}, null, null);
      this.drawImage(this.img.search, {x: 960, y: 30, width: 60, height: 60}, null, null);
      
    }
    
  }
  
  onResourceLoaded() {
    
    
  }
  
  drawText(_basic, _stroke, _shadow) {
    
    this.context.save();
    
    if(_stroke !== undefined) {
      
      this.context.strokeStyle = _stroke.strokeStyle;
      this.context.lineWidth = _stroke.lineWidth;
    
    }
    
    if(_shadow !== undefined) {
      
      this.context.shadowColor = _shadow.shadowColor;
      this.context.shadowBlur = _shadow.shadowBlur;
      this.context.shadowOffsetX = _shadow.shadowOffsetX;
      this.context.shadowOffsetY = _shadow.shadowOffsetY;
    
    }
    
    this.context.font = _basic.font;
    this.context.fillStyle = _basic.fillStyle;
    this.context.textAlign = _basic.textAlign;
    
    if(_stroke !== undefined) {
    
      this.context.strokeText(_basic.title, _basic.width, _basic.height);
    
    }
    
    this.context.fillText(_basic.title, _basic.width, _basic.height);
    
    this.context.restore();
    
  }
  
  drawRect(_color, _rect, _shadow) {
    
    this.context.save();
    
    if (_shadow) {
    
      this.context.shadowColor = _shadow.color;
      this.context.shadowBlur = _shadow.blur;
		  this.context.shadowOffsetX = _shadow.x;
		  this.context.shadowOffsetY = _shadow.y;  
      
    }
        
    this.context.fillStyle = _color;
    this.context.fillRect((_rect.cx - Math.round(_rect.w / 2)), (_rect.cy - Math.round(_rect.h / 2)), _rect.w, _rect.h);
    
    this.context.restore();
    
  }
  
  drawImage(_img, _rect, _shadow, _alpha) {
    
    this.context.save();
        
    if (_shadow !== null) {
    
      this.context.shadowColor = _shadow.color;
      this.context.shadowBlur = _shadow.blur;
		  this.context.shadowOffsetX = _shadow.x;
		  this.context.shadowOffsetY = _shadow.y;  
      
    }
    
    if (_alpha !== null) {
      
      this.context.globalAlpha = _alpha;
      
    }
    
    if(_rect.top === undefined) _rect.top = 0;
    if(_rect.left === undefined) _rect.left = 0;
    
		this.context.drawImage(_img, _rect.left, _rect.top, _rect.width, _rect.height, _rect.x - Math.round(_rect.width / 2), _rect.y - Math.round(_rect.height / 2), _rect.width, _rect.height);
    
    this.context.restore();
      
  }
  
}

export default Outside;
