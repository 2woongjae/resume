import $ from 'jquery';
import Base from './Base';
import * as Constant from '../Constant';

const CONSTANT = Constant.Light;

class Light extends Base {
          
  constructor(_app) {
    super(_app);
            
  }

  init = () => {

    this.menu_left = 0;
    this.menu_top = 0;
    this.index = 0;
    
    this.setValue();
    
    this.setImage();
    
    this.reinitialize();

    return Promise.resolve();

  }
  
  reinitialize() {
        
    $('#debug')
      .empty()
      .append('<button id="btn_all">all</button>')
      .append('<button id="btn_light1">light1</button>')
      .append('<button id="btn_light2">light2</button>')
      .append('<button id="btn_left">left</button>')
      .append('<button id="btn_right">right</button>')
      .append('<br /><br />')
      .append('<button id="btn_smart">smart</button>');
          
    $('#btn_all').click(() => { this. Click_All() });
    $('#btn_light1').click(() => { this. Click_Light1() });
    $('#btn_light2').click(() => { this. Click_Light2() });
    $('#btn_left').click(() => { this. Click_Left() });
    $('#btn_right').click(() => { this. Click_Right() });
    
    $('#btn_smart').click(() => {this.app.changeView('Smart');});
    
  }
  
  Update() {
    
  }

  // 이미지 세팅
  setImage() {
    
    this.img = {
      
      // 0 : off , 1 : on
      light: [new Image(),new Image()],
      on_off: [new Image(),new Image()],
      bg : new Image(),
      
    };

    this.img.light[0].src = "/app/resource/Smart/Light/icon_iot_light_off.png";
    this.img.light[0].addEventListener('load', this.onResourceLoaded, false);
    
    this.img.light[1].src = "/app/resource/Smart/Light/icon_iot_light_on.png";
    this.img.light[1].addEventListener('load', this.onResourceLoaded, false);
    
    this.img.on_off[0].src = "/app/resource/Smart/btn_iot_off.png";
    this.img.on_off[0].addEventListener('load', this.onResourceLoaded, false);
    
    this.img.on_off[1].src = "/app/resource/Smart/btn_iot_on.png";
    this.img.on_off[1].addEventListener('load', this.onResourceLoaded, false);
    
    this.img.bg.src = "/app/resource//Smart/bg.png";
    this.img.bg.addEventListener('load', this.onResourceLoaded, false);
    
  }

  // 필요한 값들 세팅
  setValue() {
        
    this.allState = true,
          
    this.props = {
      
        Light : [
          {
            
            name : 'LIGHT L',
            on_off : false,
            left : 400

          },
          {
            
            name : 'LIGHT R',
            on_off  : false,
            left : 960

          }
          
       ]
      
    };
        
  }
  
  pause() {
        
  }
  
  // All
  Click_All() {

    this.allState = !this.allState;
    
    for(let i = 0; i < this.props.Light.length; i++) {
      
      if(this.props.Light[i].on_off !== this.allState) this.ChangeLightState(i , !this.props.Light[i].on_off);
      
    }
    
  }
  
  // Light1
  Click_Light1() {
        
    this.ChangeLightState(0 , !this.props.Light[0].on_off);
        
  }
  
  // Light2
  Click_Light2() {
    
    this.ChangeLightState(1 , !this.props.Light[1].on_off);
        
  }

  // Left
  Click_Left() {
    
    console.log('LEFT : Edge Effect');

  }
  
  // Right
  Click_Right() {
    
    console.log('RIGHT : Edge Effect');
        
  }
  
  ChangeLightState(_no , _state) {
    
    this.props.Light[_no].on_off = _state;
            
  }
  
