import { Folder } from './commonInterfaces';

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
}
interface FolderReducerInterface {
  selectedFolders: Array<string>;
  foldersList: Array<Folder>;
  totalFolders: number;
  categories: Array<string>;
  languages: Array<string>;
}
interface TagReducerInterface {
  artist: Array<string>;
  group: Array<string>;
  parody: Array<string>;
  character: Array<string>;
  genre: Array<string>;
}
// For the moment Setting only consists of default values.
// But it probably will be expanded soon.
type SettingReducerInterface = SettingDefaultValueInterface;

interface SettingDefaultValueInterface {
  defaultCategory: string;
  defaultLanguage: string;
}

interface WrapperComponentInterface {
  children: React.ReactElement;
}

export {
  RootState,
  ReducerAction,
  WrapperComponentInterface,
  StatusReducerInterface,
  FolderReducerInterface,
  TagReducerInterface,
  SettingReducerInterface,
  SettingDefaultValueInterface
};
