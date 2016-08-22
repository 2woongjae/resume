import $ from 'jquery';
import Base from './Base';
import * as Constant from '../Constant';

const CONSTANT = Constant.Photo;

const STATE = {
  
  PHOTOLIST : 0,
  SUBPHOTO : 1,
  FULLPHOTO : 2
  
}

class Photo extends Base {
  
  constructor(_app) {
    
    super(_app);
    
  }

  init = () => {

    this.reinitialize();

    return Promise.resolve();

  }
  
  async reinitialize() {
    
    this.wait = true;
    
    this.imageCount = 0;
    
    this.state = STATE.PHOTOLIST;
    
    this.setDebug();    
    
    const list = await this.getList();
             
    this.setValue(list.data);
    
    this.setImage();
        
  }
  
  async subinitialize(_album) {
    
    this.wait = true;
    
    this.state = STATE.SUBPHOTO;
    
    this.setDebug();
        
    const list = await this.getList(_album);
        
    this.setSubValue(list.data);
        
  }
  
  fullinitialize(_index) {
    
    this.wait = true;
    
    this.state = STATE.FULLPHOTO;
    
    this.setDebug();
                
    this.setFullValue(_index);
    
  }
  
  getList(_album) {
    
    if(this.state === STATE.PHOTOLIST) {
    
      return new Promise((resolve, reject) => {
            
        $.get('http://vtv.vtouchinc.com/api/photo-album', (data) => {
            
          resolve(data);
            
        });
            
      });
      
    } else if(this.state === STATE.SUBPHOTO) {
      
      return new Promise((resolve, reject) => {
            
        $.get(`http://vtv.vtouchinc.com/api/photos?album=${_album}`, (data) => {
            
          resolve(data);
            
        });
            
      });
      
    }
      
  }
  
  setDebug() {
    
    if(this.state === STATE.PHOTOLIST) {
    
      $('#debug')
        .empty().show()
        .append('<button id="left">left</button>')
        .append('<button id="right">right</button>')
        .append('<br /><br />')
        .append('<button id="select_0">select_0</button>')
        .append('<button id="select_1">select_1</button>')
        .append('<button id="select_2">select_2</button>')
        .append('<button id="select_3">select_3</button>')
        .append('<button id="select_4">select_4</button>')
        .append('<button id="select_5">select_5</button>')
        .append('<br /><br />')
        .append('<button id="btn_home">Home</button>');
      
      $('#left').click(() => {this.move(-1);});
      $('#right').click(() => {this.move(1);});
      $('#select_0').click(() => {this.SelectPhotoList(-1);});
      $('#select_1').click(() => {this.SelectPhotoList(0);});
      $('#select_2').click(() => {this.SelectPhotoList(1);});
      $('#select_3').click(() => {this.SelectPhotoList(2);});
      $('#select_4').click(() => {this.SelectPhotoList(3);});
      $('#select_5').click(() => {this.SelectPhotoList(4);});
      $('#btn_home').click(() => {this.app.changeView('Home');});
      
    } else if(this.state === STATE.SUBPHOTO) {
      
      $('#debug')
        .empty().show()
        .append('<button id="left">left</button>')
        .append('<button id="right">right</button>')
        .append('<br /><br />')
        .append('<button id="select_0">select_0</button>')
        .append('<button id="select_1">select_1</button>')
        .append('<button id="select_2">select_2</button>')
        .append('<button id="select_3">select_3</button>')
        .append('<button id="select_4">select_4</button>')
        .append('<br /><br />')
        .append('<button id="btn_home">Home</button>')
        .append('<button id="btn_photolist">PHOTOLIST</button>');
      
      $('#left').click(() => {this.subMove(-1);});
      $('#right').click(() => {this.subMove(1);});
      $('#select_0').click(() => {this.SelectSubPhotoList(-1);});
      $('#select_1').click(() => {this.SelectSubPhotoList(0);});
      $('#select_2').click(() => {this.SelectSubPhotoList(1);});
      $('#select_3').click(() => {this.SelectSubPhotoList(2);});
      $('#select_4').click(() => {this.SelectSubPhotoList(3);});

      $('#btn_home').click(() => {this.app.changeView('Home');});
      $('#btn_photolist').click(() => {this.Back();});
      
    } else if(this.state === STATE.FULLPHOTO) {
      
      $('#debug')
        .empty().show()
        .append('<button id="left">left</button>')
        .append('<button id="right">right</button>')
        .append('<br /><br />')
        .append('<button id="btn_home">Home</button>')
        .append('<button id="btn_subphotolist">SUBPHOTOLIST</button>');
      
      $('#left').click(() => {this.fullMove(-1);});
      $('#right').click(() => {this.fullMove(1);});

      $('#btn_home').click(() => {this.app.changeView('Home');});
      $('#btn_subphotolist').click(() => {this.Back();});
      
    }
    
  }

