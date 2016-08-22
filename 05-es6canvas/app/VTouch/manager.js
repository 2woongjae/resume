import Socket from './Socket';
import Iot from './Iot';
import User from './User';

import LeftLight from './Device/LeftLight';
import RightLight from './Device/RightLight';
import Humidifier from './Device/Humidifier';
import Fan from './Device/Fan';
import Firewall from './Device/Firewall';
import Thermo from './Device/Thermo';
import Cctv from './Device/Cctv';

const CONSOLE_STYLE = {
  DEFAULT: 'color: aqua',
  LOCK: 'color: blue',
  UNLOCK: 'color: orange',
};

const CONSTANT = {
  TRACKING_OUT_TIME: 3000
};

class Manager {

  constructor(_app) {
    
    this.app = _app;
    
    this.users = [
      new User(0, this),
      new User(1, this),
      new User(2, this),
      new User(3, this),
      new User(4, this),
      new User(5, this)
    ];  

    this.leftLight = new LeftLight(this);
    this.rightLight = new RightLight(this);
    this.humidifier = new Humidifier(this);
    this.fan = new Fan(this);
    this.firewall = new Firewall(this);
    this.thermo = new Thermo(this);
    this.cctv = new Cctv(this);

    this.isTracking = null;
    this.timeout = {
      isTracking: null
    };
    
    this.isTrackingFromLock = null;
    this.isTrackingFromUnlock = null;
    
    this.isHitOnDisplayFromLock = null;
    this.isHitOnDisplayFromUnlock = null;
    
    this.priorityOnDisplayFromLock = -1;
    this.priorityOnDisplayFromUnlock = -1;
    
    this.socket = new Socket(this);
    this.socket.run();
    
    this.iot = new Iot(this);
    this.iot.run();
    
  }

  saveData = (_vtouch) => {

    this.vtouchs = _vtouch.vtouchs;
    this.info = _vtouch.info;

    return Promise.resolve();

  }

  updateUser = () => {

    const ps = [];

    this.users.forEach((user, index) => {
      
      ps.push(user.update(this.vtouchs[index]));
      
    });

    return Promise.all(ps);

  }

  checkIsTracking = () => {
    
    const isTracking = this.getIsTracking();
    
    if (this.isTracking) {
      
      if (!isTracking) {
        
        if (this.timeout.isTracking === null) {
          
          this.timeout.isTracking = setTimeout(() => {
          
            this.timeout.isTracking = null;
            this.isTracking = false;
            this.action('[매니저] 유저(들)이 화각에서 사라짐');
         
            console.log(`%c[매니저] 유저(들)이 화각에서 사라짐`, CONSOLE_STYLE.DEFAULT);   
            
          }, CONSTANT.TRACKING_OUT_TIME);
          
        }
        
      } else {
        
        if (this.timeout.isTracking !== null) {
          
          clearTimeout(this.timeout.isTracking);
          this.timeout.isTracking = null;
         
          console.log(`%c[매니저] 유저(들)이 화각에서 사라졌다가 ${CONSTANT.TRACKING_OUT_TIME} 안에 다시 들어옴`, CONSOLE_STYLE.DEFAULT);   
            
        }
        
      }
      
    } else {
      
      if (isTracking) {
        
        if (this.isTracking === null) console.log(`%c[매니저] 유저(들)이 화각에 처음부터 존재`, CONSOLE_STYLE.DEFAULT);
        else console.log(`%c[매니저] 유저(들)이 화각에 나타남`, CONSOLE_STYLE.DEFAULT);

        this.isTracking = true;
        this.action('[매니저] 유저(들)이 화각에 나타남');

      }
      
    }

    return Promise.resolve();

  }

  checkIsTrackingType = () => {
    
    if (this.isTracking) {
      
      this.isTrackingFromLock = this.getIsTrackingFromLock();
      this.isTrackingFromUnlock = this.getIsTrackingFromUnlock();
      
    } else {
      
      this.isTrackingFromLock = false;
      this.isTrackingFromUnlock = false;
      
    }

    return Promise.resolve();

  }

  trigger_lock = () => {

    if (this.isTrackingFromLock) {
      
      this.isHitOnDisplayFromLock = this.getIsHitOnDisplayFromLock();
      
      if (this.isHitOnDisplayFromLock) this.isHitOnLockFromLock = this.getIsHitOnLockFromLock();
            
    }
    
    if (this.priorityOnDisplayFromLock > -1) {
      
      if (this.isHitOnLockFromLock) {
        
        if (this.users[this.priorityOnDisplayFromLock].trigger === 'C') {
          
          //this.users[this.priorityOnDisplayFromLock].isRight = true;
          this.users[this.priorityOnDisplayFromLock].setIsRight();
          
          this.priorityOnDisplayFromLock = -1;
                  
          this.action('[매니저] 락유저의 우선권이 사라짐 : 컴펌 성공');
        
        } else if (this.users[this.priorityOnDisplayFromLock].trigger === 'N') {
          
          this.priorityOnDisplayFromLock = -1;
        
          this.action('[매니저] 락유저의 우선권이 사라짐 : 취소');
        
        }
        
      } else {
        
        this.priorityOnDisplayFromLock = -1;
        
        this.action('[매니저] 락유저의 우선권이 사라짐 : 영역에서 나감');
        
      }
      
    } else {
      
      const priorityOnDisplayFromLock = this.getPriorityOnDisplayFromLock();
      
      if (priorityOnDisplayFromLock > -1) {
      
        this.priorityOnDisplayFromLock = priorityOnDisplayFromLock;
        
        this.action('[매니저] 락유저의 우선권이 생김');
        
      }
      
    }

    return Promise.resolve();

  }

