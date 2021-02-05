import React, { ReactElement, ReactNode } from 'react';
import { MenuItem } from '@blueprintjs/core';
import { MultiSelect, ItemRenderer } from '@blueprintjs/select';
import './styles/CustomMultiSelect.styled.scss';

interface CustomMultiSelectInterface {
  itemKey: string;
  allItems: Array<string>;
  selectedItems: Array<string>;
  updateSelectedItems: (
    itemKey: string,
    newSelectedItems: Array<string>
  ) => void;
}

const CustomMultiSelect = ({
  itemKey,
  allItems,
  selectedItems,
  updateSelectedItems
}: CustomMultiSelectInterface): ReactElement => {
  const onItemSelect = (item: string): void => {
    if (selectedItems.includes(item))
      updateSelectedItems(
        itemKey,
        selectedItems.filter(t => t !== item)
      );
    else updateSelectedItems(itemKey, [...selectedItems, item]);
  };
  const onRemoveItem = (item: ReactNode): void => {
    updateSelectedItems(
      itemKey,
      selectedItems.filter(t => t !== item)
    );
  };
  const onCreatItem = (query: string) => {
    return query;
  };

  const renderSelectItems: ItemRenderer<string> = (
    item,
    { modifiers, handleClick }
  ) => {
    return (
      <MenuItem
        key={item}
        text={item}
        active={modifiers.active}
        onClick={handleClick}
        icon={selectedItems.includes(item) ? 'small-tick' : 'blank'}
      />
    );
  };
  const renderCreateItems = (
    query: string,
    active: boolean,
    handleClick: React.MouseEventHandler<HTMLElement>
  ) => (
    <MenuItem
      icon="add"
      text={`Create "${query}" tag`}
      active={active}
      onClick={handleClick}
    />
  );

  return (
    <MultiSelect
      fill={true}
      resetOnSelect={true}
      items={allItems}
      selectedItems={selectedItems}
      itemRenderer={renderSelectItems}
      onItemSelect={onItemSelect}
      createNewItemRenderer={renderCreateItems}
      createNewItemFromQuery={onCreatItem}
      tagRenderer={item => item}
      tagInputProps={{ onRemove: onRemoveItem }}
      popoverProps={{
        minimal: true,
        popoverClassName: 'custom-multi-select_popover'
      }}
      openOnKeyDown={true}
    />
  );
};

export default CustomMultiSelect;
