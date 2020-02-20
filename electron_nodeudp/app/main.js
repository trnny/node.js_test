const {app, BrowserWindow, ipcMain} = require('electron');
let win;
let windowConfig = {
    width:800,
    height:600,
    minWidth: 600,
    minHeight: 480,
    useContentSize: true
};
function createWindow(){

    ipcMain.on("app.quit",(event) => {
        app.quit();
    });

    win = new BrowserWindow(windowConfig);
    // win.webContents.openDevTools();
    win.loadURL(`file://${__dirname}/view.html`);
    win.on('close',() => {
        win = null;
    });
    // win.webContents.executeJavaScript(`
    //     document.getElementById("quit").onclick = function(){
    //         require("electron").ipcRenderer.send("app.quit");
    //     }
    // `)
}

app.on('ready',createWindow);
app.on('window-all-closed',() => {
    app.quit();
});

app.on('activate',() => {
    if(win == null){
        createWindow();
    }
})