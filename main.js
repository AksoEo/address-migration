const { app, dialog, ipcMain, BrowserWindow } = require('electron');
const path = require('path');

let win;
const createWindow = () => {
    if (win) return;
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            sandbox: false,
        }
    });

    win.loadFile('index.html');
};

app.whenReady().then(() => {
    createWindow();

    ipcMain.on('load-file', (event) => {
        const files = dialog.showOpenDialogSync(win, {
            properties: ['openFile'],
            filters: [
                { name: 'Adresoj', extensions: ['addrs'] },
            ]
        });
        event.returnValue = files ? files[0] : null;
    });
});
