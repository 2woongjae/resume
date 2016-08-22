import $ from 'jquery';
import Base from './Base';
import * as Constant from '../Constant';

const CONSTANT = Constant.Thermo;

const STATE = {
  
  Room1 : 0,
  Room2 : 1,
  Room3 : 2,

};

class Thermo extends Base {
    
  constructor(_app) {
    super(_app);
            
  }

  init = () => {

    this.setValue();
    
    this.setImage();
    
    this.reinitialize();

    return Promise.resolve();

  }
  
  reinitialize() {
        
    $('#debug')
      .empty().hide()
      .append('<button id="btn_mode">mode</button>')
      .append('<button id="btn_fan">fan</button>')
      .append('<button id="btn_up">up</button>')
      .append('<button id="btn_down">down</button>')
      .append('<button id="btn_left">left</button>')
      .append('<button id="btn_right">right</button>')
      .append('<br /><br />')
      .append('<button id="btn_smart">smart</button>');
          
    $('#btn_mode').click(() => { this. Click_Mode() });
    $('#btn_fan').click(() => { this. Click_Fan() });
    $('#btn_up').click(() => { this. Click_Up() });
    $('#btn_down').click(() => { this. Click_Down() });
    $('#btn_left').click(() => { this. Click_Left() });
    $('#btn_right').click(() => { this. Click_Right() });
    
    $('#btn_smart').click(() => {this.app.changeView('Smart');});
    
  }
  
  Update() {
    
  }

  // 이미지 세팅
  setImage() {
    
    this.img = {
    
      fan: [new Image(),new Image(),new Image(),new Image(),new Image()],
      room: [new Image(),new Image(),new Image()],
      bg : new Image(),
      
    };

    this.img.room[0].src = "/app/resource/Smart/Thermo/bg_1.png";
    this.img.room[0].addEventListener('load', this.onResourceLoaded, false);
    
    this.img.room[1].src = "/app/resource/Smart/Thermo/bg_2.png";
    this.img.room[1].addEventListener('load', this.onResourceLoaded, false);
    
    this.img.room[2].src = "/app/resource/Smart/Thermo/bg_3.png";
    this.img.room[2].addEventListener('load', this.onResourceLoaded, false);
    
    this.img.bg.src = "/app/resource//Smart/Thermo/bg_img_blur.png";
    this.img.bg.addEventListener('load', this.onResourceLoaded, false);
    
    this.img.fan[0].src = "/app/resource/Smart/Thermo/1-1.png";
    this.img.fan[0].addEventListener('load', this.onResourceLoaded, false);
    
    this.img.fan[1].src = "/app/resource/Smart/Thermo/2-1.png";
    this.img.fan[1].addEventListener('load', this.onResourceLoaded, false);
    
    this.img.fan[2].src = "/app/resource/Smart/Thermo/3-1.png";
    this.img.fan[2].addEventListener('load', this.onResourceLoaded, false);
    
    this.img.fan[3].src = "/app/resource/Smart/Thermo/4-1.png";
    this.img.fan[3].addEventListener('load', this.onResourceLoaded, false);
    
    this.img.fan[4].src = "/app/resource/Smart/Thermo/5-1.png";
    this.img.fan[4].addEventListener('load', this.onResourceLoaded, false);
    
  }

  onResourceLoaded = params => {
    
    this.imageCount++;
        
    //if (this.imageCount > (this.img.fan.length + this.img.room.length)) this.makeBuffer();
    
  }

