import { Folder, Tags, TagRelations } from './commonInterfaces';

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
}
interface FolderReducer {
  selectedFolders: Array<string>;
  foldersList: Array<Folder>;
  totalFolders: number;
  categories: Array<string>;
  languages: Array<string>;
}
interface TagReducer {
  allTags: Array<Tags>;
  relations: TagRelations;
  clipboard: Array<Tags>;
}
// For the moment Setting only consists of default values.
// But it probably will be expanded soon.
type SettingReducer = SettingDefaultValue;

interface SettingDefaultValue {
  defaultCategory: string;
  defaultLanguage: string;
}

export {
  RootState,
  ReducerAction,
  StatusReducer,
  FolderReducer,
  TagReducer,
  SettingReducer,
  SettingDefaultValue
};
