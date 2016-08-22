import $ from 'jquery';
import Base from './Base';
import * as Constant from '../Constant';

const CONSTANT = Constant.Live;

class Live extends Base {
  
  constructor(_app) {
    super(_app);
    
  }

  init = () => {

    return Promise.resolve()
                  .then(this.setMembers);

  }

  setMembers = () => {

    this.video = document.createElement('video');
    
    this.index = 0;
    
    this.video.autoplay = true;
    this.video.loop = true;
    
    this.outside.id = 'Live';

    return Promise.resolve();

  }

  reinitialize = () => {
    
    $('#debug').empty().hide();
    
    return Promise.resolve()
                  .then(this.getList)
                  .then((list) => {
    
                    this.list = list.data;
    
                    if (this.video.src === '') this.video.src = this.list[this.index].video;
    
                    this.isPlay = true;    
                    this.video.play();
    
                    console.log(this.list[this.index].broadcast + ' - ' + this.list[this.index].title);

                    return Promise.resolve();

                  });

  }

  getList = () => {
    
    return new Promise((resolve, reject) => {
          
      $.get('http://vtv.vtouchinc.com/api/live-tv', (data) => {
          
        resolve(data);
          
      });
          
    });
      
  }

  pause() {

    this.isPlay = false;
    this.video.pause();
    
  }
  
  left() {
      
    this.index = (this.index - 1 < 0) ? this.list.length - 1 : this.index - 1;  
    this.video.src = this.list[this.index].video;
      
    this.isPlay = true;    
      
  }

  right() {
      
    this.index = (this.index + 1 < this.list.length) ? this.index + 1 : 0;  
    this.video.src = this.list[this.index].video;
      
    this.isPlay = true;
    
  }
  
  up() {
    
    
    
  }
  
  down() {
    
    
    
  }

  back() {
    
    this.app.changeView('Home');
    
  }
  
  home() {
    
    this.app.changeView('Home');
    
  }
  
  power() {
    
    
    
  }
  
  Update() {
    
    
  }
  
  Render() {
    
    this.drawRect({color: '#141414', shape: {cx: 960, cy: 540, w: 1920, h: 1080}}); // BG
    
    if (this.isPlay) this.context.drawImage(this.video, 0, 0, 1920, 1080);
    
    this.outside.Render();  
    this.effect.Render();
    this.effectLock.Render();
    
  }
  
  trigger(_eventName, _id, _hit) {
        
    if (_eventName === '[매니저] 언락유저의 우선권이 생김') {
      
      if (_id === 'TL') this.effect.selectEffect(30, 30);  
      else if (_id === 'BL') this.effect.selectEffect(30, 1050); 
      else if (_id === 'L') this.effect.selectEffect(540, 1050, {func: () => {this.left();}, acc: false}); 
      else if (_id === 'R') this.effect.selectEffect(1380, 1050, {func: () => {this.right();}, acc: false});  
      else if (_id === 'TR') this.effect.selectEffect(1890, 30, {func: () => {this.up();}, acc: false}); 
      else if (_id === 'BR') this.effect.selectEffect(1890, 1050, {func: () => {this.down();}, acc: false}); 
      else if (_id === 'B') this.effect.selectEffect(960, 1050); 
      else if (_id === 'T') this.effect.selectEffect(960, 30); 
      else if (_id === 'DISPLAY') {}
      
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
        this.right();
        
      } else if (_id === 'L') {
        
        if (!this.isDrag) this.effect.confirmEffect();
        this.left();
      
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

export default Live;