  makeBuffer() {
    
    this.imageBuffer = [];
    
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    canvas.width = 1920;
    canvas.height = 1080;
    
    const imageBuffer = context.getImageData(0, 0, 1920, 1080);
          
    const image = new Image();
              
    this.drawImage(context, this.img.bg, {cx: 960, cy: 540, w: 1920, h: 1080}, null , null);
    
    for(let i = 0; i <= this.roomMAX ; i++) {
            
      // 기초 정보들
      this.drawSpriteImage(context, this.img.room[i], {cx: this.props.Room[i].left, cy: 540, w: this.props.Room[i].width, h: 1080, l : this.props.Room[i].imgX}, null , null);

      // 방 이름
      this.drawText(
        context, 
        {title: this.props.Room[i].name, width: this.props.Room[i].left, height: 200, font: CONSTANT.ROOM_FONT, fillStyle: 'rgba(255, 255, 255, 1)', textAlign: 'center'},
      );
      // 팬 세기를 나타냄
      this.drawImage(context, this.img.fan[this.props.Room[i].fan - 1], {cx: this.props.Room[i].left, cy: 540, w: this.props.Room[i].width, h: 1080, l : this.props.Room[i].imgX}, null , null);
      // 팬 세기 숫자
      this.drawText(
        context, 
        {title: this.props.Room[i].fan, width: this.props.Room[i].left, height: 770, font: CONSTANT.TEMPERATURE_FONT, fillStyle: 'rgba(255, 255, 255, 1)', textAlign: 'center'},
      );
      // 희망온도 + 2
      if(this.props.Room[i].desired_temperature + 2 <= CONSTANT.MAX_TEMPERATURE) {
        this.drawText(
          context, 
          {title: this.props.Room[i].desired_temperature + 2, width: this.props.Room[i].left + 910, height: 380, font: CONSTANT.TEMPERATURE__FONT, fillStyle: 'rgba(255, 255, 255, 0.3)', textAlign: 'center'},
        );
      }
      // 희망온도 + 1
      if(this.props.Room[i].desired_temperature + 1 <= CONSTANT.MAX_TEMPERATURE) {
        this.drawText(
          context, 
          {title: this.props.Room[i].desired_temperature + 1, width: this.props.Room[i].left + 910, height: 460, font: CONSTANT.TEMPERATURE__FONT, fillStyle: 'rgba(255, 255, 255, 0.6)', textAlign: 'center'},
        );
      }
      // 희망온도
      this.drawText(
        context, 
        {title: this.props.Room[i].desired_temperature, width: this.props.Room[i].left + 890, height: 570, font: CONSTANT.TEMPERATURE_FONT, fillStyle: 'rgba(255, 255, 255, 1)', textAlign: 'center'},
      );
      // 희망온도 - 1
      if(this.props.Room[i].desired_temperature - 1 >= CONSTANT.MIN_TEMPERATURE) {
        this.drawText(
          context, 
          {title: this.props.Room[i].desired_temperature - 1, width: this.props.Room[i].left + 910, height: 650, font: CONSTANT.TEMPERATURE__FONT, fillStyle: 'rgba(255, 255, 255, 0.6)', textAlign: 'center'},
        );
      }
      // 희망온도 - 2
      if(this.props.Room[i].desired_temperature - 2 >= CONSTANT.MIN_TEMPERATURE) {
        this.drawText(
          context, 
          {title: this.props.Room[i].desired_temperature - 2, width: this.props.Room[i].left + 910, height: 730, font: CONSTANT.TEMPERATURE__FONT, fillStyle: 'rgba(255, 255, 255, 0.3)', textAlign: 'center'},
        );
      }
    }
        
    image.src = canvas.toDataURL();
              
    this.imageBuffer.push(image);
          
    console.log('thermo : 이미지 버퍼 생성 완료');
    
  }

  // 필요한 값들 세팅
  setValue() {
          
    this.props = {
      
        Room : [
          {
            
            name : 'Phase - Jack Garratt',
            imgX : 1920,
            left : -960,
            width : 0,
            desired_temperature  : 20,
            fan : 1,
            mode : 0
          },
          {
            
            name : 'LIVING ROOM',
            imgX : 0,
            left : 960,
            width : 1920,
            desired_temperature  : 22,
            fan : 1,
            mode : 0

          },
          {
            
            name : 'Antichrist Superstar - Maril',
            imgX : -1920,
            left : 2860,
            width : 0,
            desired_temperature  : 19,
            fan : 1,
            mode : 0
            
          }
          
       ]
      
    };
    
    this.interval = null;
    
    this.state = STATE.Room2;
  
    this.isReady = true;
    
    this.roomMAX = STATE.Room3;

    this.imageCount = 0;
    
  }
  
