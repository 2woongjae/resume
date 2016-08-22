const CONSOLE_STYLE = 'color: red';

const CONSTANT = {
  AREA_LOCK: {
    TL: {X: 480, Y: 540}, BR: {X: 1440, Y: 1080}
  },
  RESOLUTION: {W: 1920, H: 1080}
};


class User {

  constructor(_index, _manager) {
   
    this.index = _index;
    this.manager = _manager;
    
    this.vtouch = null;
    
    this.isTracking = null;
    this.isRight = null;
    this.trigger = null;
    
    this.isHitOnDisplayFromLock = false;
    this.isHitOnDisplayFromUnlock = false;
    
    this.isHitOnLockFromLock = false;
    
    this.isHitOnLL = false;
    this.isHitOnRL = false;
    this.isHitOnHUMIDIFIER = false;
    this.isHitOnFAN = false;
    this.isHitOnFIREWALL = false;
    this.isHitOnTHERMO = false;
    this.isHitOnCCTV = false;
    
    this.select = null;
    
  }
        
  update(_vtouch) {

    // 1. 기본 데이터 입력
    const vtouch = _vtouch;
    
    this.vtouch = vtouch;

    // 2. 트래킹 처리
    if (this.isTracking) {

      if (!vtouch.isTracking) console.log(`%c[유저] 화각에 사라짐 : ${this.index}`, CONSOLE_STYLE);

    } else {

      if (vtouch.isTracking) {

        if (this.isTracking === null) console.log(`%c[유저] 처음부터 화각에 있음 ${this.index}`, CONSOLE_STYLE);
        else console.log(`%c[유저] 화각에 나타남 : ${this.index}`, CONSOLE_STYLE);

      }

    }

    this.isTracking = vtouch.isTracking;
    
    if (this.isTracking) {
      
      this.isHitOnDisplayFromLock = this.getIsHitOnDisplayFromLock(vtouch);
      this.isHitOnDisplayFromUnlock = this.getIsHitOnDisplayFromUnlock(vtouch);
      
      this.isHitOnLL = this.getIsHitOnDeviceFromUnlock(vtouch, 'LL');
      this.isHitOnRL = this.getIsHitOnDeviceFromUnlock(vtouch, 'RL');
      this.isHitOnHUMIDIFIER = this.getIsHitOnDeviceFromUnlock(vtouch, 'HUMIDIFIER');
      this.isHitOnFAN = this.getIsHitOnDeviceFromUnlock(vtouch, 'FAN');
      this.isHitOnFIREWALL = this.getIsHitOnDeviceFromUnlock(vtouch, 'FIREWALL');
      this.isHitOnTHERMO = this.getIsHitOnDeviceFromUnlock(vtouch, 'THERMO');
      this.isHitOnCCTV = this.getIsHitOnDeviceFromUnlock(vtouch, 'CCTV');
      
      this.trigger = vtouch.vision_state;
      
    } else {
      
      this.outOfSensor();
      
    }
    
    if (this.isHitOnDisplayFromLock) {
      
      this.isHitOnLockFromLock = this.getIsHitOnLockFromLock(vtouch);
      
    } else {
      
      this.isHitOnLockFromLock = false;
      
    }
    
    if (this.isHitOnDisplayFromUnlock || this.isHitOnLL || this.isHitOnRL || this.isHitOnHUMIDIFIER || this.isHitOnFAN || this.isHitOnFIREWALL || this.isHitOnTHERMO || this.isHitOnCCTV) {
      
      this.select = this.getSelect(vtouch);
      
    }

    return Promise.resolve();
            
  }
  
  outOfSensor() {
    
    this.isRight = null;
    this.trigger = null;
    
    this.isHitOnDisplayFromLock = false;
    this.isHitOnDisplayFromUnlock = false;
    
    this.isHitOnLL = false;
    this.isHitOnRL = false;
    this.isHitOnHUMIDIFIER = false;
    this.isHitOnFAN = false;
    this.isHitOnFIREWALL = false;
    this.isHitOnTHERMO = false;
    this.isHitOnCCTV = false;
    
  }
  
