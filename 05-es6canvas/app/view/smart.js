import $ from 'jquery';
import Base from './Base';
import * as Constant from '../Constant';

const CONSTANT = Constant.Smart;

class Smart extends Base {

  constructor(_app) {
    super(_app);
    
  }

  init = () => {

    this.setImage();
    
    this.setValue();
    
    this.reinitialize();

    return Promise.resolve();

  }

  makeBuffer() {
    
    this.imageBuffer = [];
    
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    canvas.width = 1920;
    canvas.height = 1080;
    
    const imageBuffer = context.getImageData(0, 0, 1920, 1080);
    
    for (let i = 0; i <= 20; i++) {
      
      const image = new Image();
      
      if (i === 0) {
        
        this.drawRect({color: '#141414', shape: {cx: 960, cy: 540, w: 1920, h: 1080}}); // BG
      
        // LIST      
        this.drawImage(context, this.img.live, {cx: 330, cy: 550, w: 400, h: 400}, CONSTANT.LIST_SHADOW);
        this.drawImage(context, this.img.vod, {cx: 750, cy: 550, w: 400, h: 400}, CONSTANT.LIST_SHADOW);
        this.drawImage(context, this.img.music, {cx: 1170, cy: 550, w: 400, h: 400}, CONSTANT.LIST_SHADOW);
        this.drawImage(context, this.img.photo, {cx: 1590, cy: 550, w: 400, h: 400}, CONSTANT.LIST_SHADOW);
        this.drawImage(context, this.img.smart, {cx: 2010, cy: 550, w: 400, h: 400}, CONSTANT.LIST_SHADOW);
        this.drawImage(context, this.img.app, {cx: 2430, cy: 550, w: 400, h: 400}, CONSTANT.LIST_SHADOW);
      
        // TEXT    
        this.drawText(
          context,
          {title: CONSTANT.TITLE_TEXT, width: 960, height: 243, font: CONSTANT.TITLE_FONT, fillStyle: 'rgb(238, 238, 238)', textAlign: 'center'},
          {strokeStyle: '#000', lineWidth: 1}, 
          {shadowColor: 'rgba(0, 0, 0, 0.5)', shadowBlur: 5, shadowOffsetX: 0, shadowOffsetY: 3}
        );
        
        image.src = canvas.toDataURL();
        
      } else {
            
        this.drawRect({color: '#141414', shape: {cx: 960, cy: 540, w: 1920, h: 1080}}); // BG
      
        // LIST      
        this.drawImage(context, this.img.live, {cx: 330, cy:550, w: 400, h: 400}, CONSTANT.LIST_SHADOW);
        this.drawImage(context, this.img.vod, {cx: 750, cy:550, w: 400, h: 400}, CONSTANT.LIST_SHADOW);
        this.drawImage(context, this.img.music, {cx: 1170, cy:550, w: 400, h: 400}, CONSTANT.LIST_SHADOW);
        this.drawImage(context, this.img.photo, {cx: 1590, cy:550, w: 400, h: 400}, CONSTANT.LIST_SHADOW);
        this.drawImage(context, this.img.smart, {cx: 2010, cy:550, w: 400, h: 400}, CONSTANT.LIST_SHADOW);
        this.drawImage(context, this.img.app, {cx: 2430, cy:550, w: 400, h: 400}, CONSTANT.LIST_SHADOW);
      
        // TEXT    
        this.drawText(
          context,
          {title: CONSTANT.TITLE_TEXT, width: 960, height: 243, font: CONSTANT.TITLE_FONT, fillStyle: 'rgb(238, 238, 238)', textAlign: 'center'},
          {strokeStyle: '#000', lineWidth: 1}, 
          {shadowColor: 'rgba(0, 0, 0, 0.5)', shadowBlur: 5, shadowOffsetX: 0, shadowOffsetY: 3}
        );
        
        const step1 = i;
        const step2 = i * 5;
            
        StackBlur.canvasRGB(canvas, 800, 150, 300, 150, step1);
        StackBlur.canvasRGB(canvas, 0, 250, 1920, 600, step2);
      
        image.src = canvas.toDataURL();
      
      }
      
      this.imageBuffer.push(image);
      
    }
    
    console.log('Home : 이미지 버퍼 생성 완료');
    
  }
  
