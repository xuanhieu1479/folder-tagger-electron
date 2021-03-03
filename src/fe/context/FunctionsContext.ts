import { createContext } from 'react';
import { FunctionsContext } from '../../common/interfaces/feInterfaces';

const defaultContextValue: FunctionsContext = {
  dialog: {
    onOpenFolderDialog: () => undefined,
    onOpenClipboardDialog: () => undefined,
    onOpenRenameOmnibar: () => undefined
  },
  directory: {
    onOpenFolderInExplorer: () => undefined,
    onOpenFolderInExternalProgram: () => undefined
  }
};
const FunctionsContext = createContext(defaultContextValue);

export default FunctionsContext;