  pause() {
        
  }
  
  // Mode
  Click_Mode() {
    
    this.props.Room[this.state].mode = this.props.Room[this.state].mode + 1 >= CONSTANT.mode.length ? 0 : this.props.Room[this.state].mode + 1;
    
    console.log(CONSTANT.mode[this.props.Room[this.state].mode]);
    
  }
  
  // Fan
  Click_Fan() {
    
    this.props.Room[this.state].fan = (this.props.Room[this.state].fan + 1) > 5 ? 1 : this.props.Room[this.state].fan + 1;
    
  }
  
  // Up
  Click_Up() {
    
    this.props.Room[this.state].desired_temperature = (this.props.Room[this.state].desired_temperature + 1) > CONSTANT.MAX_TEMPERATURE ? CONSTANT.MAX_TEMPERATURE :  this.props.Room[this.state].desired_temperature + 1;
    
  }
  
  // Down
  Click_Down() {
    
    this.props.Room[this.state].desired_temperature = (this.props.Room[this.state].desired_temperature - 1) < CONSTANT.MIN_TEMPERATURE ? CONSTANT.MIN_TEMPERATURE :  this.props.Room[this.state].desired_temperature - 1;
    
  }
  
  // Left
  Click_Left() {
    
    if(this.isReady) {
      
      this.isReady = !this.isReady;
    
      const left = ( this.state - 1 < STATE.Room1 ) ? this.roomMAX : this.state - 1;
      const center = this.state;
      
      this.props.Room[left].imgX = 1920;
      this.props.Room[left].left = -960;
      this.props.Room[left].width = 0;
          
      if(this.interval !== null) clearInterval(this.interval);
      
      this.interval = setInterval(() => {
        
        if(this.props.Room[this.state].width === 0) {
          
          clearInterval(this.interval);
          
          this.state = left;
          
          this.isReady = true;
          
        } else {
          
          this.props.Room[center].imgX -= CONSTANT.MOVE_SPEED;
          this.props.Room[center].left += CONSTANT.MOVE_SPEED;
          this.props.Room[center].width -= CONSTANT.MOVE_SPEED;
          
          this.props.Room[left].imgX -= CONSTANT.MOVE_SPEED;
          this.props.Room[left].left += CONSTANT.MOVE_SPEED;
          this.props.Room[left].width += CONSTANT.MOVE_SPEED;
          
        }
        
      },10);
    
    }
        
  }
  
  // Right
  Click_Right() {
    
    if(this.isReady) {
    
      const right = ( this.state + 1 > this.roomMAX ) ? STATE.Room1 : this.state + 1;
      const center = this.state;
          
      this.props.Room[right].imgX = -1920;
      this.props.Room[right].left = 2860;
      this.props.Room[right].width = 0;
          
      if(this.interval !== null) clearInterval(this.interval);
      
      this.interval = setInterval(() => {
        
        if(this.props.Room[this.state].width === 0) {
          
          clearInterval(this.interval);
          
          this.state = right;
          
          this.isReady = true;
          
        } else {
          
          this.props.Room[center].imgX += CONSTANT.MOVE_SPEED;
          this.props.Room[center].left -= CONSTANT.MOVE_SPEED;
          this.props.Room[center].width -= CONSTANT.MOVE_SPEED;
          
          this.props.Room[right].imgX += CONSTANT.MOVE_SPEED;
          this.props.Room[right].left -= CONSTANT.MOVE_SPEED;
          this.props.Room[right].width += CONSTANT.MOVE_SPEED;
          
        }
        
      },10);
      
    }
        
  }
  
