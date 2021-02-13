import { createContext } from 'react';
import { TagAction } from '../../common/enums/commonEnums';

interface DialogContext {
  onOpenFolderDialog: (dialogType: TagAction) => void;
}
interface FunctionsContext {
  dialog: DialogContext;
}

const defaultContextValue: FunctionsContext = {
  dialog: { onOpenFolderDialog: () => undefined }
};
const FunctionsContext = createContext(defaultContextValue);

export default FunctionsContext;
