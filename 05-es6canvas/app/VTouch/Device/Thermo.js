import Device from './Device';

class Thermo extends Device {

  constructor(_manager) {

    super(_manager);

    this._select = 'THERMO';
    
  }

  toggle = () => {
  
    this._manager.app.changeView('Thermo');
    
  }

}

export default Thermo;