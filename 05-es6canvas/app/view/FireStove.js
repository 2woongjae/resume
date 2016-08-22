import $ from 'jquery';
import Base from './Base';
import * as Constant from '../Constant';

const CONSTANT = Constant.FireStove;

const STATE = {

};

class FireStove extends Base {
          
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
      .append('<button id="btn_left">left</button>')
      .append('<button id="btn_right">right</button>');
          
    $('#btn_left').click(() => { this. Click_Left() });
    $('#btn_right').click(() => { this. Click_Right() });
        
  }
  
  Update() {
    
  }

  // 이미지 세팅
  setImage() {
    
    this.img = {
      
      // 0 : off , 1 : on
      bg: [new Image(),new Image(),new Image(),new Image()],
      on_off: [new Image(),new Image()],
      
    };

    this.img.bg[0].src = "/app/resource/Smart/fireStove/firestove_off.jpg";
    this.img.bg[0].addEventListener('load', this.onResourceLoaded, false);
    
    this.img.bg[1].src = "/app/resource/Smart/fireStove/firestove_on.jpg";
    this.img.bg[1].addEventListener('load', this.onResourceLoaded, false);

    this.img.bg[2].src = "/app/resource/Smart/fireStove/firestove_2.jpg";
    this.img.bg[2].addEventListener('load', this.onResourceLoaded, false);

    this.img.bg[3].src = "/app/resource/Smart/fireStove/firestove_3.jpg";
    this.img.bg[3].addEventListener('load', this.onResourceLoaded, false);
    
    this.img.on_off[0].src = "/app/resource/Smart/fireStove/fire_off.png";
    this.img.on_off[0].addEventListener('load', this.onResourceLoaded, false);
    
    this.img.on_off[1].src = "/app/resource/Smart/fireStove/fire_on.png";
    this.img.on_off[1].addEventListener('load', this.onResourceLoaded, false);
    
  }

  // 필요한 값들 세팅
  setValue() {
                  
    this.props = {

        LastState : 1
      
    };
        
  }
  
  pause() {
        
  }
  
  // Left
  Click_Left() {
    
    console.log('LEFT : Edge Effect');

  }
  
  // Right
  Click_Right() {
    
    console.log('RIGHT : Edge Effect');
        
  }
  
  ChangeStoveState() {
    
    let nowState = this.app.manager.iot.getStove();

    if(nowState === 0) {

        this.app.manager.iot.stove(this.props.LastState);

    } else {

        this.props.LastState = nowState;
        this.app.manager.iot.stove(0);

    }
            
  }

  /**
   *  Render 관련 부분
   */
  Render_Stove() {
    
    let nowState = this.app.manager.iot.getStove();
    
    this.drawImage(this.context, this.img.bg[nowState], {cx: 960, cy: 540, w: 1920, h: 1080}, null , null);
    
    if(nowState !== 0) this.drawImage(this.context, this.img.on_off[1], {cx: 960, cy: 540, w: 1920, h: 1080}, null , null);
    else this.drawImage(this.context, this.img.on_off[0], {cx: 960, cy: 540, w: 1920, h: 1080}, null , null);

    if(nowState + 3 <= CONSTANT.Max_State) {
      this.drawText(
        this.context, 
        {title: nowState + 3, width: 1870, height: 300, font: CONSTANT.FireStove__FONT, fillStyle: 'rgba(255, 255, 255, 0.3)', textAlign: 'center'},
      );
    }

    if(nowState + 2 <= CONSTANT.Max_State) {
      this.drawText(
        this.context, 
        {title: nowState + 2, width: 1870, height: 380, font: CONSTANT.FireStove__FONT, fillStyle: 'rgba(255, 255, 255, 0.3)', textAlign: 'center'},
      );
    }

    if(nowState + 1 <= CONSTANT.Max_State) {
      this.drawText(
        this.context, 
        {title: nowState + 1, width: 1870, height: 460, font: CONSTANT.FireStove__FONT, fillStyle: 'rgba(255, 255, 255, 0.3)', textAlign: 'center'},
      );
    }
    // 희망온도
    this.drawText(
      this.context, 
      {title: nowState, width: 1860, height: 570, font: CONSTANT.FireStove_FONT, fillStyle: 'rgba(255, 255, 255, 1)', textAlign: 'center'},
    );

    if(nowState - 1 >= CONSTANT.Min_State) {
      this.drawText(
        this.context, 
        {title: nowState - 1, width: 1870, height: 650, font: CONSTANT.FireStove__FONT, fillStyle: 'rgba(255, 255, 255, 0.3)', textAlign: 'center'},
      );
    }

    if(nowState - 2 >= CONSTANT.Min_State) {
      this.drawText(
        this.context, 
        {title: nowState - 2, width: 1870, height: 730, font: CONSTANT.FireStove__FONT, fillStyle: 'rgba(255, 255, 255, 0.3)', textAlign: 'center'},
      );
    }

    if(nowState - 3 >= CONSTANT.Min_State) {
      this.drawText(
        this.context, 
        {title: nowState - 3, width: 1870, height: 810, font: CONSTANT.FireStove__FONT, fillStyle: 'rgba(255, 255, 255, 0.3)', textAlign: 'center'},
      );
    }
            
  }

  right(_dis) {

  }
  
  left(_dis) {      

  }
  // 여기서 온도 올림 & 마지막상태 저장
  up() {

    let nowState = this.app.manager.iot.getStove();

    nowState = (nowState + 1) > CONSTANT.Max_State ? CONSTANT.Max_State :  nowState + 1;
    this.props.LastState = nowState;    

    this.app.manager.iot.stove(nowState);

  }
  // 여기서 온도 내림 & 마지막 상태 저장
  down() {

    let nowState = this.app.manager.iot.getStove();

    nowState = (nowState - 1) < CONSTANT.Min_State ? CONSTANT.Min_State :  nowState - 1;
    if(nowState !== 0) this.props.LastState = nowState;

    this.app.manager.iot.stove(nowState);

  }
  
  home() {
          
    this.app.changeView('Home');
        
  }
  
  back() {
          
    this.app.changeView('Smart');
        
  }

  hideLock() {
    
    
  }
  
  Render() {
        
    this.Render_Stove();  
    
    this.outside.Render();
    this.effect.Render();
    
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
          
        if (x > 680 && x < 1240 && y > 240 && y < 840) this.effect.selectEffect(960, 550);
          
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
          
            if (x > 680 && x < 1240 && y > 240 && y < 840) {
              
              this.effect.confirmEffect();
              this.ChangeStoveState();
              //this.app.manager.iot.plug('Fan');
        
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

export default FireStove;
