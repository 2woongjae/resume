import io from 'socket.io-client';

const CONSOLE_STYLE = 'color: green';

class Socket {

  constructor(_manager) {
    
    this.manager = _manager;
     
  }
  
  run() {
     
    this._socket = io('http://localhost:3000');

    this._socket.on('connect', function () {

      console.log('%c[소켓] 연결', CONSOLE_STYLE);

    });

    this._socket.on('update', (vtouch, info) => {

      //디버깅
      //console.log(vtouch);

      this.manager.update({vtouchs: vtouch, info: info});

    });

    this._socket.on('disconnect', function () {

      console.log('%c[소켓] 연결 해제', CONSOLE_STYLE);

    });

  }

  cancel(_id) {

    this._socket.emit('cancel', _id);

  }
  

}

export default Socket;