  trigger_unlock = () => {

    if (this.isTrackingFromUnlock) this.isHitOnDisplayFromUnlock = this.getIsHitOnDisplayFromUnlock();
          
    if (this.priorityOnDisplayFromUnlock > -1) {
      
      if (this.isHitOnDisplayFromUnlock) {
        
        if (this.users[this.priorityOnDisplayFromUnlock].select === this.selectOnDisplayFromUnlock) {
          
          if (this.users[this.priorityOnDisplayFromUnlock].trigger === 'C') {
                  
            const hit = (this.users[this.priorityOnDisplayFromUnlock].isRight) ? 
                        this.users[this.priorityOnDisplayFromUnlock].vtouch.right : 
                        this.users[this.priorityOnDisplayFromUnlock].vtouch.left;

            this.action('[매니저] 언락유저의 우선권이 사라짐 : 컴펌 성공', this.selectOnDisplayFromUnlock, hit);
        
            this.priorityOnDisplayFromUnlock = -1;

          } else if (this.users[this.priorityOnDisplayFromUnlock].trigger === 'N') {
          
            this.action('[매니저] 언락유저의 우선권이 사라짐 : 취소');
            this.priorityOnDisplayFromUnlock = -1;
        
          } else if (this.users[this.priorityOnDisplayFromUnlock].trigger === 'S') {
            
            const hit = (this.users[this.priorityOnDisplayFromUnlock].isRight) ? 
                        this.users[this.priorityOnDisplayFromUnlock].vtouch.right : 
                        this.users[this.priorityOnDisplayFromUnlock].vtouch.left;
          
            this.action('[매니저] 언락유저의 우선권이 있는 상태에서 한번 더 셀렉트', this.selectOnDisplayFromUnlock, hit);
        
          } else {
            
            const hit = (this.users[this.priorityOnDisplayFromUnlock].isRight) ? 
                        this.users[this.priorityOnDisplayFromUnlock].vtouch.right : 
                        this.users[this.priorityOnDisplayFromUnlock].vtouch.left;
            
            if (hit.id === 'DRAG') {
              
              this.action('[매니저] 언락유저의 우선권이 있는 상태에서 스와이프', this.selectOnDisplayFromUnlock, hit);
              this.priorityOnDisplayFromUnlock = -1;
            
            } else
              this.action('[매니저] 언락유저의 우선권이 있는 상태에서 그대로', this.selectOnDisplayFromUnlock, hit);
            
          }
        
        } else {
          
          this.action('[매니저] 언락유저의 우선권이 사라짐 : 영역에서 나감');
          this.priorityOnDisplayFromUnlock = -1;
          
        }
        
      } else {
        
        this.action('[매니저] 언락유저의 우선권이 사라짐 : 영역에서 나감');
        this.priorityOnDisplayFromUnlock = -1;
        
      }
      
    } else {
      
      const priorityOnDisplayFromUnlock = this.getPriorityOnDisplayFromUnlock();
      
      if (priorityOnDisplayFromUnlock > -1) {
        
        const hit = this.users[priorityOnDisplayFromUnlock].isRight ? 
                    this.users[priorityOnDisplayFromUnlock].vtouch.right : 
                    this.users[priorityOnDisplayFromUnlock].vtouch.left;
                      
        if (hit.id !== 'DRAG') {
          
          this.priorityOnDisplayFromUnlock = priorityOnDisplayFromUnlock;
          this.selectOnDisplayFromUnlock = this.users[this.priorityOnDisplayFromUnlock].select;
          
          this.action('[매니저] 언락유저의 우선권이 생김', this.selectOnDisplayFromUnlock, hit);
          
        }
        
      }
      
    }

    return Promise.resolve();

  }
  
  update(_vtouch) {

    Promise.resolve(_vtouch)
           .then(this.saveData)               // 1. 멤버 프로퍼티로 저장
           .then(this.updateUser)             // 2. 브이터치 데이타를 각각의 유저에게 보내서 업데이트
           .then(this.checkIsTracking)        // 3. 한명이라도 있는지 체크
           .then(this.checkIsTrackingType)    // 4. 누군가 있으면, 락유저와 언락유저가 있는지 체크
           .then(() => {

             return Promise.all([
                              this.trigger_lock(),
                              this.trigger_unlock(),
                              this.leftLight.trigger(),
                              this.rightLight.trigger(),
                              this.humidifier.trigger(),
                              this.fan.trigger(),
                              this.firewall.trigger(),
                              this.thermo.trigger(),
                              this.cctv.trigger()
                            ]);

           });
     
  }

