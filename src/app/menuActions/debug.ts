import { BrowserWindow, shell } from 'electron';

const onOpenDevtool = (): void => {
  // Get webContents from focusedWindow instead of getFocusedWebContents
  // to avoid weird bugs like app freezing, request not detected in
  // chrome devtool, alert no server found even though it is running.
  // *Note: Idk why
  const focusedWebContents = BrowserWindow.getFocusedWindow()?.webContents;
  if (!focusedWebContents) return;
  focusedWebContents.isDevToolsOpened()
    ? focusedWebContents.closeDevTools()
    : focusedWebContents.openDevTools();
};

const onReload = (): void => {
  BrowserWindow.getFocusedWindow()?.reload();
};

const onOpenAppDirectory = (): void => {
  shell.openPath(process.cwd());
};

export { onOpenDevtool, onReload, onOpenAppDirectory };
