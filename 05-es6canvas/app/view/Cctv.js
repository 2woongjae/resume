import $ from 'jquery';
import Base from './Base';

class Cctv extends Base {
  
  constructor(_app) {
    super(_app);
    
  }

  init = () => {
    
    this.img = {};
    
    this.img.kitchen = new Image();
    this.img.kitchen.src = "/app/resource/Smart/Cctv/kitchen.jpg";
    this.img.kitchen.addEventListener('load', this.onResourceLoaded, false);
    
    this.reinitialize();

    return Promise.resolve();

  }
  
  reinitialize() {
        
  }
  
  Update() {
    
    
  }
  
  Render() {
    
    this.drawImage(this.context, this.img.kitchen, {cx: 960, cy: 540, w: 1920, h: 1080}, null, null);
    
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
      
      if (_id === 'BL') this.app.changeView('Smart'); 
      else if (_id === 'B') this.app.changeView('Home');            
      
      this.dragX = 0;
      this.isDrag = false;
      
    } else if (_eventName === '[매니저] 언락유저의 우선권이 있는 상태에서 한번 더 셀렉트') {
      
    } else if (_eventName === '[매니저] 언락유저의 우선권이 있는 상태에서 그대로') {
     
    }
    
  }
  
}

export default Cctv;
