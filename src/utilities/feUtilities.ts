import { remote } from 'electron';
import { AxiosError } from 'axios';
import { Position, Toaster, Intent } from '@blueprintjs/core';

const { app, BrowserWindow } = remote;
const successTimeout = 1000;
const infoTimeout = 5000;
const errorTimeout = 2500;

const toaster = Toaster.create({
  position: Position.TOP
});
const showMessage = {
  info: (message: string): string =>
    toaster.show({ intent: Intent.PRIMARY, message, timeout: infoTimeout }),
  success: (message: string): string =>
    toaster.show({ intent: Intent.SUCCESS, message, timeout: successTimeout }),
  error: (error: Error | string): string => {
    let errorMessage = error.toString();
    if (typeof error === 'string') errorMessage = error;
    else if (error instanceof Error) {
      if ((error as AxiosError).isAxiosError) {
        const { response, request, message } = error as AxiosError;
        // Error returns from back end
        if (response) errorMessage = response.data.message;
        // Request was made, but no response returned
        else if (request) errorMessage = request.toString();
        // If worse comes to worst
        else errorMessage = message;
      } else errorMessage = error.message;
    }

    return toaster.show({
      intent: Intent.DANGER,
      message: errorMessage,
      timeout: errorTimeout
    });
  }
};

const getAppLocation = (): string => {
  return app.getAppPath();
};

const reload = (): void => {
  BrowserWindow.getFocusedWindow()?.reload();
};

export { showMessage, getAppLocation, reload };
