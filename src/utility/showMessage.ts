import { Position, Toaster, Intent } from '@blueprintjs/core';

const toaster = Toaster.create({
  position: Position.TOP
});

const showMessage = {
  info: (message: string): string =>
    toaster.show({ intent: Intent.PRIMARY, message }),
  success: (message: string): string =>
    toaster.show({ intent: Intent.SUCCESS, message }),
  error: (message: string): string =>
    toaster.show({ intent: Intent.DANGER, message })
};

export default showMessage;