  setValue(_data) {
    
    this.props = {
      
      PhotoList : [],
      
      Index : 0,
      
      SubPhotoList : [],
      
      SubIndex : 0
      
    };
    
    for (let i = 0; i < _data.length; i++) {
      
      this.props.PhotoList[i] = {
        
        name : _data[i].album,
        image : new Image(),
        isNewTag : _data[i].isNewTag,
        left : 330 + (420) * i
        
      }
      
      this.props.PhotoList[i].image.src = _data[i].image;
      this.props.PhotoList[i].image.addEventListener('load', this.onResourceLoaded, false);
      
    }
    
    this.MAX_INDEX = this.props.PhotoList.length - 4;
    
    this.Interval = null;
    
    this.isReady = true;
    
    this.wait = false;
        
  }
  
  setSubValue(_data) {
    
    this.props.SubPhotoList = [];
    this.props.SubIndex = 0;
    this.props.SubTitle = _data[0].album;
    
    for(let i = 0; i < _data.length; i++) {
      
      this.props.SubPhotoList[i] = {
        
        name : _data[i].album,
        thumb : new Image(),
        image : new Image(),
        left : 480 + (480) * i,
        fullleft : -960
        
      }
      
      this.props.SubPhotoList[i].thumb.src = _data[i].thumb;
      this.props.SubPhotoList[i].thumb.addEventListener('load', this.onResourceLoaded, false);
      
      this.props.SubPhotoList[i].image.src = _data[i].image;
      this.props.SubPhotoList[i].image.addEventListener('load', this.onResourceLoaded, false);

    }
    
    this.SUB_MAX_INDEX = this.props.SubPhotoList.length - 3;
    
    this.wait = false;
    
  }
  
  setFullValue(_index) {
    
    this.props.SubIndex = _index;
    
    for(let i = 0; i < this.props.SubPhotoList.length; i++) {

      if(i !== _index) this.props.SubPhotoList[i].fullleft = -960;
      else this.props.SubPhotoList[i].fullleft = 960;
      
    }
    
    this.wait = false;
    
  }
  
  setImage() {   
    
    this.img = {
    
      frame : new Image(),
      
    };
    
    this.img.frame.src = "/app/resource/Photo/bg_list.png";
    this.img.frame.addEventListener('load', this.onResourceLoaded, false);
    
  }
  
  Update() {
    
  }
  
  move(_direction) {

    if(this.isReady) {
      
      const nextIndex = (this.props.Index + _direction > this.MAX_INDEX || this.props.Index + _direction < 0) ? this.props.Index : this.props.Index + _direction;
      
      this.isReady = !this.isReady;
      
      if(this.Interval !== null) clearInterval(this.Interval);
      
      if(nextIndex === this.props.Index) {
        
        if(nextIndex === 0) console.log('LEFT Edge Effect');
        else console.log('RIGHT Edge Effect');
        this.isReady = !this.isReady;
          
      } else {
          
        this.Interval = setInterval(() => {
            
          if(this.props.PhotoList[nextIndex].left === 330) {
              
            clearInterval(this.Interval);
              
            this.props.Index = nextIndex;
              
            this.isReady = !this.isReady;
              
          } else {
              
            for(let i = 0 ; i < this.props.PhotoList.length; i++) {
                
              this.props.PhotoList[i].left = this.props.PhotoList[i].left - (20 * _direction);
                              
            }
              
          }
            
        } , 10 , false);
          
      }
      
    }
        
  }
  
