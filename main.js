console.log("main process working");

const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require("path");
const url = require("url");

let win;

function createWindow(){
  win = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true
    },
    width: 1200,
    height: 1000,
    show: false,
    icon: __dirname + '/assets/icons/winicon.ico'
  });
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file',
    slashes: true
  }));

  win.once('ready-to-show', () =>{
    win.show();
  });

  win.on('close', () =>{
    win = null;
  });

  //win.webContents.openDevTools();

}

app.on('ready', createWindow);

//for macOS
app.on('window-all-closed', () => {
  if(process.platform !== 'darwin'){
    app.quit();
  }
});

app.on('activate', () => {
  if(win === null){
    createWindow();
  }
});
