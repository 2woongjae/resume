import io from 'socket.io-client';
import * as Constant from '../Constant';

const CONSTANT = Constant.Iot;

const CONSOLE_STYLE = 'color: pink';

class Iot {

  constructor(_manager) {
    
    this.manager = _manager;
    
    this.data = null;
     
  }
  
  run() {
     
    this._socket = io(CONSTANT.SERVER_HOST);

    this._socket.on('connect', function () {

      console.log('%c[Iot] 연결', CONSOLE_STYLE);

    });

    this._socket.on('items', (data) => {
    
      this.data = data;

      console.log(this.data);

    });

    this._socket.on('disconnect', function () {

      console.log('%c[Iot] 연결 해제', CONSOLE_STYLE);

    });

  }

  light(_name) {
    
    let index = null;
      
    if (_name === 'LIGHT L') { // LeftLight
        
      this.data.forEach((light, i) => {
          
        if (light.name === 'LeftLight') index = i;
          
      });
                
    } else if (_name === 'LIGHT R') { // RightLight
        
      this.data.forEach((light, i) => {
          
        if (light.name === 'RightLight') index = i;
          
      });
        
    }
    
    if (index === null) {
        
      console.log('%c[Iot] 오류 : 등록되지 않은 전구');
      
      return;
        
    }
    
    const state = (this.data[index].state === 0) ? 1 : 0;
      
    /*
      * state 0 : OFF
      * state 1 : ON
    */
    this._socket.emit('control', index, state);
      
  }

  plug(_name) {
    
    let index = null;
      
    if (_name === 'Humidifier') { // Humidifier
        
      this.data.forEach((plug, i) => {
          
        if (plug.name === 'Humidifier') index = i;
          
      });
                
    } else if (_name === 'Fan') { // Fan
        
      this.data.forEach((plug, i) => {
          
        if (plug.name === 'Fan') index = i;
          
      });
        
    }
    
    if (index === null) {
        
      console.log('%c[Iot] 오류 : 등록되지 않은 플러그');
      
      return;
        
    }
    
    const state = (this.data[index].state === 0) ? 1 : 0;
      
    /*
      * state 0 : OFF
      * state 1 : ON
    */
    this._socket.emit('control', index, state);
      
  }

  stove(_state) {
    
    let index = null;
              
    this.data.forEach((light, i) => {
          
      if (light.name === 'FireWall') index = i;
          
    });

    if (index === null) {
        
      console.log('%c[Iot] 오류 : 등록되지 않은 스토브');
      
      return;
        
    }
 
    const step = (this.data[index].state === 3) ? 0 : this.data[index].state + 1; 

    const state = (_state !== undefined) ? _state : step;
      
    /*
      * state 0 : OFF
      * state 1 : 1단계
      * state 2 : 2단계
      * state 3 : 3단계
    */
    this._socket.emit('control', index, state);
      
  }
  
  getLight(_name) {
      
    let index = null;
      
    if (_name === 'LIGHT L') { // LeftLight
        
      this.data.forEach((light, i) => {
          
        if (light.name === 'LeftLight') index = i;
          
      });
                
    } else if (_name === 'LIGHT R') { // RightLight
        
      this.data.forEach((light, i) => {
          
        if (light.name === 'RightLight') index = i;
          
      });
        
    }
    
    if (index !== null) {
        
      return (this.data[index].state === 1);
        
    } else {
        
      console.log('%c[Iot] 오류 : 등록되지 않은 전구');
        
    }
      
  }

  getPlug(_name) {
      
    let index = null;
      
    if (_name === 'Fan') { // Fan
        
      this.data.forEach((plug, i) => {
          
        if (plug.name === 'Fan') index = i;
          
      });
                
    } else if (_name === 'Humidifier') { // Humidifier
        
      this.data.forEach((plug, i) => {
          
        if (plug.name === 'Humidifier') index = i;
          
      });
        
    }
    
    if (index !== null) {
        
      return (this.data[index].state === 1);
        
    } else {
        
      console.log('%c[Iot] 오류 : 등록되지 않은 플러그');
        
    }
      
  }

  getStove() {
      
    let index = null;
              
    this.data.forEach((plug, i) => {
          
      if (plug.name === 'FireWall') index = i;
          
    });

    if (index !== null) {
        
      return this.data[index].state;
        
    } else {
        
      console.log('%c[Iot] 오류 : 등록되지 않은 플러그');
        
    }
      
  }

}

export default Iot;