  subMove(_direction) {
    
    if(this.isReady) {
      
      const nextIndex = (this.props.SubIndex + _direction > this.SUB_MAX_INDEX || this.props.SubIndex + _direction < 0) ? this.props.SubIndex : this.props.SubIndex + _direction;
      
      this.isReady = !this.isReady;
      
      if(this.Interval !== null) clearInterval(this.Interval);
      
      if(nextIndex === this.props.SubIndex) {
        
        if(nextIndex === 0) console.log('LEFT Edge Effect');
        else console.log('RIGHT Edge Effect');
        this.isReady = !this.isReady;
          
      } else {
          
        this.Interval = setInterval(() => {
            
          if(this.props.SubPhotoList[nextIndex].left === 480) {
              
            clearInterval(this.Interval);
              
            this.props.SubIndex = nextIndex;
              
            this.isReady = !this.isReady;
              
          } else {
              
            for(let i = 0 ; i < this.props.SubPhotoList.length; i++) {
                
              this.props.SubPhotoList[i].left = this.props.SubPhotoList[i].left - (30 * _direction);
                              
            }
              
          }
            
        } , 10 , false);
          
      }
      
    }
    
  }
  
  fullMove(_direction) {
    
    if(this.isReady) {
      
      console.log('start');
      
      this.isReady = !this.isReady;
      
      if(this.Interval !== null) clearInterval(this.Interval);
      
      let nextIndex = -1;
      
      if(_direction > 0) {
        
        nextIndex = (this.props.SubIndex + _direction > this.props.SubPhotoList.length - 1) ? 0 : this.props.SubIndex + _direction;
        this.props.SubPhotoList[nextIndex].fullleft = 2880;
        
      } else {
        
        nextIndex = (this.props.SubIndex + _direction < 0) ? this.props.SubPhotoList.length - 1 : this.props.SubIndex + _direction;
        this.props.SubPhotoList[nextIndex].fullleft = -960;
        
      }
      
      if(nextIndex === -1) return;
      
      this.Interval = setInterval(() => {

        if(this.props.SubPhotoList[nextIndex].fullleft === 960) {
              
          clearInterval(this.Interval);
              
          this.props.SubIndex = nextIndex;
              
          this.isReady = !this.isReady;
          
          for(let i = 0 ; i < this.props.SubPhotoList.length; i++) {
            
            const Index = (this.props.SubIndex > this.SUB_MAX_INDEX) ? (i - this.SUB_MAX_INDEX) : (i - this.props.SubIndex);
            
            this.props.SubPhotoList[i].left = 480 + (480) * Index;
                                          
          }
          
          console.log('end');
                        
        } else {
                          
          this.props.SubPhotoList[this.props.SubIndex].fullleft = this.props.SubPhotoList[this.props.SubIndex].fullleft - (1920 * _direction);
          this.props.SubPhotoList[nextIndex].fullleft = this.props.SubPhotoList[nextIndex].fullleft - (1920 * _direction);
              
        }
            
      } , 10);
      
    }
    
  }
  
  Back() {
    
    if(this.state === STATE.PHOTOLIST) this.app.changeView('Home');
    else if(this.state === STATE.SUBPHOTO) {
      
      this.state = STATE.PHOTOLIST;
    
      this.setDebug();    
      
    } else if(this.state === STATE.FULLPHOTO) {
      
      this.props.SubIndex = (this.props.SubIndex > this.SUB_MAX_INDEX) ? this.SUB_MAX_INDEX : this.props.SubIndex;
      
      this.state = STATE.SUBPHOTO;
    
      this.setDebug();
      
    }
    
  }
  
