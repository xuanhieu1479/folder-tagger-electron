import { BrowserWindow } from 'electron';
import { IPC_EVENT } from '../../common/enums/commonEnums';

const onOpenSetting = (): void => {
  BrowserWindow.getFocusedWindow()?.webContents.send(IPC_EVENT.OPEN_SETTING);
};

const calculateTagsRelation = (): void => {
  BrowserWindow.getFocusedWindow()?.webContents.send(
    IPC_EVENT.CALCULATE_TAGS_RELATION
  );
};

export { onOpenSetting, calculateTagsRelation };
