import Device from './Device';

class LeftLight extends Device {

  constructor(_manager) {

    super(_manager);

    this._select = 'RL';

  }

  toggle = () => {
      
    this._manager.iot.light('LIGHT R');
    
  }

}

export default LeftLight;