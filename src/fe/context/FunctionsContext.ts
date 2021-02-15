import { createContext } from 'react';
import { FunctionsContext } from '../../common/interfaces/feInterfaces';

const defaultContextValue: FunctionsContext = {
  dialog: {
    onOpenFolderDialog: () => undefined,
    onOpenClipboardDialog: () => undefined
  },
  directory: {
    onOpenFolderLocation: () => undefined,
    onPassSelectedFolderToExternalProgram: () => undefined
  }
};
const FunctionsContext = createContext(defaultContextValue);

export default FunctionsContext;