  // 이미지 세팅
  setImage() {
    
    this.img = {
    
      thermo: new Image(),
      door: new Image(),
      light: new Image(),
      plug: new Image(),
      cctv: new Image(),
      firestove : new Image()
      
    };
  
    this.img.thermo.src = "/app/resource/Smart/rect_icon_thermo.png";
    this.img.thermo.addEventListener('load', this.onResourceLoaded, false);
    
    this.img.door.src = "/app/resource/Smart/rect_icon_door.png";
    this.img.door.addEventListener('load', this.onResourceLoaded, false);
    
    this.img.light.src = "/app/resource/Smart/rect_icon_light.png";
    this.img.light.addEventListener('load', this.onResourceLoaded, false);
    
    this.img.plug.src = "/app/resource/Smart/rect_icon_plug.png";
    this.img.plug.addEventListener('load', this.onResourceLoaded, false);
    
    this.img.cctv.src = "/app/resource/Smart/rect_icon_cctv.png";
    this.img.cctv.addEventListener('load', this.onResourceLoaded, false);

    this.img.firestove.src = "/app/resource/Smart/icon_firestove.png";
    this.img.firestove.addEventListener('load', this.onResourceLoaded, false);
    
  }

  // 필요한 값들 세팅
  setValue() {
    
    this.index = 0;
    this.menu_left = 0;
    this.menu_top = 0;
    this.dragX = 0;      
        
  }
  
  reinitialize() {
    
    $('#debug').empty().hide();
    
    this.index = 0;
    this.menu_left = 0;
    this.menu_top = 0;
    
  }
  
  right(_dis) {
          
    if (this.interval !== null) clearInterval(this.interval);
              
    if (this.index === CONSTANT.MAX_INDEX) {
      
      this.interval = setInterval(() => {
        
        if (this.menu_left > (CONSTANT.MAX_INDEX * -420) - 30) this.menu_left = this.menu_left - 10;
        else {
            
          if (this.interval !== null) clearInterval(this.interval);
          
          this.menu_left = (CONSTANT.MAX_INDEX * -420) - 30;
            
          this.interval = setInterval(() => {
        
            if (this.menu_left < (CONSTANT.MAX_INDEX * -420)) {
            
              this.menu_left = this.menu_left + 3;
          
            } else {
            
              if (this.interval !== null) clearInterval(this.interval);
           
             this.menu_left = (CONSTANT.MAX_INDEX * -420);
           
            }
          
          }, 17);
    
        }
          
      }, 10);
        
    } else {
         
      const dis = (this.index + _dis > 2) ? 2 : this.index + _dis;
      const distance = Math.round(this.menu_left - (-420 * dis));
             
      const store = this.menu_left;
             
      this.interval_count = 0;
                  
      this.interval = setInterval(() => {
        
        this.interval_count++;
        const x = Math.round(this.easing(this.interval_count, 0, distance, 30));

        if (this.interval_count < 30) this.menu_left = store - x;
        else {
            
          if (this.interval !== null) clearInterval(this.interval);
          this.index = dis;
          this.menu_left = -420 * this.index;
    
        }
          
      }, 10);
      
    }

  }
  
