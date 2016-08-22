import Device from './Device';

class Firewall extends Device {

  constructor(_manager) {

    super(_manager);

    this._select = 'FIREWALL';
    
  }

  toggle = () => {
  
    this._manager.iot.stove();
    
  }

}

export default Firewall;