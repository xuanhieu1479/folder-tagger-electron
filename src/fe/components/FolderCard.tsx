import React, {
  ReactElement,
  MouseEvent,
  useEffect,
  useRef,
  useContext,
  createElement
} from 'react';
import { useSelector } from 'react-redux';
import { Card, Tooltip, ContextMenu } from '@blueprintjs/core';
import { RootState } from '../../common/interfaces/feInterfaces';
import { MESSAGE } from '../../common/variables/commonVariables';
import FunctionsContext from '../context/FunctionsContext';
import { showMessage, getAppLocation } from '../../utilities/feUtilities';
import CustomContextMenu from './CustomContextMenu';
import './styles/FolderCard.styled.scss';

interface FolderCard {
  id: string;
  folderLocation: string;
  thumbnailLocation?: string;
  folderName: string;
  onClick: (event: MouseEvent, folderLocation: string) => void;
  addToSelectedList: (folderLocation: string) => void;
  isBeingSelected: boolean;
}
const defaultThumbnail = `${getAppLocation()}\\.webpack\\renderer\\Asset\\default-thumbnail.jpg`;

const FolderCard = ({
  id,
  folderLocation,
  thumbnailLocation,
  folderName,
  onClick,
  addToSelectedList,
  isBeingSelected
}: FolderCard): ReactElement => {
  const { selectedFolders } = useSelector((state: RootState) => state.folder);
  const context = useContext(FunctionsContext);
  const { dialog } = context;
  const { onOpenFolderDialog, onOpenClipboardDialog } = dialog;
  const isBeingSelectedRef = useRef(isBeingSelected);
  const selectedFoldersRef = useRef(selectedFolders);

  useEffect(() => {
    const folderCardElement = document.getElementById(id);
    if (folderCardElement) {
      folderCardElement.oncontextmenu = event => {
        if (!isBeingSelectedRef.current) addToSelectedList(folderLocation);
        ContextMenu.show(
          createElement(CustomContextMenu, {
            selectedFolders: selectedFoldersRef.current,
            onOpenFolderDialog,
            onOpenClipboardDialog
          }),
          {
            left: event.clientX,
            top: event.clientY
          }
        );
      };
    }
  }, []);

  useEffect(() => {
    isBeingSelectedRef.current = isBeingSelected;
  }, [isBeingSelected]);
  useEffect(() => {
    selectedFoldersRef.current = selectedFolders;
  }, [selectedFolders]);

  const onClickCardName = () => {
    navigator.clipboard.writeText(folderName);
    showMessage.info(MESSAGE.COPY_FOLDER_NAME_TO_CLIPBOARD);
  };

  return (
    <Card
      id={id}
      interactive={true}
      className={`folder-card_container${isBeingSelected ? '--selected' : ''}`}
      onClick={event => onClick(event, folderLocation)}
    >
      <figure className="folder-card_content">
        <img
          src={thumbnailLocation || defaultThumbnail}
          className="folder-card_thumbnail"
        />
        <figcaption
          className="folder-card_name bp3-text-large"
          onClick={onClickCardName}
        >
          <Tooltip content="Click to copy" minimal={true}>
            {folderName}
          </Tooltip>
        </figcaption>
      </figure>
    </Card>
  );
};

export default FolderCard;
