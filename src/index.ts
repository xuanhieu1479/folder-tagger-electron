import path from 'path';
import { app, BrowserWindow, Menu, protocol } from 'electron';
import 'reflect-metadata';
import installExtention, { REDUX_DEVTOOLS } from 'electron-devtools-installer';
import { getConnection } from 'typeorm';
import 'source-map-support/register';
import _ from 'lodash';
import { APP } from './common/variables/commonVariables';
import initBE from './be/be';
import { menuTemplate, initDirectory } from './app/app';
import { logErrors } from './be/logging';

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  // eslint-disable-line global-require
  app.quit();
}

const initWindows = (): void => {
  const startUpTimeOut = setTimeout(() => {
    app.quit();
  }, APP.START_UP_TIMEOUT);

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
      enableRemoteModule: true,
      webSecurity: false
    }
  });
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  mainWindow.once('ready-to-show', async () => {
    initDirectory();
    await initApp();
    splashWindow.destroy();
    mainWindow.show();
    clearTimeout(startUpTimeOut);
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  customizeProtocol();
  if (process.env.NODE_ENV === 'development')
    await installExtention(REDUX_DEVTOOLS);
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
  if (_.isEmpty(BrowserWindow.getAllWindows())) {
    initWindows();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
const initApp = async () => {
  await initBE();
  Menu.setApplicationMenu(menuTemplate);
};

/**
 * To make electron allows loading local files.
 */
const customizeProtocol = () => {
  protocol.registerFileProtocol('file', (request, callback) => {
    let pathname = request.url;
    try {
      pathname = decodeURI(request.url.replace('file:///', ''));
    } catch (error) {
      // There are some odd cases like special characters (ex: %)
      // do not get encoded automatically (wtf?) so decodeURI fails
      // because % is supposed to be %25 which it's not, or images with #
      // in name does not load on production (another wtf).
      // And many more undiscovered bugs...
      logErrors(error.message, error.stack);
    } finally {
      callback(pathname);
    }
  });
};
