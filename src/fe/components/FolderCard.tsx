import { remote } from 'electron';
import React, { ReactElement } from 'react';
import { Card, Tooltip } from '@blueprintjs/core';
import { ASSET } from '../../common/variables/commonVariables';
import showMessage from '../../utility/showMessage';
import './styles/FolderCard.styled.scss';

const { app } = remote;
const defaultThumbnail = `${app.getAppPath()}\\.webpack\\renderer\\${
  ASSET.DIRECTORY
}\\default-thumbnail.jpg`;

interface FolderCardInterface {
  thumbnailLocation?: string;
  folderName: string;
  onClickImage?: () => void;
}

const FolderCard = ({
  thumbnailLocation,
  folderName,
  onClickImage
}: FolderCardInterface): ReactElement => {
  const onClickCardName = () => {
    navigator.clipboard.writeText(folderName);
    showMessage.info('Copied to clipboard!');
  };

  return (
    <Card interactive={true} className="folder-card-container">
      <figure className="folder-card-content">
        <img
          src={thumbnailLocation || defaultThumbnail}
          className="folder-card-thumbnail"
          onClick={onClickImage}
        />
        <figcaption
          className="folder-card-name bp3-text-large"
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
