import { createContext } from 'react';
import { TAG_ACTION } from '../../common/enums/commonEnums';

interface DialogContext {
  onOpenFolderDialog: (dialogType: TAG_ACTION) => void;
}
interface FunctionsContext {
  dialog: DialogContext;
}

const defaultContextValue: FunctionsContext = {
  dialog: { onOpenFolderDialog: () => undefined }
};
const FunctionsContext = createContext(defaultContextValue);

export default FunctionsContext;
