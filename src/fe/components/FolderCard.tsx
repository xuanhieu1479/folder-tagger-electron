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
  const { shortcut } = useSelector((state: RootState) => state.setting);
  const context = useContext(FunctionsContext);
  const { dialog, directory } = context;
  const isBeingSelectedRef = useRef(isBeingSelected);
  const selectedFoldersRef = useRef(selectedFolders);
  const shortcutRef = useRef(shortcut);

  useEffect(() => {
    const folderCardElement = document.getElementById(id);
    if (folderCardElement) {
      folderCardElement.oncontextmenu = event => {
        if (!isBeingSelectedRef.current) addToSelectedList(folderLocation);
        ContextMenu.show(
          createElement(CustomContextMenu, {
            selectedFolders: selectedFoldersRef.current,
            shortcut: shortcutRef.current,
            dialog,
            directory
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
    selectedFoldersRef.current = selectedFolders;
    shortcutRef.current = shortcut;
  }, [isBeingSelected, selectedFolders, shortcut]);

  const onClickCardName = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    navigator.clipboard.writeText(folderName);
    showMessage.info(MESSAGE.COPY_TO_CLIPBOARD);
    if (!selectedFolders.includes(folderLocation))
      addToSelectedList(folderLocation);
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
        <figcaption className="folder-card_footer">
          <Tooltip content="Click to copy" minimal={true}>
            <div
              className="folder-card_name bp3-text-large"
              onClick={onClickCardName}
            >
              {folderName}
            </div>
          </Tooltip>
        </figcaption>
      </figure>
    </Card>
  );
};

export default FolderCard;