  /**
   *  Render 관련 부분
   */
  Render_Thermo() {
    
    this.drawImage(this.context, this.img.bg, {cx: 960, cy: 540, w: 1920, h: 1080}, null , null);
    
    for(let i = 0; i <= this.roomMAX ; i++) {
            
      // 기초 정보들
      this.drawSpriteImage(this.context, this.img.room[i], {cx: this.props.Room[i].left, cy: 540, w: this.props.Room[i].width, h: 1080, l : this.props.Room[i].imgX}, null , null);

      // 방 이름
      this.drawText(
        this.context, 
        {title: this.props.Room[i].name, width: this.props.Room[i].left, height: 200, font: CONSTANT.ROOM_FONT, fillStyle: 'rgba(255, 255, 255, 1)', textAlign: 'center'},
      );
      // 팬 세기를 나타냄
      this.drawImage(this.context, this.img.fan[this.props.Room[i].fan - 1], {cx: this.props.Room[i].left, cy: 540, w: this.props.Room[i].width, h: 1080, l : this.props.Room[i].imgX}, null , null);
      /*
      // 팬 세기 숫자
      this.drawText(
        this.context, 
        {title: this.props.Room[i].fan, width: this.props.Room[i].left, height: 770, font: CONSTANT.TEMPERATURE_FONT, fillStyle: 'rgba(255, 255, 255, 1)', textAlign: 'center'},
      );
      // 희망온도 + 2
      if(this.props.Room[i].desired_temperature + 2 <= CONSTANT.MAX_TEMPERATURE) {
        this.drawText(
          this.context, 
          {title: this.props.Room[i].desired_temperature + 2, width: this.props.Room[i].left + 910, height: 380, font: CONSTANT.TEMPERATURE__FONT, fillStyle: 'rgba(255, 255, 255, 0.3)', textAlign: 'center'},
        );
      }
      // 희망온도 + 1
      if(this.props.Room[i].desired_temperature + 1 <= CONSTANT.MAX_TEMPERATURE) {
        this.drawText(
          this.context, 
          {title: this.props.Room[i].desired_temperature + 1, width: this.props.Room[i].left + 910, height: 460, font: CONSTANT.TEMPERATURE__FONT, fillStyle: 'rgba(255, 255, 255, 0.6)', textAlign: 'center'},
        );
      }
      // 희망온도
      this.drawText(
        this.context, 
        {title: this.props.Room[i].desired_temperature, width: this.props.Room[i].left + 890, height: 570, font: CONSTANT.TEMPERATURE_FONT, fillStyle: 'rgba(255, 255, 255, 1)', textAlign: 'center'},
      );
      // 희망온도 - 1
      if(this.props.Room[i].desired_temperature - 1 >= CONSTANT.MIN_TEMPERATURE) {
        this.drawText(
          this.context, 
          {title: this.props.Room[i].desired_temperature - 1, width: this.props.Room[i].left + 910, height: 650, font: CONSTANT.TEMPERATURE__FONT, fillStyle: 'rgba(255, 255, 255, 0.6)', textAlign: 'center'},
        );
      }
      // 희망온도 - 2
      if(this.props.Room[i].desired_temperature - 2 >= CONSTANT.MIN_TEMPERATURE) {
        this.drawText(
          this.context, 
          {title: this.props.Room[i].desired_temperature - 2, width: this.props.Room[i].left + 910, height: 730, font: CONSTANT.TEMPERATURE__FONT, fillStyle: 'rgba(255, 255, 255, 0.3)', textAlign: 'center'},
        );
      }
      */
    }
               
  }
  
  Render() {
        
    this.Render_Thermo();  
    
    this.outside.Render();
    
    this.effect.Render();
    
  }

  onResourceLoaded(params) {
    
    
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
      
      if (_id === 'BL') this.app.changeView('Smart');
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

export default Thermo;
