import React, { ReactElement } from 'react';
import { MenuItem } from '@blueprintjs/core';
import { Suggest, ItemRenderer, ItemPredicate } from '@blueprintjs/select';

interface CustomSuggest {
  inputId: string;
  selectedItem: string;
  items: string[];
  isDisabled?: boolean;
  className?: string;
  updateSelectedItem: (newItem: string) => void;
}

const CustomSuggest = ({
  inputId,
  selectedItem,
  items,
  isDisabled = false,
  className,
  updateSelectedItem
}: CustomSuggest): ReactElement => {
  const onItemSelect = (newItem: string) => {
    updateSelectedItem(newItem);
  };

  const filterItems: ItemPredicate<string> = (query, item) => {
    return item.toLocaleLowerCase().includes(query.toLocaleLowerCase());
  };

  const renderSelectItems: ItemRenderer<string> = (
    item,
    { handleClick, modifiers }
  ) => {
    return (
      <MenuItem
        key={item}
        text={item}
        active={modifiers.active}
        onClick={handleClick}
      />
    );
  };

  return (
    <Suggest
      items={items}
      resetOnQuery={false}
      disabled={isDisabled}
      className={className}
      selectedItem={selectedItem}
      inputValueRenderer={item => item}
      itemRenderer={renderSelectItems}
      itemPredicate={filterItems}
      popoverProps={{
        minimal: true,
        usePortal: false,
        popoverClassName: className
      }}
      inputProps={{ id: inputId }}
      onItemSelect={onItemSelect}
      noResults={<MenuItem disabled={true} text="No results." />}
    />
  );
};

export default CustomSuggest;
