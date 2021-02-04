import { dialog, app, BrowserWindow } from 'electron';
import fs from 'fs';
import { IPC_EVENT } from '../../common/variables/commonVariables';

const onImportData = (): void => {
  const file = dialog.showOpenDialogSync({
    title: 'Improt data',
    defaultPath: `${app.getPath('desktop')}`,
    properties: ['openFile'],
    filters: [{ name: 'JSON', extensions: ['json'] }]
  });
  if (file) {
    const json = file[0];
    const data = JSON.parse(fs.readFileSync(json).toString());
    BrowserWindow.getFocusedWindow()?.webContents.send(IPC_EVENT.IMPORT_DATA, {
      json: data
    });
  }
};

const onExportData = (): void => {
  BrowserWindow.getFocusedWindow()?.webContents.send(IPC_EVENT.EXPORT_DATA);
};

export { onImportData, onExportData };
