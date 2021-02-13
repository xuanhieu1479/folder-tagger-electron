import React, { ReactElement } from 'react';
import { Intent, Button } from '@blueprintjs/core';

interface PaginationButton {
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
}: PaginationButton): ReactElement => {
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