  getIsHitOnDisplayFromLock(_vtouch) {
    
    let isHit = false;
    
    if (_vtouch.right.isHit) {
      
      if (_vtouch.right.id === 'DISPLAY'
        || _vtouch.right.id === 'DRAG'
        || _vtouch.right.id === 'T'
        || _vtouch.right.id === 'TR' 
        || _vtouch.right.id === 'R' 
        || _vtouch.right.id === 'BR' 
        || _vtouch.right.id === 'B' 
        || _vtouch.right.id === 'BL' 
        || _vtouch.right.id === 'L' 
        || _vtouch.right.id === 'TL') 
        isHit = true;
      
    }
    
    if (_vtouch.left.isHit) {
      
      if (_vtouch.left.id === 'DISPLAY'
        || _vtouch.left.id === 'DRAG'
        || _vtouch.left.id === 'T'
        || _vtouch.left.id === 'TR' 
        || _vtouch.left.id === 'R' 
        || _vtouch.left.id === 'BR' 
        || _vtouch.left.id === 'B' 
        || _vtouch.left.id === 'BL' 
        || _vtouch.left.id === 'L' 
        || _vtouch.left.id === 'TL') 
        isHit = true;
      
    }
    
    return isHit;
    
  }
  
  getIsHitOnLockFromLock(_vtouch) {
    
    let isHit = false;
    
    if (this.isRight === null) {
    
      if (_vtouch.right.isHit) {
        
        if (_vtouch.right.id === 'B') {
        
          isHit = true;   
            
        } else if (_vtouch.right.id === 'DISPLAY') {
            
          const point = _vtouch.right.point;
          
          if (CONSTANT.AREA_LOCK.TL.X <= Math.round(point.x * CONSTANT.RESOLUTION.W)
            && Math.round(point.x * CONSTANT.RESOLUTION.W) <= CONSTANT.AREA_LOCK.BR.X
            && CONSTANT.AREA_LOCK.TL.Y <= Math.round(point.y * CONSTANT.RESOLUTION.H)
            && Math.round(point.y * CONSTANT.RESOLUTION.H) <= CONSTANT.AREA_LOCK.BR.Y) isHit = true;
            
        }
        
      }
      
      if (_vtouch.left.isHit) {
        
        if (_vtouch.left.id === 'B') {
        
          isHit = true;   
            
        } else if (_vtouch.left.id === 'DISPLAY') {
            
          const point = _vtouch.left.point;
          
          if (CONSTANT.AREA_LOCK.TL.X <= Math.round(point.x * CONSTANT.RESOLUTION.W)
            && Math.round(point.x * CONSTANT.RESOLUTION.W) <= CONSTANT.AREA_LOCK.BR.X
            && CONSTANT.AREA_LOCK.TL.Y <= Math.round(point.y * CONSTANT.RESOLUTION.H)
            && Math.round(point.y * CONSTANT.RESOLUTION.H) <= CONSTANT.AREA_LOCK.BR.Y) isHit = true;
            
        }
        
      }
      
    }
    
    return isHit;
    
  }
  
  getIsHitOnDisplayFromUnlock(_vtouch) {
    
    let isHit = false;
    
    if (this.isRight !== null) {
    
      if (this.isRight) {
        
        if (_vtouch.right.isHit) {
              
          if (_vtouch.right.id === 'DISPLAY'
            || _vtouch.right.id === 'DRAG'
            || _vtouch.right.id === 'T'
            || _vtouch.right.id === 'TR' 
            || _vtouch.right.id === 'R' 
            || _vtouch.right.id === 'BR' 
            || _vtouch.right.id === 'B' 
            || _vtouch.right.id === 'BL' 
            || _vtouch.right.id === 'L' 
            || _vtouch.right.id === 'TL') isHit = true;
      
        }
        
      } else {
        
        if (_vtouch.left.isHit) {
                
          if (_vtouch.left.id === 'DISPLAY'
            || _vtouch.left.id === 'DRAG'
            || _vtouch.left.id === 'T'
            || _vtouch.left.id === 'TR' 
            || _vtouch.left.id === 'R' 
            || _vtouch.left.id === 'BR' 
            || _vtouch.left.id === 'B' 
            || _vtouch.left.id === 'BL' 
            || _vtouch.left.id === 'L' 
            || _vtouch.left.id === 'TL') isHit = true;
          
        }
        
      }
      
    }
    
    return isHit;
    
  }
  
