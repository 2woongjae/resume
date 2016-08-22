import $ from 'jquery';
import StackBlur from 'stackblur-canvas';
import Base from './Base';
import * as Constant from '../Constant';

const CONSTANT = Constant.Home;

class Home extends Base {
  
  constructor(_app) {
    super(_app);

  }

  init = () => {

    return Promise.resolve()
                  .then(this.setMembers)      // 멤버 변수 설정
                  .then(this.loadImages)      // 이미지 로딩
                  .then(this.makeBuffer)      // 버퍼이미지 저장
                  .then(this.reinit);         // 재초기화

  }

  setMembers = () => {

    this.index = 0;
    this.bg_alpha = 1.0;
    this.icon_alpha = 0;
    this.btn_alpha = 0;
    this.blurStep = 20;
    this.menu_left = 0;
    this.menu_top = 0;
    this.isSwipe = false;
    
    this.interval_count = 0;  
    this.interval = null;
    this.isReady = true;

    return Promise.resolve();

  }

  loadImages = () => {
    
    return Promise.all([
      this.addImageResource('live', '/app/resource/Home/app_live.png'),
      this.addImageResource('vod', '/app/resource/Home/app_vod.png'),
      this.addImageResource('music', '/app/resource/Home/app_music.png'),
      this.addImageResource('photo', '/app/resource/Home/app_photo.png'),
      this.addImageResource('smart', '/app/resource/Home/app_smart.png'),
      this.addImageResource('app', '/app/resource/Home/app_app.png'),
      this.addImageResource('btn_home', '/app/resource/Outside/icon_home.png'),
      this.addImageResource('unlock', '/app/resource/Home/icon_unlock.png')
    ]);

  }

  onResourceLoaded = params => {
    
    this.imageCount++;
    
    if (this.imageCount > 7) this.makeBuffer();
    
  }
  
