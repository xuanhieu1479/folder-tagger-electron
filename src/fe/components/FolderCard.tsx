import { remote } from 'electron';
import React, {
  ReactElement,
  MouseEvent,
  useEffect,
  useRef,
  useContext,
  createElement
} from 'react';
import { Card, Tooltip, Menu, MenuItem, ContextMenu } from '@blueprintjs/core';
import { TAG_ACTION } from '../../common/enums/commonEnums';
import { MESSAGE } from '../../common/variables/commonVariables';
import FunctionsContext from '../context/FunctionsContext';
import { showMessage } from '../../utilities/feUtilities';
import './styles/FolderCard.styled.scss';

interface ContextMenuBody {
  onOpenFolderDialog: (dialogType: TAG_ACTION) => void;
}

const ContextMenuBody = ({
  onOpenFolderDialog
}: ContextMenuBody): React.ReactElement => {
  const onClickAddTags = () => onOpenFolderDialog(TAG_ACTION.ADD);
  const onClickEditTags = () => onOpenFolderDialog(TAG_ACTION.EDIT);
  const onClickRemoveTags = () => onOpenFolderDialog(TAG_ACTION.REMOVE);

  return (
    <Menu>
      <MenuItem text="Add Tags" onClick={onClickAddTags} label="Ctrl + E" />
      <MenuItem text="Edit Tags" onClick={onClickEditTags} label="Ctrl + S" />
      <MenuItem
        text="Remove Tags"
        onClick={onClickRemoveTags}
        label="Ctrl + D"
      />
    </Menu>
  );
};

interface FolderCard {
  id: string;
  folderLocation: string;
  thumbnailLocation?: string;
  folderName: string;
  onClick: (event: MouseEvent, folderLocation: string) => void;
  addToSelectedList: (folderLocation: string) => void;
  isBeingSelected: boolean;
}

const { app } = remote;
const defaultThumbnail = `${app.getAppPath()}\\.webpack\\renderer\\Asset\\default-thumbnail.jpg`;

const FolderCard = ({
  id,
  folderLocation,
  thumbnailLocation,
  folderName,
  onClick,
  addToSelectedList,
  isBeingSelected
}: FolderCard): ReactElement => {
  const context = useContext(FunctionsContext);
  const { dialog } = context;
  const { onOpenFolderDialog } = dialog;
  const isBeingSelectedRef = useRef(isBeingSelected);

  useEffect(() => {
    const folderCardElement = document.getElementById(id);
    if (folderCardElement) {
      folderCardElement.oncontextmenu = event => {
        if (!isBeingSelectedRef.current) addToSelectedList(folderLocation);
        ContextMenu.show(
          createElement(ContextMenuBody, { onOpenFolderDialog }),
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
