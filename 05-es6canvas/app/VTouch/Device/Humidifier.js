import Device from './Device';

class Humidifier extends Device {

  constructor(_manager) {

    super(_manager);

    this._select = 'HUMIDIFIER';

  }

  toggle = () => {
  
    this._manager.iot.plug('Humidifier');
    
  }

}

export default Humidifier;