  makeBuffer = () => {
    
    this.imageBuffer = [];
    
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    canvas.width = 1920;
    canvas.height = 1080;
    
    const imageBuffer = context.getImageData(0, 0, 1920, 1080);
    
    for (let i = 0; i <= 20; i++) {
      
      const image = new Image();
      
      if (i === 0) {
        
        this.drawRect({context: context, color: '#141414', shape: {cx: 960, cy: 540, w: 1920, h: 1080}}); // BG
      
        this.drawImage(context, this.img.live, {cx: 330, cy: 550, w: 400, h: 400}, CONSTANT.LIST_SHADOW);
        this.drawImage(context, this.img.vod, {cx: 750, cy: 550, w: 400, h: 400}, CONSTANT.LIST_SHADOW);
        this.drawImage(context, this.img.music, {cx: 1170, cy: 550, w: 400, h: 400}, CONSTANT.LIST_SHADOW);
        this.drawImage(context, this.img.photo, {cx: 1590, cy: 550, w: 400, h: 400}, CONSTANT.LIST_SHADOW);
        this.drawImage(context, this.img.smart, {cx: 2010, cy: 550, w: 400, h: 400}, CONSTANT.LIST_SHADOW);
        this.drawImage(context, this.img.app, {cx: 2430, cy: 550, w: 400, h: 400}, CONSTANT.LIST_SHADOW);
      
        this.drawText(
          context,
          {title: CONSTANT.TITLE_TEXT, width: 960, height: 243, font: CONSTANT.TITLE_FONT, fillStyle: 'rgb(238, 238, 238)', textAlign: 'center'},
          {strokeStyle: '#000', lineWidth: 1}, 
          {shadowColor: 'rgba(0, 0, 0, 0.5)', shadowBlur: 5, shadowOffsetX: 0, shadowOffsetY: 3}
        );
        
        image.src = canvas.toDataURL();
        
      } else {
            
        this.drawRect({context: context, color: '#141414', shape: {cx: 960, cy: 540, w: 1920, h: 1080}}); // BG
      
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
    
    return Promise.resolve();
    
  }
  
  reinitialize = () => {
    
    $('#debug').empty().hide();

    return Promise.resolve();
    
  }
  
  /*
    <노유저 초기락 상태>인 블랙(#141414)에서 유저가 등장하여,
    언락이 가능한 <유저 초기락 상태>로 변경되는 트리거
  */
  appearUser() {
        
      if (this.interval !== null) clearInterval(this.interval);
           
      this.interval = setInterval(() => {
        
        if (this.bg_alpha > 0.9) this.bg_alpha = Math.round((this.bg_alpha - 0.01) * 100) / 100;
        else this.bg_alpha = 0.9;
        
        if (this.icon_alpha < 0.1) this.icon_alpha = Math.round((this.icon_alpha + 0.01) * 100) / 100;
        else this.icon_alpha = 0.1;
        
        if (this.btn_alpha < 1) this.btn_alpha = Math.round((this.btn_alpha + 0.1) * 10) / 10;  
        else this.btn_alpha = 1;
                     
        if (this.bg_alpha === 0.9 && this.icon_alpha === 0.1 && this.btn_alpha === 1) {
          
          if (this.interval !== null) clearInterval(this.interval);
            
        }
        
      }, 50, false);
          
  }
  
  /*
    <유저 초기락 상태>에서 유저가 언락을 하지 않고 화각에 있다가,
    화각 밖으로 사라져 다시 <노유저 초기락 상태>로 변경되는 트리거
  */
  disappearUser() {
    
    if (this.interval !== null) clearInterval(this.interval);
    
    if (this.index === 0) {
      
      this.interval = setInterval(() => {
        
        if (this.blurStep < 20) this.blurStep = this.blurStep + 1;
        else this.blurStep = 20;
        
        if (this.bg_alpha < 0.9) this.bg_alpha = Math.round((this.bg_alpha + 0.1) * 10) / 10;
        else this.bg_alpha = 0.9;
        
        if (this.icon_alpha < 0.1) this.icon_alpha = Math.round((this.icon_alpha + 0.01) * 100) / 100;
        else this.icon_alpha = 0.1;
        
        if (this.btn_alpha < 1) this.btn_alpha = Math.round((this.btn_alpha + 0.1) * 10) / 10;
        else this.btn_alpha = 1;
                
        if (this.blurStep === 20 && this.bg_alpha === 0.9 && this.icon_alpha === 0.1 && this.btn_alpha === 1) {
          
          if (this.interval !== null) clearInterval(this.interval);
          
          this.interval = setInterval(() => {
            
            if (this.bg_alpha < 1) this.bg_alpha = Math.round((this.bg_alpha + 0.01) * 100) / 100;
            else this.bg_alpha = 1;
            
            if (this.icon_alpha > 0) this.icon_alpha = Math.round((this.icon_alpha - 0.01) * 100) / 100;
            else this.icon_alpha = 0;
            
            if (this.btn_alpha < 0) this.btn_alpha = Math.round((this.btn_alpha - 0.1) * 10) / 10;  
            else this.btn_alpha = 0;
              
            if (this.bg_alpha === 1 && this.icon_alpha === 0 && this.btn_alpha === 0) {
          
              if (this.interval !== null) clearInterval(this.interval);
            
            }
            
          }, 50);
            
        }
          
      }, 50, false);
        
    } else {
       
      this.interval_count = 0;
      
      const dis = 0;
      const distance = (-420 * dis) - this.menu_left;
                     
      this.interval = setInterval(() => {
        
        this.interval_count++;
        const x = Math.round(this.easing(this.interval_count, 0, distance, 30));
        
        if (this.menu_left < (-420 * dis)) this.menu_left = (-420 * this.index) + x;
        else {
            
          if (this.interval !== null) clearInterval(this.interval);
          this.index = dis;
          this.menu_left = -420 * this.index;
          
          this.interval = setInterval(() => {
        
            if (this.blurStep < 20) this.blurStep = this.blurStep + 1;
            else this.blurStep = 20;
            
            if (this.bg_alpha < 0.9) this.bg_alpha = Math.round((this.bg_alpha + 0.1) * 10) / 10;
            else this.bg_alpha = 0.9;
            
            if (this.icon_alpha < 0.1) this.icon_alpha = Math.round((this.icon_alpha + 0.01) * 100) / 100;
            else this.icon_alpha = 0.1;
            
            if (this.btn_alpha < 1) this.btn_alpha = Math.round((this.btn_alpha + 0.1) * 10) / 10;
            else this.btn_alpha = 1;
                    
            if (this.blurStep === 20 && this.bg_alpha === 0.9 && this.icon_alpha === 0.1 && this.btn_alpha === 1) {
              
              if (this.interval !== null) clearInterval(this.interval);
              
              this.interval = setInterval(() => {
                
                if (this.bg_alpha < 1) this.bg_alpha = Math.round((this.bg_alpha + 0.01) * 100) / 100;
                else this.bg_alpha = 1;
                
                if (this.icon_alpha > 0) this.icon_alpha = Math.round((this.icon_alpha - 0.01) * 100) / 100;
                else this.icon_alpha = 0;
                
                if (this.btn_alpha < 0) this.btn_alpha = Math.round((this.btn_alpha - 0.1) * 10) / 10;  
                else this.btn_alpha = 0;
                  
                if (this.bg_alpha === 1 && this.icon_alpha === 0 && this.btn_alpha === 0) {
              
                  if (this.interval !== null) clearInterval(this.interval);
                
                }
                
              }, 50);
                
            }
              
          }, 50, false);
    
        }
          
      }, 10);
      
    }
    
  }
  
  showLock() {
    
    if (this.interval !== null) clearInterval(this.interval);

    this.interval = setInterval(() => {
        
      if (this.blurStep < 20) this.blurStep = this.blurStep + 1;
      else this.blurStep = 20;
      
      if (this.bg_alpha < 0.9) this.bg_alpha = Math.round((this.bg_alpha + 0.1) * 10) / 10;
      else this.bg_alpha = 0.9;
      
      if (this.icon_alpha < 0.1) this.icon_alpha = Math.round((this.icon_alpha + 0.01) * 100) / 100 
      else this.icon_alpha = 0.1;
      
      if (this.btn_alpha < 1) this.btn_alpha = Math.round((this.btn_alpha + 0.1) * 10) / 10;
      else this.btn_alpha = 1;
            
      if (this.blurStep === 20 && this.bg_alpha === 0.9 && this.icon_alpha === 0.1 && this.btn_alpha === 1) {
         
        if (this.interval !== null) clearInterval(this.interval);
        
      }
        
    }, 20, false);
      
  }
  
  hideLock() {
    
    if (this.interval !== null) clearInterval(this.interval);
      
    this.interval = setInterval(() => {
        
      if (this.blurStep > 0) this.blurStep = this.blurStep - 1;
      else this.blurStep = 0;

      if (this.bg_alpha > 0) this.bg_alpha = Math.round((this.bg_alpha - 0.1) * 10) / 10; 
      else this.bg_alpha = 0;

      if (this.icon_alpha > 0) this.icon_alpha = Math.round((this.icon_alpha - 0.01) * 100) / 100;
      else this.icon_alpha = 0;

      if (this.btn_alpha > 0) this.btn_alpha = Math.round((this.btn_alpha - 0.1) * 10) / 10;
      else this.btn_alpha = 0;
        
      if (this.blurStep === 0 && this.bg_alpha === 0 && this.icon_alpha === 0 && this.btn_alpha === 0) {
         
        if (this.interval !== null) clearInterval(this.interval);
              
      }
        
    }, 20, false);

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
          
    this.left(-5);
        
  }
  
  back() {
          
    this.left(-5);       
        
  }
  
  power() {
    
    if (this.interval !== null) clearInterval(this.interval);
        
    if (this.index === 0) {
      
      this.interval = setInterval(() => {
        
        if (this.blurStep < 20) this.blurStep = this.blurStep + 1;
        else this.blurStep = 20;
      
        if (this.bg_alpha < 0.9) this.bg_alpha = Math.round((this.bg_alpha + 0.1) * 10) / 10;
        else this.bg_alpha = 0.9;
      
        if (this.icon_alpha < 0.1) this.icon_alpha = Math.round((this.icon_alpha + 0.01) * 100) / 100 
        else this.icon_alpha = 0.1;
      
        if (this.btn_alpha < 1) this.btn_alpha = Math.round((this.btn_alpha + 0.1) * 10) / 10;
        else this.btn_alpha = 1;
            
        if (this.blurStep === 20 && this.bg_alpha === 0.9 && this.icon_alpha === 0.1 && this.btn_alpha === 1) {
         
          if (this.interval !== null) clearInterval(this.interval);
          
          this.app.manager.power_off();
        
        }
        
      }, 20, false);
        
    } else {
       
      this.interval_count = 0;
      
      const dis = 0;
      const distance = (-420 * dis) - this.menu_left;
                     
      this.interval = setInterval(() => {
        
        this.interval_count++;
        const x = Math.round(this.easing(this.interval_count, 0, distance, 30));
        
        if (this.menu_left < (-420 * dis)) this.menu_left = (-420 * this.index) + x;
        else {
            
          if (this.interval !== null) clearInterval(this.interval);
          this.index = dis;
          this.menu_left = -420 * this.index;
    
          this.interval = setInterval(() => {
        
            if (this.blurStep < 20) this.blurStep = this.blurStep + 1;
            else this.blurStep = 20;
      
            if (this.bg_alpha < 0.9) this.bg_alpha = Math.round((this.bg_alpha + 0.1) * 10) / 10;
            else this.bg_alpha = 0.9;
      
            if (this.icon_alpha < 0.1) this.icon_alpha = Math.round((this.icon_alpha + 0.01) * 100) / 100 
            else this.icon_alpha = 0.1;
      
            if (this.btn_alpha < 1) this.btn_alpha = Math.round((this.btn_alpha + 0.1) * 10) / 10;
            else this.btn_alpha = 1;
            
            if (this.blurStep === 20 && this.bg_alpha === 0.9 && this.icon_alpha === 0.1 && this.btn_alpha === 1) {
         
              if (this.interval !== null) clearInterval(this.interval);
        
              this.app.manager.power_off();
        
            }
        
          }, 20, false);
    
        }
          
      }, 10);   
        
    }
    
  }

  search() {
     
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
          
    if (this.blurStep === 0) {
    
      this.drawRect({color: '#141414', shape: {cx: 960, cy: 540, w: 1920, h: 1080}}); // BG
        
      // LIST      
      this.drawImage(this.context, this.img.live, {cx: (330 + this.menu_left), cy: (550 + this.menu_top), w: 400, h: 400}, CONSTANT.LIST_SHADOW);
      this.drawImage(this.context, this.img.vod, {cx: (750 + this.menu_left), cy: (550 + this.menu_top), w: 400, h: 400}, CONSTANT.LIST_SHADOW);
      this.drawImage(this.context, this.img.music, {cx: (1170 + this.menu_left), cy: (550 + this.menu_top), w: 400, h: 400}, CONSTANT.LIST_SHADOW);
      this.drawImage(this.context, this.img.photo, {cx: (1590 + this.menu_left), cy: (550 + this.menu_top), w: 400, h: 400}, CONSTANT.LIST_SHADOW);
      this.drawImage(this.context, this.img.smart, {cx: (2010 + this.menu_left), cy: (550 + this.menu_top), w: 400, h: 400}, CONSTANT.LIST_SHADOW);
      this.drawImage(this.context, this.img.app, {cx: (2430 + this.menu_left), cy: (550 + this.menu_top), w: 400, h: 400}, CONSTANT.LIST_SHADOW);
      
      // TEXT    
      this.drawText(this.context, {title: 'Live TV', width: (330 + this.menu_left), height: (675 + this.menu_top), font: CONSTANT.TITLE_FONT, fillStyle: 'rgb(238, 238, 238)', textAlign: 'center'});
      this.drawText(this.context, {title: 'VOD', width: (750 + this.menu_left), height: (675 + this.menu_top), font: CONSTANT.TITLE_FONT, fillStyle: 'rgb(238, 238, 238)', textAlign: 'center'});
      this.drawText(this.context, {title: 'Music', width: (1170 + this.menu_left), height: (675 + this.menu_top), font: CONSTANT.TITLE_FONT, fillStyle: 'rgb(238, 238, 238)', textAlign: 'center'});
      this.drawText(this.context, {title: 'Photo', width: (1590 + this.menu_left), height: (675 + this.menu_top), font: CONSTANT.TITLE_FONT, fillStyle: 'rgb(238, 238, 238)', textAlign: 'center'});
      this.drawText(this.context, {title: 'Smart Home', width: (2010 + this.menu_left), height: (675 + this.menu_top), font: CONSTANT.TITLE_FONT, fillStyle: 'rgb(238, 238, 238)', textAlign: 'center'});
      this.drawText(this.context, {title: 'Apps', width: (2430 + this.menu_left), height: (675 + this.menu_top), font: CONSTANT.TITLE_FONT, fillStyle: 'rgb(238, 238, 238)', textAlign: 'center'});
      
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
      
    } else {
      
      this.drawImage(this.context, this.imageBuffer[this.blurStep], {cx: 960, cy: 540, w: 1920, h: 1080}, null, null);
    
      this.drawRect({color: `rgba(20, 20, 20, ${this.bg_alpha})`, shape: {cx: 960, cy: 540, w: 1920, h: 1080}});
      this.drawImage(this.context, this.img.unlock, {cx: 960, cy: 540, w: 140, h: 140}, null, this.icon_alpha);
    
      this.drawImage(this.context, this.img.btn_home, {cx: 960, cy: 1050, w: 60, h: 60}, null, this.btn_alpha);
    
      this.effectLock.Render();
    
    }
        
  }
  
  trigger(_eventName, _id, _hit) {

    Promise.resolve(_eventName)
           .then(name => {

             if (name === '[매니저] 언락유저의 우선권이 생김') return this.selectAction(_id, _hit);
             else if (name === '[매니저] 언락유저의 우선권이 사라짐 : 영역에서 나감') return this.outOfDisplayAction(_id, _hit);
             else if (name === '[매니저] 언락유저의 우선권이 사라짐 : 취소') return this.cancelAction(_id, _hit);
             else if (name === '[매니저] 언락유저의 우선권이 사라짐 : 컴펌 성공') return this.confirmAction(_id, _hit);
             else if (name === '[매니저] 언락유저의 우선권이 있는 상태에서 스와이프') return this.swipeAction(_id, _hit);
             else if (name === '[매니저] 언락유저의 우선권이 있는 상태에서 그대로') return this.dragAction(_id, _hit);
             else if (name === '[매니저] 언락유저의 우선권이 있는 상태에서 한번 더 셀렉트') return this.deepAction(_id, _hit);

           })
           .then(e => {

             if (e) console.log(e);

           });

  }

  selectAction = (_id, _hit) => {

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

      this.selectDrag(x);
        
    }

    return Promise.resolve();

  }

  outOfDisplayAction = (_id, _hit) => {

    if (this.isDrag) {
          
      this.endDrag();
      this.dragX = 0;
      this.isDrag = false;
          
    } else {
      
      this.effect.cancelEffect();
      this.dragX = 0;
      this.isDrag = false;
        
    }

    return Promise.resolve();

  }

  cancelAction = (_id, _hit) => {

    if (this.isDrag) {
          
      this.endDrag();
      this.dragX = 0;
      this.isDrag = false;
          
    } else {
      
      this.effect.cancelEffect();
      this.dragX = 0;
      this.isDrag = false;
        
    }

    return Promise.resolve();

  }

  confirmAction = (_id, _hit) => {

    if (!this.isDrag) this.effect.confirmEffect();

    if (_id === 'R') this.right(1);
    else if (_id === 'L') this.left(-1);
    else if (_id === 'TR') this.up();
    else if (_id === 'BR') this.down();
    else if (_id === 'B') this.home();
    else if (_id === 'BL') this.back();
    else if (_id === 'TL') this.power();
    else if (_id === 'T') this.search();
    else if (_id === 'DISPLAY') {
        
      if (_hit.id === 'DISPLAY') {
        
        const x = _hit.point.x * 1920;
        const y = _hit.point.y * 1080;
        
        if (this.isDrag) {
         
          this.endDrag();
          this.dragX = 0;
          this.isDrag = false;
          
        } else {
          
          if (x > 120 && x < 540 && y > 240 && y < 840) {
            
            if (this.index === 0) this.app.changeView('Live');
            else if (this.index === 1) this.app.changeView('VodList');
            else if (this.index === 2) this.app.changeView('MusicList');

          } else if (x > 540 && x < 960 && y > 240 && y < 840) {
              
            if (this.index === 0) this.app.changeView('VodList');
            else if (this.index === 1) this.app.changeView('MusicList');
            else if (this.index === 2) this.app.changeView('Photo');

          } else if (x > 960 && x < 1380 && y > 240 && y < 840) {
              
            if (this.index === 0) this.app.changeView('MusicList');
            else if (this.index === 1) this.app.changeView('Photo');
            else if (this.index === 2) this.app.changeView('Smart');

          } else if (x > 1380 && x < 1800 && y > 240 && y < 840) {
                
            if (this.index === 0) this.app.changeView('Photo');
            else if (this.index === 1) this.app.changeView('Smart');
            else if (this.index === 2) this.app.changeView('Application');

          }
          
        }
          
      }
        
    }            
      
    this.dragX = 0;
    this.isDrag = false;

    return Promise.resolve();

  }

  swipeAction = (_id, _hit) => {

    if (this.isDrag) {
          
      if (_hit.point.x > 0.5) { // 우측 스와이프
            
        let speed = 0;
              
        if (this.drags.length > 1) speed = this.drags[this.drags.length - 1] - this.drags[this.drags.length - 2];   
        else if (this.drags.length === 1) speed = 1920 - this.drags[this.drags.length - 1];
              
        if (speed > 150) this.left(-12);
        else if (speed > 50) this.left(-8);         
        else this.left(-4);
              
      } else { // 좌측 스와이프
               
        let speed = 0;
              
        if (this.drags.length > 1) speed = this.drags[this.drags.length - 1] - this.drags[this.drags.length - 2];   
        else if (this.drags.length === 1) speed = 1920 - this.drags[this.drags.length - 1];
              
        if (speed < -150) this.right(12);
        else if (speed < -50) this.right(8);
                
      }
                                    
      this.dragX = 0;
      this.isDrag = false;
      
    } else {
      
      this.effect.cancelEffect();
        
      this.dragX = 0;
      this.isDrag = false;
        
    }

    return Promise.resolve();

  }

  dragAction = (_id, _hit) => {

    if (_id === 'DISPLAY') {
        
      if (_hit.id === 'DISPLAY') {
          
        const x = _hit.point.x * 1920;
          
        if (this.isDrag) {
            
          this.addX(x);
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
            
            this.addX(x);
            this.dragX = this.getDrag() - this.drag;
            this.menu_left = (this.index * -420) + this.dragX;

          }
            
        }
        
      }
        
    }

    return Promise.resolve();

  }

  deepAction = (_id, _hit) => {

    return Promise.resolve();

  }

}

export default Home;
