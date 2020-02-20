const {app, BrowserWindow} = require('electron');

let mainWindow;

const debug = (process.argv.indexOf("--debug")>=0)

app.on('ready', createWindow);
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
      app.quit();
    }
});

function createWindow(){
    mainWindow = new BrowserWindow({
        width: 280,
        height: 110,
        transparent: true,
        frame: false,
        useContentSize: true,
        resizable: false,
        title: "EMPlayer!"
    });

    mainWindow.loadURL(__dirname + "/index.html");

    if (debug) {
        mainWindow.webContents.openDevTools();
        mainWindow.maximize();
    }

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}