  /**
   *  Render 관련 부분
   */
  Render_Light() {
    
    this.drawImage(this.context, this.img.bg, {cx: 960, cy: 540, w: 1920, h: 1080}, null , null);
    this.drawRect({color: 'rgba(0, 0, 0, 0.7)', shape: {cx: 960, cy: 540, w: 1920, h: 1080}}); // BG
    
    this.drawText(
      this.context, 
      {title: CONSTANT.TITLE_TEXT, width: 960, height: 243, font: CONSTANT.TITLE_FONT, fillStyle: 'rgb(238, 238, 238)', textAlign: 'center'},
      {strokeStyle: '#000', lineWidth: 1}, 
      {shadowColor: 'rgba(0, 0, 0, 0.5)', shadowBlur: 5, shadowOffsetX: 0, shadowOffsetY: 3}
    );
    
    if (this.app.manager.iot.getLight('LIGHT L')) {
        
      this.drawImage(this.context, this.img.on_off[1], {cx: (this.props.Light[0].left + this.menu_left), cy: (540 + this.menu_top), w: 540, h: 540}, null , null);
      this.drawImage(this.context, this.img.light[1], {cx: (this.props.Light[0].left + this.menu_left), cy: (540 + this.menu_top), w: 540, h: 540}, null , null);
        
      this.drawText(
        this.context, 
        {title: this.props.Light[0].name, width: (this.props.Light[0].left + 5 + this.menu_left), height: (420 + this.menu_top), font: CONSTANT.LIGHT_FONT, fillStyle: 'rgba(255, 255, 255, 1)', textAlign: 'center'},
      );
        
    } else {
        
      this.drawImage(this.context, this.img.on_off[0], {cx: (this.props.Light[0].left + this.menu_left), cy: (540 + this.menu_top), w: 540, h: 540}, null , null);
      this.drawImage(this.context, this.img.light[0], {cx: (this.props.Light[0].left + this.menu_left), cy: (540 + this.menu_top), w: 540, h: 540}, null , null);
        
      this.drawText(
        this.context, 
        {title: this.props.Light[0].name, width: (this.props.Light[0].left + 5 + this.menu_left), height: (420 + this.menu_top), font: CONSTANT.LIGHT_FONT, fillStyle: 'rgba(255, 255, 255, 0.4)', textAlign: 'center'},
      );
        
    }
      
    if (this.app.manager.iot.getLight('LIGHT R')) {
        
      this.drawImage(this.context, this.img.on_off[1], {cx: (this.props.Light[1].left + this.menu_left), cy: (540 + this.menu_top), w: 540, h: 540}, null , null);
      this.drawImage(this.context, this.img.light[1], {cx: (this.props.Light[1].left + this.menu_left), cy: (540 + this.menu_top), w: 540, h: 540}, null , null);
        
      this.drawText(
        this.context, 
        {title: this.props.Light[1].name, width: (this.props.Light[1].left + 5 + this.menu_left), height: (420 + this.menu_top), font: CONSTANT.LIGHT_FONT, fillStyle: 'rgba(255, 255, 255, 1)', textAlign: 'center'},
      );
        
    } else {
        
      this.drawImage(this.context, this.img.on_off[0], {cx: (this.props.Light[1].left + this.menu_left), cy: (540 + this.menu_top), w: 540, h: 540}, null , null);
      this.drawImage(this.context, this.img.light[0], {cx: (this.props.Light[1].left + this.menu_left), cy: (540 + this.menu_top), w: 540, h: 540}, null , null);
        
      this.drawText(
        this.context, 
        {title: this.props.Light[1].name, width: (this.props.Light[1].left + 5 + this.menu_left), height: (420 + this.menu_top), font: CONSTANT.LIGHT_FONT, fillStyle: 'rgba(255, 255, 255, 0.4)', textAlign: 'center'},
      );
        
    }
                   
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
          
    this.app.changeView('Smart');
        
  }
  
  Render() {
        
    this.Render_Light();  
    
    this.outside.Render();
    this.effect.Render();
    this.effectLock.Render();
    
  }

  onResourceLoaded(params) {
    
    
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
          
        if (x > 120 && x < 680 && y > 240 && y < 840) this.effect.selectEffect(400, 550); 
        else if (x > 680 && x < 1240 && y > 240 && y < 840) this.effect.selectEffect(960, 550);
          
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
          
            if (x > 120 && x < 680 && y > 240 && y < 840) {
              
              this.effect.confirmEffect();
              this.app.manager.iot.light('LIGHT L');
            
            } else if (x > 680 && x < 1240 && y > 240 && y < 840) {
              
              this.effect.confirmEffect();
              this.app.manager.iot.light('LIGHT R');
        
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

export default Light;
