import React, { ReactElement, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axiosConfig from './config/axiosConfig';
import { FolderFilterParams } from '../common/interfaces/commonInterfaces';
import { RootState } from '../common/interfaces/feInterfaces';
import { PAGINATION, ELEMENT_ID } from '../common/variables/commonVariables';
import { initIpcEventListeners, clearIpcEventListerners } from './app/ipcEvent';
import { SettingDialog, ManageTagsDialog } from './components/commonComponents';
import FoldersDisplay from './modules/foldersDisplay/FoldersDisplay';
import { generateTagsFromSearchKeywords } from '../utilities/feUtilities';
import { onOpenDialog, onCloseDialog } from './redux/status/statusAction';
import {
  getCategories,
  getLanguages,
  getFolders
} from './redux/folder/folderAction';
import { loadTagRelations } from './redux/tag/tagAction';
import { getSettings } from './redux/setting/settingAction';

axiosConfig();
let count = 0;

const App = (): ReactElement => {
  const dispatch = useDispatch();
  const { defaultValue } = useSelector((state: RootState) => state.setting);
  const [params, setParams] = useState(PAGINATION.DEFAULT);
  const [searchKeywords, setSearchKeywords] = useState('');
  const [isSettingDialogOpen, setSettingDialogOpen] = useState(false);
  const [isManageTagsDialogOpen, setManageTagsDialogOpen] = useState(false);
  const [isSettingsLoaded, setSettingsLoaded] = useState(false);
  const [isFirstRender, setFirstRender] = useState(true);
  const [refreshCount, setRefreshCount] = useState(count);

  useEffect(() => {
    const onSuccessGetSettings = (defaultValue: {
      category?: string;
      language?: string;
    }) => {
      updateParams({
        category: defaultValue.category || undefined,
        language: defaultValue.language || undefined
      });
      setSettingsLoaded(true);
    };

    initIpcEventListeners(
      dispatch,
      onOpenSettingDialog,
      onOpenManageTagsDialog,
      refreshFolders
    );
    getCategories(dispatch);
    getLanguages(dispatch);
    getSettings(dispatch, onSuccessGetSettings);
    loadTagRelations(dispatch);

    return () => {
      clearIpcEventListerners();
    };
  }, []);

  const getNewFolders = async (defaultSearchKeywords?: string) => {
    const tags = generateTagsFromSearchKeywords(
      defaultSearchKeywords || searchKeywords
    );
    await getFolders(dispatch, { ...params, tags });
    document
      .getElementById(ELEMENT_ID.FOLDER_CARD_CONTAINER)
      ?.scrollTo({ top: 0 });
  };

  useEffect((): void => {
    if (!isSettingsLoaded) return;

    const { defaultSearchParams, isSearchRandomly } = defaultValue;
    const isRandom = isSearchRandomly.toLowerCase() === 'yes';
    if (isFirstRender) {
      setFirstRender(false);
      if (defaultSearchParams) setSearchKeywords(defaultSearchParams);
      if (isRandom) {
        updateParams({ isRandom });
        // Updating params will make this useEffect run again,
        // so stop here.
        return;
      }
      getNewFolders(defaultSearchParams);
    } else getNewFolders();
  }, [params, isSettingsLoaded, refreshCount]);

  const updateParams = (newParams: Partial<FolderFilterParams>): void => {
    setParams({ ...params, ...newParams });
  };
  const onChangeSearchKeywords = (event: React.FormEvent<HTMLInputElement>) => {
    setSearchKeywords(event.currentTarget.value);
  };
  const refreshFolders = () => {
    setSearchKeywords('');
    setParams(PAGINATION.DEFAULT);
    setRefreshCount((count += 1));
  };

  const onOpenSettingDialog = () => {
    setSettingDialogOpen(true);
    onOpenDialog(dispatch);
  };
  const onCloseSettingDialog = () => {
    setSettingDialogOpen(false);
    onCloseDialog(dispatch);
  };

  const onOpenManageTagsDialog = () => {
    setManageTagsDialogOpen(true);
    onOpenDialog(dispatch);
  };
  const onCloseManageTagsDialog = () => {
    setManageTagsDialogOpen(false);
    onCloseDialog(dispatch);
  };

  return (
    <>
      {isSettingsLoaded ? (
        <FoldersDisplay
          params={params}
          updateParams={updateParams}
          getNewFolders={getNewFolders}
          searchKeywords={searchKeywords}
          onChangeSearchKeywords={onChangeSearchKeywords}
          openSettingDialog={onOpenSettingDialog}
        />
      ) : null}
      <SettingDialog
        isOpen={isSettingDialogOpen}
        onClose={onCloseSettingDialog}
      />
      <ManageTagsDialog
        isOpen={isManageTagsDialogOpen}
        onClose={onCloseManageTagsDialog}
      />
    </>
  );
};

export default App;