  SelectPhotoList(_location) {
    
    if(this.props.Index + _location < 0 || this.props.Index + _location > this.props.PhotoList.length - 1) {
      
       console.log('No Item') 
      
    } else {
      
      this.subinitialize(this.props.PhotoList[this.props.Index + _location].name);
      
    }
    
  }
  
  SelectSubPhotoList(_location) {
    
    if(this.props.SubIndex + _location < 0 || this.props.SubIndex + _location > this.props.SubPhotoList.length - 1) {
      
       console.log('No Item') 
      
    } else {
      
      this.fullinitialize(this.props.SubIndex + _location);
      
    }
      
  }
  
  Render_PhotoList() {
    
    this.drawText(
      this.context,
      {title: CONSTANT.TITLE_TEXT, width: 960, height: 243, font: CONSTANT.TITLE_FONT, fillStyle: 'rgb(238, 238, 238)', textAlign: 'center'},
      {strokeStyle: '#000', lineWidth: 1}, 
      {shadowColor: 'rgba(0, 0, 0, 0.5)', shadowBlur: 5, shadowOffsetX: 0, shadowOffsetY: 3}
    );
        
    for(let i = 0 ; i < this.props.PhotoList.length; i++) {
      
      this.drawImage(this.context, this.img.frame, {cx: this.props.PhotoList[i].left, cy: 305, w: 400, h: 18}, null , null);
      this.drawImage(this.context, this.props.PhotoList[i].image, {cx: this.props.PhotoList[i].left, cy: 514, w: 400, h: 400}, CONSTANT.LIST_SHADOW);
      this.drawRect({color: 'rgba(0,0,0,0.5)', shape: {cx: this.props.PhotoList[i].left, cy: 749, w: 400, h: 70}});
      this.drawText(
        this.context,
        {title: this.props.PhotoList[i].name, width: this.props.PhotoList[i].left - 184, height: 759, font: CONSTANT.PHOTONAME_FONT, fillStyle: 'rgba(255, 255, 255, 1)', textAlign: 'left'},
      );
      
      if(this.props.PhotoList[i].isNewTag) {
        
        this.drawText(
          this.context,
          {title: 'NEW', width: this.props.PhotoList[i].left - 184, height: 348, font: CONSTANT.ISNEW_FONT, fillStyle: 'rgba(255, 255, 0, 1)', textAlign: 'left'},
        );
        
      }
      
    }
    
  }
  
  Render_SubPhoto() {
    
    this.drawText(
      this.context,
      {title: this.props.SubTitle, width: 960, height: 243, font: CONSTANT.TITLE_FONT, fillStyle: 'rgb(238, 238, 238)', textAlign: 'center'},
      {strokeStyle: '#000', lineWidth: 1}, 
      {shadowColor: 'rgba(0, 0, 0, 0.5)', shadowBlur: 5, shadowOffsetX: 0, shadowOffsetY: 3}
    );
    
    for(let i = 0 ; i < this.props.SubPhotoList.length; i++) {
      
      this.drawImage(this.context, this.props.SubPhotoList[i].thumb, {cx: this.props.SubPhotoList[i].left, cy: 550, w: 460, h: 460}, null, null);
  
    }
    
  }
  
  Render_FullPhoto() {
    
        
    for(let i = 0 ; i < this.props.SubPhotoList.length; i++) {
            
      this.drawFullImage(this.context, this.props.SubPhotoList[i].image, {cx: this.props.SubPhotoList[i].fullleft, cy: 540, w: 1920, h: 1440}, null , null);
      
    }
    
  }
  
  Render() {
  
    if(!this.wait) {
  
      this.drawRect({color: '#202020', shape: {cx: 960, cy: 540, w: 1920, h: 1080}}); // BG
      
      if(this.state === STATE.PHOTOLIST) this.Render_PhotoList();
      else if(this.state === STATE.SUBPHOTO) this.Render_SubPhoto();
      else if(this.state === STATE.FULLPHOTO) this.Render_FullPhoto();
      
      this.outside.Render();
      this.effect.Render();
      this.effectLock.Render();
    
    }
    
  }
  