  left(_dis) {
          
    if (this.interval !== null) clearInterval(this.interval);
        
    if (this.index === 0) {
      
      this.interval = setInterval(() => {
        
        if (this.menu_left < 30) this.menu_left = this.menu_left + 10;
        else {
            
          if (this.interval !== null) clearInterval(this.interval);
          
          this.menu_left = 30;
            
          this.interval = setInterval(() => {
        
            if (this.menu_left > 0) {
            
              this.menu_left = this.menu_left - 3;
          
            } else {
            
              if (this.interval !== null) clearInterval(this.interval);
              
              this.menu_left = 0;
           
            }
          
          }, 17);
    
        }
          
      }, 10);
        
    } else {
       
      this.interval_count = 0;
      
      const dis = (this.index + _dis < 0) ? 0 : this.index + _dis;
      const distance = (-420 * dis) - this.menu_left;
                     
      const store = this.menu_left;
      
      this.interval = setInterval(() => {
        
        this.interval_count++;
        const x = Math.round(this.easing(this.interval_count, 0, distance, 30));
        
        if (this.interval_count < 30) this.menu_left = store + x;
        else {
            
          if (this.interval !== null) clearInterval(this.interval);
          this.index = dis;
          this.menu_left = -420 * this.index;
    
        }
          
      }, 10);   
        
    }         

  }
  
  up() {
          
    if (this.interval !== null) clearInterval(this.interval);
                
    this.interval = setInterval(() => {
        
      if (this.menu_top < 30) this.menu_top = this.menu_top + 10;
      else {
            
        if (this.interval !== null) clearInterval(this.interval);
            
        this.menu_top = 30;
        
        this.interval = setInterval(() => {
        
          if (this.menu_top > 0) this.menu_top = this.menu_top - 3;
          else {
            
            if (this.interval !== null) clearInterval(this.interval);
           
            this.menu_top = 0;
           
          }
          
        }, 17);
    
      }
          
    }, 10);       

  }
  
  down() {
          
    if (this.interval !== null) clearInterval(this.interval);
                
    this.interval = setInterval(() => {
        
      if (this.menu_top > -30) this.menu_top = this.menu_top - 10;
      else {
            
        if (this.interval !== null) clearInterval(this.interval);
            
        this.menu_top = -30;
            
        this.interval = setInterval(() => {
        
          if (this.menu_top < 0) this.menu_top = this.menu_top + 3;
          else {
            
            if (this.interval !== null) clearInterval(this.interval);
           
            this.menu_top = 0;
           
          }
          
        }, 17);
    
      }
          
    }, 10);       

  }
  
  home() {
          
    this.app.changeView('Home');
        
  }
  
  back() {
          
    this.app.changeView('Home');
        
  }
  
