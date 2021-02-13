import { BrowserWindow } from 'electron';
import { IpcEvent } from '../../common/enums/commonEnums';

const onOpenSetting = (): void => {
  BrowserWindow.getFocusedWindow()?.webContents.send(IpcEvent.OpenSetting);
};

const calculateTagsRelation = (): void => {
  BrowserWindow.getFocusedWindow()?.webContents.send(
    IpcEvent.CalculateTagRelations
  );
};

export { onOpenSetting, calculateTagsRelation };
