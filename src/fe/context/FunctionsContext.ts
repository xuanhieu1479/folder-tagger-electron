import { createContext } from 'react';

interface DialogContextInterface {
  onOpenFolderDialog: (dialogType: string) => void;
}
interface FunctionsContext {
  dialog: DialogContextInterface;
}

const defaultContextValue: FunctionsContext = {
  dialog: { onOpenFolderDialog: () => undefined }
};
const FunctionsContext = createContext(defaultContextValue);

export default FunctionsContext;
