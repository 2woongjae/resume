import Device from './Device';

class LeftLight extends Device {

  constructor(_manager) {

    super(_manager);

    this._select = 'LL';

  }

  toggle = () => {
  
    this._manager.iot.light('LIGHT L');
    
  }

}

export default LeftLight;