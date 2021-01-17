import React, { ReactElement } from 'react';
import { Intent, Button } from '@blueprintjs/core';

interface PaginationButtonInterface {
  text: string | number;
  onClick: () => void;
  intent?: Intent;
  disabled?: boolean;
}

const PaginationButton = ({
  text,
  onClick,
  intent = Intent.PRIMARY,
  disabled
}: PaginationButtonInterface): ReactElement => {
  return (
    <Button
      text={text}
      onClick={onClick}
      intent={intent}
      disabled={disabled}
      className="footer_pagination_page-button"
    />
  );
};

export default PaginationButton;
