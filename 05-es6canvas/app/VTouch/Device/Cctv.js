import Device from './Device';

class Cctv extends Device {

  constructor(_manager) {

    super(_manager);

    this._select = 'CCTV';
    
  }

  toggle = () => {
  
    this._manager.app.changeView('Cctv');
    
  }

}

export default Cctv;