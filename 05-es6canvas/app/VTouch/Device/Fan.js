import Device from './Device';

class Fan extends Device {

  constructor(_manager) {

    super(_manager);

    this._select = 'FAN';
    
  }

  toggle = () => {
  
    this._manager.iot.plug('Fan');
    
  }

}

export default Fan;