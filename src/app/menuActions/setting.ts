import { BrowserWindow } from 'electron';
import { IPC_EVENT } from '../../common/variables/commonVariables';

const onOpenSetting = (): void => {
  BrowserWindow.getFocusedWindow()?.webContents.send(IPC_EVENT.OPEN_SETTING);
};

export { onOpenSetting };
