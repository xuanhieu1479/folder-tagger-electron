import { dialog, BrowserWindow } from 'electron';

const showContinueConfirmation = (focusedWindow: BrowserWindow): boolean => {
  let choice;
  if (focusedWindow)
    choice = dialog.showMessageBoxSync(focusedWindow, {
      type: 'warning',
      buttons: ['No', 'Yes'],
      defaultId: 0,
      title: 'Confirmation',
      message:
        'This action might take a long time. Are you sure you want to continue?',
      cancelId: 0
    });
  return choice === 1;
};

export { showContinueConfirmation };