  getIsTracking() {
    
    let isTracking = false;
    
    this.users.forEach((user) => {
      
      if (user.isTracking) isTracking = true;
      
    });
    
    return isTracking;
    
  }
  
  getIsTrackingFromLock() {
    
    let isTracking = false;
    
    this.users.forEach((user) => {
      
      if (user.isTracking) {
      
        if (user.isRight === null) isTracking = true;
      
      }
      
    });
    
    return isTracking;
    
  }
  
  getIsTrackingFromUnlock() {
    
    let isTracking = false;
    
    this.users.forEach((user) => {
      
      if (user.isTracking) {
      
        if (user.isRight !== null) isTracking = true;
      
      }
      
    });
    
    return isTracking;
    
  }
  
  getIsHitOnDisplayFromLock() {
    
    let isHit = false;
    
    this.users.forEach(user => {
      
      if (user.isRight === null) {
      
        if (user.isHitOnDisplayFromLock) isHit = true;
      
      }
      
    });
    
    return isHit;
    
  }
  
  getIsHitOnLockFromLock() {
    
    let isHit = false;
    
    this.users.forEach(user => {
      
      if (user.isRight === null) {
      
        if (user.isHitOnLockFromLock) isHit = true;
      
      }
      
    });
    
    return isHit;
    
  }
  
  getIsHitOnDisplayFromUnlock() {
    
    let isHit = false;
    
    this.users.forEach(user => {
      
      if (user.isRight !== null) {
      
        if (user.isHitOnDisplayFromUnlock) isHit = true;
      
      }
      
    });
    
    return isHit;
    
  }
  
  getPriorityOnDisplayFromLock() {
    
    let isSelect = -1;
    
    this.users.forEach((user, index) => {
      
      if (user.isHitOnLockFromLock) {
      
        if (user.trigger === 'S') isSelect = index;
      
      }
      
    });
    
    return isSelect;
    
  }
  
  /*
    * 현재 언락인데 히트가 DISPLAY, DRAG, T, TR, R, BR, B, BL, L, TL 인 유저
    * 그  유저 중 현재 트리거가 S 인 유저 중 가장 나중 인덱스
  */
  getPriorityOnDisplayFromUnlock() {
    
    let isSelect = -1;
    
    this.users.forEach((user, index) => {
      
      if (user.isHitOnDisplayFromUnlock) {
      
        if (user.trigger === 'S') isSelect = index;
      
      }
      
    });
    
    return isSelect;
    
  }
  
  action(_eventName, _id, _hit) {
    
    if (_eventName === '[매니저] 유저(들)이 화각에 나타남') {
      
      this.app.state.appearUser();
      
    } else if (_eventName === '[매니저] 유저(들)이 화각에서 사라짐') {
      
      this.app.state.disappearUser();
      
    } else if (_eventName === '[매니저] 언락유저의 우선권이 생김' || 
               _eventName === '[매니저] 언락유저의 우선권이 사라짐 : 영역에서 나감' || 
               _eventName === '[매니저] 언락유저의 우선권이 사라짐 : 취소' || 
               _eventName === '[매니저] 언락유저의 우선권이 사라짐 : 컴펌 성공' || 
               _eventName === '[매니저] 언락유저의 우선권이 있는 상태에서 한번 더 셀렉트' ||
               _eventName === '[매니저] 언락유저의 우선권이 있는 상태에서 스와이프' ||
               _eventName === '[매니저] 언락유저의 우선권이 있는 상태에서 그대로') {
      
      this.app.state.trigger(_eventName, _id, _hit);
      
    } else if (_eventName === '[매니저] 락유저의 우선권이 생김' ||
               _eventName === '[매니저] 락유저의 우선권이 사라짐 : 영역에서 나감' || 
               _eventName === '[매니저] 락유저의 우선권이 사라짐 : 취소' || 
               _eventName === '[매니저] 락유저의 우선권이 사라짐 : 컴펌 성공' || 
               _eventName === '[매니저] 락유저의 우선권이 있는 상태에서 한번 더 셀렉트' ||
               _eventName === '[매니저] 락유저의 우선권이 있는 상태에서 그대로') {
      
      this.app.state.triggerLock(_eventName);
      
    }
    
  }
  
  power_off() {
    
    this.users.forEach(user => {
      
      user.isRight = null;
      
    });
    
  }
  
  cancel() {
    
    /*
    if (this.priorityOnDisplayFromUnlock > -1) {console.log(this.priorityOnDisplayFromUnlock);
      
      this.socket.cancel(this.priorityOnDisplayFromUnlock);
      this.priorityOnDisplayFromUnlock = -1;
       
    }
    */
    
  }

}

export default Manager;
