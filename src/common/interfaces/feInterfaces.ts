import { Folder, Tag, TagRelations } from './commonInterfaces';
import { TagAction } from '../enums/commonEnums';

interface RootState {
  status: StatusReducer;
  folder: FolderReducer;
  tag: TagReducer;
  setting: SettingReducer;
}

interface ReducerAction {
  type: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any;
}

interface StatusReducer {
  isLoading: boolean;
  isDialogOpen: boolean;
  isRandom: boolean;
}
interface FolderReducer {
  selectedFolders: string[];
  foldersList: Folder[];
  totalFolders: number;
  categories: string[];
  languages: string[];
}
interface TagReducer {
  allTags: Tag[];
  relations: TagRelations;
  clipboard: Tag[];
}
// For the moment Setting only consists of default values.
// But it probably will be expanded soon.
type SettingReducer = SettingDefaultValue;
interface SettingDefaultValue {
  defaultCategory: string;
  defaultLanguage: string;
}

interface DialogContext {
  onOpenFolderDialog: (dialogType: TagAction) => void;
  onOpenClipboardDialog: () => void;
}
interface DirectoryContext {
  onOpenFolderLocation: () => void;
  onPassSelectedFolderToExternalProgram: () => void;
}
interface FunctionsContext {
  dialog: DialogContext;
  directory: DirectoryContext;
}

export {
  RootState,
  ReducerAction,
  StatusReducer,
  FolderReducer,
  TagReducer,
  SettingReducer,
  SettingDefaultValue,
  FunctionsContext
};
