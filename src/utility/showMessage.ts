import { Position, Toaster, Intent } from '@blueprintjs/core';

const toaster = Toaster.create({
  position: Position.TOP
});
const successTimeout = 1000;
const infoTimeout = 5000;
const errorTimeout = 2500;

const showMessage = {
  info: (message: string): string =>
    toaster.show({ intent: Intent.PRIMARY, message, timeout: infoTimeout }),
  success: (message: string): string =>
    toaster.show({ intent: Intent.SUCCESS, message, timeout: successTimeout }),
  error: (message: string): string =>
    toaster.show({ intent: Intent.DANGER, message, timeout: errorTimeout })
};

export { showMessage };
