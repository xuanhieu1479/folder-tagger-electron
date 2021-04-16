import {
  Folder,
  Tag,
  ManagedTag,
  TagRelations,
  BreakDownTagType
} from './commonInterfaces';
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
  managedTags: ManagedTag[];
  clipboard: Tag[];
  relations: TagRelations;
}
interface SettingReducer {
  defaultValue: SettingDefaultValue;
  shortcut: SettingShortcut;
  clipboard: Record<BreakDownTagType, string>;
}

interface SettingDefaultValue {
  defaultSearchParams: string;
  defaultExternalProgram: string;
  isSearchRandomly: string;
  defaultCategory: string;
  defaultLanguage: string;
}
interface SettingShortcut {
  openFolderInExternalProgram: string;
  openFolderInExplorer: string;
  renameFolder: string;
  addTagsToFolder: string;
  editTagsOfFolder: string;
  removeTagsFromFolder: string;
  focusSearchInput: string;
}

interface DialogContext {
  onOpenFolderDialog: (dialogType: TagAction) => void;
  onOpenClipboardDialog: () => void;
  onOpenRenameOmnibar: () => void;
}
interface DirectoryContext {
  onOpenFolderInExplorer: () => void;
  onOpenFolderInExternalProgram: () => void;
  onRemoveFolders: () => void;
}
interface FunctionsContext {
  dialog: DialogContext;
  directory: DirectoryContext;
}

interface CommonDialog {
  isOpen: boolean;
  onClose: () => void;
}

export {
  RootState,
  ReducerAction,
  StatusReducer,
  FolderReducer,
  TagReducer,
  SettingReducer,
  SettingDefaultValue,
  SettingShortcut,
  FunctionsContext,
  CommonDialog
};