  endDrag() {
    
    if (this.interval !== null) clearInterval(this.interval);

    let dist = Math.round(this.menu_left / -420);
    
    if (dist < 0) dist = 0;
    if (dist > CONSTANT.MAX_INDEX) dist = CONSTANT.MAX_INDEX;

    const direction = this.menu_left > (dist * -420) ? 1 : -1;
    
    if (dist === 0) {
      
      let movePlus = 0;
      
      if (this.menu_left / -420 < 0) {
        
        movePlus = 0;
        
        const how = Math.round((this.menu_left - ((dist * -420) - movePlus)) / 10);
      
        this.interval = setInterval(() => {
          
          if (this.menu_left > (dist * -420) - movePlus) this.menu_left = this.menu_left - how;
          else {
          
            if (this.interval !== null) clearInterval(this.interval);
            
            this.interval = setInterval(() => {
          
              if (this.menu_left > 0) {
              
                this.menu_left = this.menu_left + 3;
            
              } else {
              
                if (this.interval !== null) clearInterval(this.interval);
                  
                this.index = dist;
                this.menu_left = this.index * -420;
            
              }
            
            }, 17, false);
              
          }
          
        }, 2, false); 
        
      } else if (this.menu_left / -420 < -1) {
        
        movePlus = 10;
        
        const how = Math.round((this.menu_left - ((dist * -420) - movePlus)) / 10);
      
        this.interval = setInterval(() => {
          
          if (this.menu_left > (dist * -420) - movePlus) this.menu_left = this.menu_left - how;
          else {
          
            if (this.interval !== null) clearInterval(this.interval);
            
            this.interval = setInterval(() => {
          
              if (this.menu_left > 0) {
              
                this.menu_left = this.menu_left + 3;
            
              } else {
              
                if (this.interval !== null) clearInterval(this.interval);
                  
                this.index = dist;
                this.menu_left = this.index * -420;
            
              }
            
            }, 17, false);
              
          }
          
        }, 2, false); 
        
      } else if (Math.round(this.menu_left / -420) < -2) {
        
        movePlus = 20;
        
        const how = Math.round((this.menu_left - ((dist * -420) - movePlus)) / 10);
      
        this.interval = setInterval(() => {
          
          if (this.menu_left > (dist * -420) - movePlus) this.menu_left = this.menu_left - how;
          else {
          
            if (this.interval !== null) clearInterval(this.interval);
            
            this.interval = setInterval(() => {
          
              if (this.menu_left > 0) {
              
                this.menu_left = this.menu_left + 3;
            
              } else {
              
                if (this.interval !== null) clearInterval(this.interval);
                  
                this.index = dist;
                this.menu_left = this.index * -420;
            
              }
            
            }, 17, false);
              
          }
          
        }, 2, false); 
        
      } else if (Math.round(this.menu_left / -420) < -3) {
        
        movePlus = 30;
        
        const how = Math.round((this.menu_left - ((dist * -420) - movePlus)) / 10);
      
        this.interval = setInterval(() => {
          
          if (this.menu_left > (dist * -420) - movePlus) this.menu_left = this.menu_left - how;
          else {
          
            if (this.interval !== null) clearInterval(this.interval);
            
            this.interval = setInterval(() => {
          
              if (this.menu_left > 0) {
              
                this.menu_left = this.menu_left + 3;
            
              } else {
              
                if (this.interval !== null) clearInterval(this.interval);
                  
                this.index = dist;
                this.menu_left = this.index * -420;
            
              }
            
            }, 17, false);
              
          }
          
        }, 2, false); 
        
      } else {
        
        this.interval_count = 0;
        const distance = (-420 * dist) - this.menu_left;
      
        this.interval = setInterval(() => {
        
          this.interval_count++;
          const x = Math.round(this.easing(this.interval_count, 0, distance, 30));
          
          if (this.menu_left < -420 * dist) this.menu_left = this.menu_left + x;
          else {
         
            if (this.interval !== null) clearInterval(this.interval);
          
            this.index = dist;
            this.menu_left = -420 * this.index;
             
          }
        
        }, 10, false); 
        
      }
      
    } else if (dist === CONSTANT.MAX_INDEX) {
      
      let movePlus = 0;
      
      if (this.menu_left / -420 > CONSTANT.MAX_INDEX + 0) {
        
        movePlus = 0;
        
        const how = Math.round((((dist * -420) + movePlus) - this.menu_left) / 10);
      
        this.interval = setInterval(() => {
          
          if (this.menu_left < (dist * -420) + movePlus) this.menu_left = this.menu_left + how;
          else {
          
            if (this.interval !== null) clearInterval(this.interval);
            
            this.interval = setInterval(() => {
          
              if (this.menu_left > (dist * -420)) {
              
                this.menu_left = this.menu_left - 3;
            
              } else {
              
                if (this.interval !== null) clearInterval(this.interval);
                  
                this.index = dist;
                this.menu_left = this.index * -420;
            
              }
            
            }, 17, false);
              
          }
          
        }, 2, false); 
        
      } else if (this.menu_left / -420 > CONSTANT.MAX_INDEX + 1) {
        
        movePlus = 10;
        
        const how = Math.round((((dist * -420) + movePlus) - this.menu_left) / 10);
      
        this.interval = setInterval(() => {
          
          if (this.menu_left < (dist * -420) + movePlus) this.menu_left = this.menu_left + how;
          else {
          
            if (this.interval !== null) clearInterval(this.interval);
            
            this.interval = setInterval(() => {
          
              if (this.menu_left > (dist * -420)) {
              
                this.menu_left = this.menu_left - 3;
            
              } else {
              
                if (this.interval !== null) clearInterval(this.interval);
                  
                this.index = dist;
                this.menu_left = this.index * -420;
            
              }
            
            }, 17, false);
              
          }
          
        }, 2, false); 
        
      } else if (Math.round(this.menu_left / -420) > CONSTANT.MAX_INDEX + 2) {
        
        movePlus = 20;
        
        const how = Math.round((((dist * -420) + movePlus) - this.menu_left) / 10);
      
        this.interval = setInterval(() => {
          
          if (this.menu_left < (dist * -420) + movePlus) this.menu_left = this.menu_left + how;
          else {
          
            if (this.interval !== null) clearInterval(this.interval);
            
            this.interval = setInterval(() => {
          
              if (this.menu_left > (dist * -420)) {
              
                this.menu_left = this.menu_left - 3;
            
              } else {
              
                if (this.interval !== null) clearInterval(this.interval);
                  
                this.index = dist;
                this.menu_left = this.index * -420;
            
              }
            
            }, 17, false);
              
          }
          
        }, 2, false); 
        
      } else if (Math.round(this.menu_left / -420) > CONSTANT.MAX_INDEX + 3) {
        
        movePlus = 30;
        
        const how = Math.round((((dist * -420) + movePlus) - this.menu_left) / 10);
      
        this.interval = setInterval(() => {
          
          if (this.menu_left < (dist * -420) + movePlus) this.menu_left = this.menu_left + how;
          else {
          
            if (this.interval !== null) clearInterval(this.interval);
            
            this.interval = setInterval(() => {
          
              if (this.menu_left > (dist * -420)) {
              
                this.menu_left = this.menu_left - 3;
            
              } else {
              
                if (this.interval !== null) clearInterval(this.interval);
                  
                this.index = dist;
                this.menu_left = this.index * -420;
            
              }
            
            }, 17, false);
              
          }
          
        }, 2, false); 
        
      } else {
        
        this.interval_count = 0;
        const distance = this.menu_left - (-420 * dist);
      
        this.interval = setInterval(() => {
        
          this.interval_count++;
          const x = Math.round(this.easing(this.interval_count, 0, distance, 30));
          
          if (this.menu_left > (-420 * dist)) this.menu_left = this.menu_left - x;
          else {
         
            if (this.interval !== null) clearInterval(this.interval);
          
            this.index = dist;
            this.menu_left = -420 * this.index;
             
          }
        
        }, 10, false);
        
      }
      
    } else {
        
      if (direction > 0) {
      
        this.interval_count = 0;
        const distance = this.menu_left - (-420 * dist);
      
        this.interval = setInterval(() => {
        
          this.interval_count++;
          const x = Math.round(this.easing(this.interval_count, 0, distance, 30));
          
          if (this.menu_left > (-420 * dist)) this.menu_left = this.menu_left - x;
          else {
         
            if (this.interval !== null) clearInterval(this.interval);
          
            this.index = dist;
            this.menu_left = -420 * this.index;
             
          }
        
        }, 10, false);
      
      } else {
      
        this.interval_count = 0;
        const distance = (-420 * dist) - this.menu_left;
      
        this.interval = setInterval(() => {
        
          this.interval_count++;
          const x = Math.round(this.easing(this.interval_count, 0, distance, 30));
          
          if (this.menu_left < -420 * dist) this.menu_left = this.menu_left + x;
          else {
         
            if (this.interval !== null) clearInterval(this.interval);
          
            this.index = dist;
            this.menu_left = -420 * this.index;
             
          }
        
        }, 10, false); 
      
      }
    
    }
    
  }
  
