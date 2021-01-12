import path from 'path';
import { app, BrowserWindow, Menu } from 'electron';
import 'reflect-metadata';
import { getConnection } from 'typeorm';
import 'source-map-support/register';
import initBE from './be/be';
import { menuTemplate } from './app/app';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const MAIN_WINDOW_WEBPACK_ENTRY: any;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  // eslint-disable-line global-require
  app.quit();
}

const initWindows = (): void => {
  const splashWindow = new BrowserWindow({
    height: 300,
    width: 600,
    frame: false
  });
  splashWindow.loadFile(path.resolve(__dirname, './splash.html'));

  const mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true
    }
  });
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  mainWindow.once('ready-to-show', async () => {
    await initApp();
    splashWindow.destroy();
    mainWindow.show();
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  initWindows();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', async () => {
  try {
    await getConnection().close();
  } finally {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    initWindows();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
const initApp = async () => {
  await initBE();
  Menu.setApplicationMenu(menuTemplate);
};
