import React, { ReactElement } from 'react';
import { MenuItem } from '@blueprintjs/core';
import { Suggest, ItemRenderer, ItemPredicate } from '@blueprintjs/select';

interface DialogSuggestInterface {
  selectedItem: string;
  items: Array<string>;
  updateSelectedItem: (newItem: string) => void;
}

const DialogSuggest = ({
  selectedItem,
  items,
  updateSelectedItem
}: DialogSuggestInterface): ReactElement => {
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
      selectedItem={selectedItem}
      inputValueRenderer={item => item}
      itemRenderer={renderSelectItems}
      itemPredicate={filterItems}
      popoverProps={{ minimal: true }}
      onItemSelect={onItemSelect}
      noResults={<MenuItem disabled={true} text="No results." />}
    />
  );
};

export default DialogSuggest;
