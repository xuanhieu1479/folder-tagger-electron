import { BrowserWindow } from 'electron';

const onOpenDevtool = (): void => {
  // Get webContents from focusedWindow instead of getFocusedWebContents
  // to avoid weird bugs like app freezing, request not detected in
  // chrome devtool, alert no server found even though it is running.
  // *Note: Idk why
  BrowserWindow.getFocusedWindow()?.webContents.openDevTools();
};

export { onOpenDevtool };
