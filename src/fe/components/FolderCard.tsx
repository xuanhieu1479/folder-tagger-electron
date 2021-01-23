import { remote } from 'electron';
import React, { ReactElement, MouseEvent } from 'react';
import { Card, Tooltip } from '@blueprintjs/core';
import { ASSET } from '../../common/variables/commonVariables';
import { showMessage } from '../../utility/showMessage';
import './styles/FolderCard.styled.scss';

const { app } = remote;
const defaultThumbnail = `${app.getAppPath()}\\.webpack\\renderer\\${
  ASSET.DIRECTORY
}\\default-thumbnail.jpg`;

interface FolderCardInterface {
  id: string;
  folderLocation: string;
  thumbnailLocation?: string;
  folderName: string;
  onClick: (event: MouseEvent, folderLocation: string) => void;
  isBeingSelected: boolean;
}

const FolderCard = ({
  id,
  folderLocation,
  thumbnailLocation,
  folderName,
  onClick,
  isBeingSelected
}: FolderCardInterface): ReactElement => {
  const onClickCardName = () => {
    navigator.clipboard.writeText(folderName);
    showMessage.info('Copied to clipboard!');
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