  getIsHitOnDeviceFromUnlock(_vtouch, _id) {
    
    let isHit = false;
    
    if (this.isRight !== null) {
    
      if (this.isRight) {
        
        if (_vtouch.right.isHit) {
        
          if (_vtouch.right.id === _id) isHit = true;
        
        }
        
      } else {
        
        if (_vtouch.left.isHit) {
                
          if (_vtouch.left.id === _id) isHit = true;
          
        }
        
      }
      
    }
    
    return isHit;
    
  }
  
  getSelect(_vtouch) {
    
    const hit = (this.isRight) ? _vtouch.right : _vtouch.left;
    
    if (hit.isHit) {
     
      if (hit.id === 'T'
        || hit.id === 'TR' 
        || hit.id === 'R' 
        || hit.id === 'BR' 
        || hit.id === 'B' 
        || hit.id === 'BL' 
        || hit.id === 'L' 
        || hit.id === 'TL'
        || hit.id === 'LL'
        || hit.id === 'RL'
        || hit.id === 'HUMIDIFIER'
        || hit.id === 'FAN'
        || hit.id === 'FIREWALL'
        || hit.id === 'THERMO'
        || hit.id === 'CCTV') {
          
        return hit.id;
      
      } else if (hit.id === 'DISPLAY') {
        
        const x = hit.point.x * CONSTANT.RESOLUTION.W;
        const y = hit.point.y * CONSTANT.RESOLUTION.H;
        
        if (x > 330 && x < 750 && y >= 840) return 'L';
        else if (x > 1170 && x < 1590 && y >= 840) return 'R';
        else if (x >= 750 && x <= 1170 && y >= 840) return 'B';
        else if (x > 330 && x < 1590 && y <= 240) return 'T';
        else if (x <= 330 && y >= 840) return 'BL';
        else if (x >= 1590 && y >= 840) return 'BR';
        else if (x <= 330 && y <= 240) return 'TL';
        else if (x >= 1590 && y <= 240) return 'TR';
        else return 'DISPLAY';
        
      } else if (hit.id === 'DRAG') {
        
        return 'DISPLAY';
        
      }
      
    } else {
      
      return null;
      
    }
    
  }

  setIsRight = () => {

    // B 또는 DISPLAY 를 히트한 것은 전제되어 있다.

    if (this.isRight !== null) {
      
      console.error('setIsRight 주안이 이미 설정되어 있음.');

      return;

    }

    if (this.vtouch.right.isHit && this.vtouch.left.isHit) {

      const right = this.vtouch.right;
      const left = this.vtouch.left;

      const distance = {right: 0, left: 0};

      if (right.id === 'DISPLAY') {

        distance.right = (right.point.x - 0.5 > 0) ? (right.point.x - 0.5) * 1920 : (0.5 - right.point.x) * 1920;

      } else if (right.id === 'B') {

        distance.right = (right.point.x - 0.5 > 0) ? (right.point.x - 0.5) * 420 : (0.5 - right.point.x) * 420;

      }

      if (left.id === 'DISPLAY') {

        distance.left = (left.point.x - 0.5 > 0) ? (left.point.x - 0.5) * 1920 : (0.5 - left.point.x) * 1920;

      } else if (left.id === 'B') {

        distance.left = (left.point.x - 0.5 > 0) ? (left.point.x - 0.5) * 420 : (0.5 - left.point.x) * 420;

      }

      if (distance.right <= distance.left) this.isRight = true;
      else this.isRight = false;

    } else if (this.vtouch.right.isHit) {

      this.isRight = true;

    } else if (this.vtouch.left.isHit) {

      this.isRight = false;

    } else {

      console.error('setIsRight 주안을 설정해야하는데 히트가 없다.');

      return;

    }

    console.log('setIsRight 주안이 다음과 같이 결정 : ' + this.isRight);

  }
  
}

export default User;
