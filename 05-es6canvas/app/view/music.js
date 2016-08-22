import $ from 'jquery';
import Base from './Base';

class Music extends Base {
  
  constructor(_app) {
    super(_app);
  
  }

  init = () => {

    this.reinitialize();

    return Promise.resolve();

  }
  
  reinitialize = () => {
    
    $('#debug')
      .empty()
      .append('<button id="left">left</button>')
      .append('<button id="right">right</button>');
    
    $('#left').click(() => {
      
      this.move(-1);
    
    });
    
    $('#right').click(() => {
      
      this.move(1);
    
    });
        
  }
  
  Update() {
    
    
  }
  
  Render() {

    this.drawRect({color: '#141414', shape: {cx: 960, cy: 540, w: 1920, h: 1080}}); // BG
    
    this.outside.Render();
    this.effect.Render();
    this.effectLock.Render();
    
  }
  
  trigger(_eventName, _id, _hit) {
    
    if (_eventName === '[매니저] 언락유저의 우선권이 생김') {
      
      if (_id === 'TL') this.effect.selectEffect(30, 30);  
      else if (_id === 'BL') this.effect.selectEffect(30, 1050); 
      else if (_id === 'L') this.effect.selectEffect(540, 1050); 
      else if (_id === 'R') this.effect.selectEffect(1380, 1050);  
      else if (_id === 'TR') this.effect.selectEffect(1890, 30); 
      else if (_id === 'BR') this.effect.selectEffect(1890, 1050); 
      else if (_id === 'B') this.effect.selectEffect(960, 1050); 
      else if (_id === 'DISPLAY') {
        
        if (_hit.id === 'DISPLAY') {
          
          const x = _hit.point.x * 1920;
          const y = _hit.point.y * 1080;
          
          /*
          if (x > 120 && x < 540 && y > 240 && y < 840) {
              
          }
          */
          
          this.drag = x;
          this.drags = [];
          this.drags.push(x);
          
        } else if (_hit.id === 'DRAG') {
          
          
          
        }
        
      }
      
    } else if (_eventName === '[매니저] 언락유저의 우선권이 사라짐 : 영역에서 나감') {
       
      this.effect.cancelEffect();
        
      this.dragX = 0;
      this.isDrag = false;
       
    } else if (_eventName === '[매니저] 언락유저의 우선권이 사라짐 : 취소') {
       
      this.effect.cancelEffect();
        
      this.dragX = 0;
      this.isDrag = false;
      
    } else if (_eventName === '[매니저] 언락유저의 우선권이 사라짐 : 컴펌 성공') {
      
      if (!this.isDrag) this.effect.confirmEffect();
      
      if (_id === 'BL') this.app.changeView('MusicList');
      else if (_id === 'DISPLAY') {
        
        const x = _hit.point.x * 1920;
        const y = _hit.point.y * 1080;
        
        if (this.isDrag) {
          
          
        } else {
          
          if (x > 120 && x < 540 && y > 240 && y < 840) {
            
            //if (this.props.UNLOCK.menu_left === 0) this.app.changeView('Live');
          
          } else if (x > 540 && x < 960 && y > 240 && y < 840) {
            
            //if (this.props.UNLOCK.menu_left === 0) this.app.changeView('Vod');

          } else if (x > 960 && x < 1380 && y > 240 && y < 840) {
            
            //if (this.props.UNLOCK.menu_left === 0) this.app.changeView('Music');

          } else if (x > 1380 && x < 1800 && y > 240 && y < 840) {
            
            //if (this.props.UNLOCK.menu_left === 0) this.app.changeView('Photo');

          }
          
        }
        
      }            
      
      this.dragX = 0;
      this.isDrag = false;
      
    } else if (_eventName === '[매니저] 언락유저의 우선권이 있는 상태에서 한번 더 셀렉트') {
      
      
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
            
          } else {
            
            if (Math.abs(this.drag - x) > CONSTANT.DRAG_START_DISTANCE) {
            
              this.isDrag = true;
              this.effect.isShow = false;
            
            }
            
            if (this.isDrag) {
            
              // 리스크 이동
              if (this.drags.length > CONSTANT.DRAG_AVG_LENGTH - 1) {
              
                this.drags.shift();
              
              }
            
              this.drags.push(x);
            
              this.dragX = this.getDrag() - this.drag;
            
            }
            
          }
          
        } else if (_hit.id === 'DRAG') {
          
          
          
        }
        
      }
     
    }
    
  }
  
}

export default Music;
