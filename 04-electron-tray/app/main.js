import {app, BrowserWindow, Menu, Tray} from 'electron';
import io from 'socket.io-client';
import fs from 'fs';
import child_process from 'child_process';

const data = JSON.parse(fs.readFileSync(`${__dirname}/data.json`));

let mainWindow = null;
let appIcon = null;
let socket = null;

function reboot() {

    child_process.exec("C:\\Windows\\System32\\shutdown.exe /r /f /t 0", (error, stdout, stderr) => {
        
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
        
        if (error !== null) console.log('exec error: ' + error);
    
    });

}

function setTray(args) {

  console.log(args);

  return new Promise((resolve, reject) => {

    appIcon = new Tray(`${__dirname}/icon.png`);

    const contextMenu = Menu.buildFromTemplate([

      {
        label: '설정 열기',
        type: 'normal',
        click: () => {

          if (mainWindow !== null) {

            mainWindow.focus();

            return;

          }

          mainWindow = new BrowserWindow({width: 600, height: 600});
          mainWindow.loadURL(`${__dirname}/index.html`);
          mainWindow.webContents.openDevTools();
                
          mainWindow.on('closed', function () {
                    
            mainWindow = null; 
                
          });

        }
      },
      {
        type: 'separator'
      },
      {
        label: '종료',
        type: 'normal',
        click: () => {

          app.quit();

        }
      }

    ]);

    appIcon.setToolTip('VTouch System Manager');
    appIcon.setContextMenu(contextMenu);

    resolve('setTray');

  });

}

function createSocket(args) {

  console.log(args);

  return new Promise((resolve, reject) => {

    if (data.auto) {

      socket = io(data.host, {query: {type: data.type}});

      socket.on('connect', () => {console.log('connect');});
      socket.on('disconnect', () => {console.log('disconnect');});
      socket.on('shutdown', () => {reboot();});

      resolve('createSocket true');

    } else {

      resolve('createSocket false');

    }

  });

}

let t = 0;

function sync(local, remote, callback) {

  console.log('sync : ' + t++);

  child_process.exec(`aws s3 sync ${local} ${remote} --exclude "*.*" --include "*.json"`, (error, stdout, stderr) => {
        
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
        
    if (error !== null) console.log('exec error: ' + error);
    
    if (callback !== undefined) callback();

  });

}

function setSync(args) {

  console.log(args);

  return new Promise((resolve, reject) => {

    if (data.sync) {

      sync(data.local, data.remote, () => {

        child_process.execSync(`del ${data.local}\\*.json`);

      });

      setInterval(() => {

        sync(data.local, data.remote);

      }, data.time);

      resolve('setSync true');

    } else {

      resolve('setSync false');

    }

  });

}

function ready() {

  Promise.resolve('ready start')
         .then(setTray)
         .then(createSocket)
         .then(setSync)
         .then(e => console.log(e), err => console.log(err));

}

app.on('ready', ready);

app.on('window-all-closed', () => {console.log('window-all-closed');});