  Update() {
    
    
  }
  
  Render() {
    
    this.drawRect({color: '#141414', shape: {cx: 960, cy: 540, w: 1920, h: 1080}}); // BG
    
    // LIST      
    this.drawImage(this.context, this.img.thermo, {cx: (330 + this.menu_left), cy: (550 + this.menu_top), w: 400, h: 400}, CONSTANT.LIST_SHADOW);
    this.drawImage(this.context, this.img.door, {cx: (750 + this.menu_left), cy: (550 + this.menu_top), w: 400, h: 400}, CONSTANT.LIST_SHADOW);
    this.drawImage(this.context, this.img.light, {cx: (1170 + this.menu_left), cy: (550 + this.menu_top), w: 400, h: 400}, CONSTANT.LIST_SHADOW);
    this.drawImage(this.context, this.img.plug, {cx: (1590 + this.menu_left), cy: (550 + this.menu_top), w: 400, h: 400}, CONSTANT.LIST_SHADOW);
    this.drawImage(this.context, this.img.cctv, {cx: (2010 + this.menu_left), cy: (550 + this.menu_top), w: 400, h: 400}, CONSTANT.LIST_SHADOW);
    this.drawImage(this.context, this.img.firestove, {cx: (2430 + this.menu_left), cy: (550 + this.menu_top), w: 400, h: 400}, CONSTANT.LIST_SHADOW);

    // TEXT    
    this.drawText(this.context, {title: 'Thermostat', width: (330 + this.menu_left), height: (675 + this.menu_top), font: CONSTANT.TITLE_FONT, fillStyle: 'rgb(238, 238, 238)', textAlign: 'center'});
    this.drawText(this.context, {title: 'Smart Lock', width: (750 + this.menu_left), height: (675 + this.menu_top), font: CONSTANT.TITLE_FONT, fillStyle: 'rgb(238, 238, 238)', textAlign: 'center'});
    this.drawText(this.context, {title: 'Light Control', width: (1170 + this.menu_left), height: (675 + this.menu_top), font: CONSTANT.TITLE_FONT, fillStyle: 'rgb(238, 238, 238)', textAlign: 'center'});
    this.drawText(this.context, {title: 'Device Control', width: (1590 + this.menu_left), height: (675 + this.menu_top), font: CONSTANT.TITLE_FONT, fillStyle: 'rgb(238, 238, 238)', textAlign: 'center'});
    this.drawText(this.context, {title: 'CCTV', width: (2010 + this.menu_left), height: (675 + this.menu_top), font: CONSTANT.TITLE_FONT, fillStyle: 'rgb(238, 238, 238)', textAlign: 'center'});
    this.drawText(this.context, {title: 'FireStove', width: (2430 + this.menu_left), height: (675 + this.menu_top), font: CONSTANT.TITLE_FONT, fillStyle: 'rgb(238, 238, 238)', textAlign: 'center'});

    // TEXT    
    this.drawText(
      this.context,
      {title: CONSTANT.TITLE_TEXT, width: 960, height: 243, font: CONSTANT.TITLE_FONT, fillStyle: 'rgb(238, 238, 238)', textAlign: 'center'},
      {strokeStyle: '#000', lineWidth: 1}, 
      {shadowColor: 'rgba(0, 0, 0, 0.5)', shadowBlur: 5, shadowOffsetX: 0, shadowOffsetY: 3}
    );
    
    this.outside.Render();
    this.effect.Render();
    this.effectLock.Render();
    
  }
  
