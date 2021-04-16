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
    onOpenFolderInExternalProgram: () => undefined,
    onRemoveFolders: () => undefined
  }
};
const FunctionsContext = createContext(defaultContextValue);

export default FunctionsContext;