  trigger(_eventName, _id, _hit) {
    
    console.log(_eventName + ' - ' + _id);

    if (_eventName === '[매니저] 언락유저의 우선권이 생김') {
      
      if (_id === 'TL') this.effect.selectEffect(30, 30); 
      else if (_id === 'BL') this.effect.selectEffect(30, 1050); 
      else if (_id === 'L') this.effect.selectEffect(540, 1050, () => {
        
        if (this.state === STATE.PHOTOLIST) this.move(-1);
        else if (this.state === STATE.SUBPHOTO) this.subMove(-1);
        else if (this.state === STATE.FULLPHOTO) this.fullMove(-1);
        
      }); 
      else if (_id === 'R') this.effect.selectEffect(1380, 1050, () => {
        
        if (this.state === STATE.PHOTOLIST) this.move(1);
        else if (this.state === STATE.FULLPHOTO) this.fullMove(1);
        
      });  
      else if (_id === 'TR') this.effect.selectEffect(1890, 30);  
      else if (_id === 'BR') this.effect.selectEffect(1890, 1050); 
      else if (_id === 'B') this.effect.selectEffect(960, 1050); 
      else if (_id === 'DISPLAY') {
        
        if (_hit.id === 'DISPLAY') {
          
          const x = _hit.point.x * 1920;
          const y = _hit.point.y * 1080;
          
          if (this.state === STATE.PHOTOLIST) {
            
            if (x > 120 && x < 540 && y > 240 && y < 840) this.effect.selectEffect(330, 550); 
            else if (x > 540 && x < 960 && y > 240 && y < 840) this.effect.selectEffect(750, 550); 
            else if (x > 960 && x < 1380 && y > 240 && y < 840) this.effect.selectEffect(1170, 550); 
            else if (x > 1380 && x < 1800 && y > 240 && y < 840) this.effect.selectEffect(1590, 550); 
          
          } else if (this.state === STATE.SUBPHOTO) {
            
            if (x > 210 && x < 710 && y > 240 && y < 840) this.effect.selectEffect(480, 550);       
            else if (x > 710 && x < 1210 && y > 240 && y < 840) this.effect.selectEffect(960, 550); 
            else if (x > 1210 && x < 1710 && y > 240 && y < 840) this.effect.selectEffect(1440, 550); 
            
          }
          
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
      
      if (_id === 'BL') this.Back();
      else if (_id === 'L') {
        
        if (this.state === STATE.PHOTOLIST) this.move(-1);
        else if (this.state === STATE.SUBPHOTO) this.subMove(-1);
        else if (this.state === STATE.FULLPHOTO) this.fullMove(-1);
        
      }
      else if (_id === 'R') {
       
        if (this.state === STATE.PHOTOLIST) this.move(1);
        else if (this.state === STATE.FULLPHOTO) this.fullMove(1);
      
      }
      else if (_id === 'DISPLAY') {
        
        const x = _hit.point.x * 1920;
        const y = _hit.point.y * 1080;
        
        if (this.isDrag) {
          
          
        } else {
          
          if (this.state === STATE.PHOTOLIST) {
            
            if (x > 120 && x < 540 && y > 240 && y < 840) this.SelectPhotoList(0);      
            else if (x > 540 && x < 960 && y > 240 && y < 840) this.SelectPhotoList(1);
            else if (x > 960 && x < 1380 && y > 240 && y < 840) this.SelectPhotoList(2);
            else if (x > 1380 && x < 1800 && y > 240 && y < 840) this.SelectPhotoList(3);

          } else if (this.state === STATE.SUBPHOTO) {
            
            if (x > 210 && x < 710 && y > 240 && y < 840) this.SelectSubPhotoList(0);      
            else if (x > 710 && x < 1210 && y > 240 && y < 840) this.SelectSubPhotoList(1);
            else if (x > 1210 && x < 1710 && y > 240 && y < 840) this.SelectSubPhotoList(2);
            
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

export default Photo;