  trigger(_eventName, _id, _hit) {
        
    if (_eventName === '[매니저] 언락유저의 우선권이 생김') {
      
      if (_id === 'TL') this.effect.selectEffect(30, 30);  
      else if (_id === 'BL') this.effect.selectEffect(30, 1050); 
      else if (_id === 'L') this.effect.selectEffect(540, 1050, {func: () => {this.left(-1);}, acc: true}); 
      else if (_id === 'R') this.effect.selectEffect(1380, 1050, {func: () => {this.right(1);}, acc: true});  
      else if (_id === 'TR') this.effect.selectEffect(1890, 30); 
      else if (_id === 'BR') this.effect.selectEffect(1890, 1050); 
      else if (_id === 'B') this.effect.selectEffect(960, 1050); 
      else if (_id === 'T') this.effect.selectEffect(960, 30); 
      else if (_id === 'DISPLAY') {
                  
        const x = _hit.point.x * 1920;
        const y = _hit.point.y * 1080;
          
        if (x > 120 && x < 540 && y > 240 && y < 840) this.effect.selectEffect(330, 550); 
        else if (x > 540 && x < 960 && y > 240 && y < 840) this.effect.selectEffect(750, 550);           
        else if (x > 960 && x < 1380 && y > 240 && y < 840) this.effect.selectEffect(1170, 550);           
        else if (x > 1380 && x < 1800 && y > 240 && y < 840) this.effect.selectEffect(1590, 550); 
          
        this.drag = x;
        this.drags = [];
        this.drags.push(x);
        
      }
      
    } else if (_eventName === '[매니저] 언락유저의 우선권이 사라짐 : 영역에서 나감') {
      
      if (this.isDrag) {
        
        if (this.isDrag) {
          
          this.endDrag();
          this.dragX = 0;
          this.isDrag = false;
          this.isSwipe = false; 
          
        }
        
      } else {
      
        this.effect.cancelEffect();
        
        this.dragX = 0;
        this.isDrag = false;
        this.isSwipe = false; 
        
      }
       
    } else if (_eventName === '[매니저] 언락유저의 우선권이 사라짐 : 취소') {
       
      if (this.isDrag) {
        
        if (this.isDrag) {
          
          this.endDrag();
          this.dragX = 0;
          this.isDrag = false;
          this.isSwipe = false; 
          
        }
        
      } else {
      
        this.effect.cancelEffect();
        
        this.dragX = 0;
        this.isDrag = false;
        this.isSwipe = false; 
        
      }
      
    } else if (_eventName === '[매니저] 언락유저의 우선권이 사라짐 : 컴펌 성공') {
      
      if (_id === 'R') {
        
        if (!this.isDrag) this.effect.confirmEffect();
        this.right(1);
        
      } else if (_id === 'L') {
        
        if (!this.isDrag) this.effect.confirmEffect();
        this.left(-1);
      
      } else if (_id === 'TR') {
        
        if (!this.isDrag) this.effect.confirmEffect();
        this.up();
      
      } else if (_id === 'BR') {
        
        if (!this.isDrag) this.effect.confirmEffect();
        this.down();
        
      } else if (_id === 'B') {
        
        if (!this.isDrag) this.effect.confirmEffect();
        this.home();
      
      } else if (_id === 'BL') {
        
        if (!this.isDrag) this.effect.confirmEffect();
        this.back();
        
      } else if (_id === 'TL') {
        
        if (!this.isDrag) this.effect.confirmEffect();
        this.power();
        
      } else if (_id === 'T') {
        
        if (!this.isDrag) this.effect.confirmEffect();
        this.search();
      
      } else if (_id === 'DISPLAY') {
        
        if (_hit.id === 'DISPLAY') {
        
          const x = _hit.point.x * 1920;
          const y = _hit.point.y * 1080;
        
          if (this.isDrag) {
         
            this.endDrag();
            this.dragX = 0;
            this.isDrag = false;
            this.isSwipe = false; 
          
          } else {
          
            if (x > 120 && x < 540 && y > 240 && y < 840) {
            
              this.effect.confirmEffect();
              
              if (this.index === 0) this.app.changeView('Thermo');
              else if (this.index === 1) this.app.changeView('Door');
              else if (this.index === 2) this.app.changeView('Light');
          
            } else if (x > 540 && x < 960 && y > 240 && y < 840) {
            
              this.effect.confirmEffect();
              
              if (this.index === 0) this.app.changeView('Door');
              else if (this.index === 1) this.app.changeView('Light');
              else if (this.index === 2) this.app.changeView('Plug');

            } else if (x > 960 && x < 1380 && y > 240 && y < 840) {
              
              this.effect.confirmEffect();
              
              if (this.index === 0) this.app.changeView('Light');
              else if (this.index === 1) this.app.changeView('Plug');
              else if (this.index === 2) this.app.changeView('Cctv');

            } else if (x > 1380 && x < 1800 && y > 240 && y < 840) {
              
              this.effect.confirmEffect();
              
              if (this.index === 0) this.app.changeView('Plug');
              else if (this.index === 1) this.app.changeView('Cctv');
              else if (this.index === 2) this.app.changeView('FireStove');

            }
          
          }
          
        }
        
      }            
      
      this.dragX = 0;
      this.isDrag = false;
      
    } else if (_eventName === '[매니저] 언락유저의 우선권이 있는 상태에서 한번 더 셀렉트') {
      
      
    } else if (_eventName === '[매니저] 언락유저의 우선권이 있는 상태에서 스와이프') {
      
      if (this.isDrag) {
          
        if (_hit.point.x > 0.5) { // 우측 스와이프
            
          let speed = 0;
              
          if (this.drags.length > 1) {
                
            speed = this.drags[this.drags.length - 1] - this.drags[this.drags.length - 2];   
            console.log('2 : ' + speed);
                
          } else if (this.drags.length === 1) {
                
            speed = 1920 - this.drags[this.drags.length - 1];
            console.log('1 : ' + speed);
                
          } else if (this.drags.length === 0) {
                
            console.log('0 : ' + speed);
              
          }  
              
          if (speed > 150) {
                
            this.left(-12);
                
          } else if (speed > 50) {
               
            this.left(-8); 
                
          } else {
                
            this.left(-4);
              
          }
                
        } else { // 좌측 스와이프
               
          let speed = 0;
              
          if (this.drags.length > 1) {
                
            speed = this.drags[this.drags.length - 1] - this.drags[this.drags.length - 2];   
            console.log('2 : ' + speed);
                
          } else if (this.drags.length === 1) {
                
            speed = 1920 - this.drags[this.drags.length - 1];
            console.log('1 : ' + speed);
                
          } else if (this.drags.length === 0) {
                
            console.log('0 : ' + speed);
              
          }  
              
          if (speed < -150) {
                
            this.right(12);
                
          } else if (speed < -50) {
                
            this.right(8);
                
          } else {
                
            this.right(4);
            
          } 
                
        }
                                    
        this.dragX = 0;
        this.isDrag = false;
        this.isSwipe = false;
        
      } else {
      
        this.effect.cancelEffect();
        
        this.dragX = 0;
        this.isDrag = false;
        this.isSwipe = false; 
        
      }
      
    } else if (_eventName === '[매니저] 언락유저의 우선권이 있는 상태에서 그대로') {
      
      if (_id === 'DISPLAY') {
        
        if (_hit.id === 'DISPLAY') {
          
          const x = _hit.point.x * 1920;
          
          if (this.isDrag) {
            
            // 리스크 이동
            if (this.drags.length > CONSTANT.DRAG_AVG_LENGTH - 1) {
              
              this.drags.shift();
              
            }
            
            this.drags.push(x);
             
            this.dragX = this.getDrag() - this.drag; 
            this.menu_left = (this.index * -420) + this.dragX;
              
            if (this.menu_left > 0) this.menu_left = Math.round(((this.index * -420) + this.dragX) / 5);
            if (this.menu_left < (CONSTANT.MAX_INDEX * -420)) this.menu_left = (CONSTANT.MAX_INDEX * -420) + Math.round(((this.index * -420) + this.dragX - (CONSTANT.MAX_INDEX * -420)) / 5);
          
          } else {
                          
            if (Math.abs(this.drag - x) > CONSTANT.DRAG_START_DISTANCE) {
            
              this.isDrag = true;
              this.effect.dragEffect();
            
            }
            
            if (this.isDrag) {
            
              // 리스크 이동
              if (this.drags.length > CONSTANT.DRAG_AVG_LENGTH - 1) {
              
                this.drags.shift();
              
              }
            
              this.drags.push(x);
            
              this.dragX = this.getDrag() - this.drag;
              this.menu_left = (this.index * -420) + this.dragX;

            }
            
          }
        
        }
        
      }
     
    }
    
  }
  
}

export default Smart;
