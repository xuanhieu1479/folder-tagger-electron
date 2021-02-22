import { BrowserWindow } from 'electron';
import { IpcEvent } from '../../common/enums/commonEnums';
import { showContinueConfirmation } from '../../utilities/utilityFunctions';

const onOpenSetting = (): void => {
  BrowserWindow.getFocusedWindow()?.webContents.send(IpcEvent.OpenSetting);
};

const calculateTagRelations = (): void => {
  const focusedWindow = BrowserWindow.getFocusedWindow();
  if (!focusedWindow) return;
  const userAgrees = showContinueConfirmation(focusedWindow);
  if (!userAgrees) return;
  focusedWindow.webContents.send(IpcEvent.CalculateTagRelations);
};

export { onOpenSetting, calculateTagRelations };
