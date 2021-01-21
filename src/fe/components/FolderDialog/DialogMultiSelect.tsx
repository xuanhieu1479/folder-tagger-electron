import React, { ReactElement, ReactNode } from 'react';
import { MenuItem } from '@blueprintjs/core';
import { MultiSelect, ItemRenderer } from '@blueprintjs/select';

interface DialogMultiSelectInterface {
  selectedItems: Array<string>;
  items: Array<string>;
  updateSelectedItems: (newItems: Array<string>) => void;
}

const DialogMultiSelect = ({
  selectedItems,
  items,
  updateSelectedItems
}: DialogMultiSelectInterface): ReactElement => {
  const onItemSelect = (newItem: string): void => {
    if (selectedItems.includes(newItem))
      updateSelectedItems(selectedItems.filter(i => i !== newItem));
    else updateSelectedItems([...selectedItems, newItem]);
  };

  const onRemoveTag = (value: ReactNode): void => {
    updateSelectedItems(selectedItems.filter(i => i !== value));
  };

  const renderSelectItems: ItemRenderer<string> = (item, { handleClick }) => {
    return (
      <MenuItem
        key={item}
        text={item}
        onClick={handleClick}
        icon={selectedItems.includes(item) ? 'small-tick' : 'blank'}
      />
    );
  };

  return (
    <MultiSelect
      fill={true}
      selectedItems={selectedItems}
      itemRenderer={renderSelectItems}
      items={items}
      onItemSelect={onItemSelect}
      tagRenderer={item => item}
      tagInputProps={{ onRemove: onRemoveTag }}
      popoverProps={{ minimal: true }}
    />
  );
};

export default DialogMultiSelect;
