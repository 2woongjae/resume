class Device {

  constructor(_manager) {

    this._manager = _manager;

    this._priority = -1;
    this._isHit = false;
    this._select = null;

  }

  trigger = () => {

    // LeftLight 에 우선권이 없으면, 우선권을 체크하고 설정 
    if (this._priority === -1) {
      
      const priority = this.getPriority();
      
      if (priority > -1) this._priority = priority;
                  
    } else { // LeftLight 에 우선권이 있으면, 트리거에 따라 액션이 일어남

      // 화각에 언락 유저가 있으면 그 언락 유저중 LeftLight 에 히트하고 있는지 체크
      this._isHit = this.getIsHit();      
      
      if (this._isHit) {
        
        if (this._manager.users[this._priority].select === this._select) {
          
          if (this._manager.users[this._priority].trigger === 'C') {

            this.action(`[${this._select}] 언락유저의 우선권이 사라짐 : 컴펌 성공`);
        
            this._priority = -1;

          } else if (this._manager.users[this._priority].trigger === 'N') {
          
            this.action(`[${this._select}] 언락유저의 우선권이 사라짐 : 취소`);
            this._priority = -1;
        
          } else if (this._manager.users[this._priority].trigger === 'S') {
          
            this.action(`[${this._select}] 언락유저의 우선권이 있는 상태에서 한번 더 셀렉트`);
        
          } else {
            
            this.action(`[${this._select}] 언락유저의 우선권이 있는 상태에서 그대로`);
            
          }
        
        } else {
          
          this.action(`[${this._select}] 언락유저의 우선권이 사라짐 : 영역에서 나감`);
          this._priority = -1;
          
        }
        
      } else {
        
        this.action(`[${this._select}] 언락유저의 우선권이 사라짐 : 영역에서 나감`);
        this._priority = -1;
        
      }
      
    }

    return Promise.resolve();

  }

  getIsHit = () => {
    
    let isHit = false;

    //if (this._manager.isTrackingFromUnlock) {
    
    this._manager.users.forEach(user => {
      
      if (user.isRight !== null) {
      
        if (user['isHitOn' + this._select]) isHit = true;
      
      }
      
    });

    //}
    
    return isHit;
    
  }

  getPriority = () => {

    let isSelect = -1;
    
    this._manager.users.forEach((user, index) => {
      
      if (user['isHitOn' + this._select]) {
      
        if (user.trigger === 'S') isSelect = index;
      
      }
      
    });
    
    return isSelect;

  }

  action(_eventName) {
    
    console.log(_eventName);
      
    if (_eventName === `[${this._select}] 언락유저의 우선권이 사라짐 : 컴펌 성공`) {
      
      this.toggle();
       
    }
    
  }

  toggle = () => {

    console.error("Device toggle 오버라이딩 필요.");

  }

}

export default Device;