import { Folder, Tags, TagRelations } from './commonInterfaces';

interface RootState {
  status: StatusReducerInterface;
  folder: FolderReducerInterface;
  tag: TagReducerInterface;
  setting: SettingReducerInterface;
}

interface ReducerAction {
  type: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any;
}

interface StatusReducerInterface {
  isLoading: boolean;
  isDialogOpen: boolean;
}
interface FolderReducerInterface {
  selectedFolders: Array<string>;
  foldersList: Array<Folder>;
  totalFolders: number;
  categories: Array<string>;
  languages: Array<string>;
}
interface TagReducerInterface {
  allTags: Array<Tags>;
  relations: TagRelations;
}
// For the moment Setting only consists of default values.
// But it probably will be expanded soon.
type SettingReducerInterface = SettingDefaultValueInterface;

interface SettingDefaultValueInterface {
  defaultCategory: string;
  defaultLanguage: string;
}

export {
  RootState,
  ReducerAction,
  StatusReducerInterface,
  FolderReducerInterface,
  TagReducerInterface,
  SettingReducerInterface,
  SettingDefaultValueInterface
};
