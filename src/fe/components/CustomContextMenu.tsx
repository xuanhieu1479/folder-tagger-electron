import React, { ReactElement, createElement, useEffect } from 'react';
import { ContextMenu, Menu, MenuItem } from '@blueprintjs/core';

interface CustomContextMenuInterface {
  children: ReactElement;
}

const ContextMenuBody = () => {
  return (
    <Menu>
      <MenuItem text="Alabama" />
    </Menu>
  );
};

/**
 * Add custom context menu.
 * Be sure to set children id equals to key.
 */
const CustomContextMenu = ({
  children
}: CustomContextMenuInterface): ReactElement => {
  useEffect(() => {
    if (typeof children.key === 'string') {
      const childrenElement = document.getElementById(children.key);
      if (childrenElement !== null) {
        childrenElement.oncontextmenu = event => {
          ContextMenu.show(createElement(ContextMenuBody), {
            left: event.clientX,
            top: event.clientY
          });
        };
      }
    }
  }, []);

  return <>{children}</>;
};

export default CustomContextMenu;