import React, { ReactElement } from 'react';
import { MenuItem } from '@blueprintjs/core';
import { Suggest, ItemRenderer, ItemPredicate } from '@blueprintjs/select';

interface CustomSuggestInterface {
  selectedItem: string;
  items: Array<string>;
  isDisabled?: boolean;
  className?: string;
  updateSelectedItem: (newItem: string) => void;
}

const CustomSuggest = ({
  selectedItem,
  items,
  isDisabled = false,
  className,
  updateSelectedItem
}: CustomSuggestInterface): ReactElement => {
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
      onItemSelect={onItemSelect}
      noResults={<MenuItem disabled={true} text="No results." />}
    />
  );
};

export default CustomSuggest;
