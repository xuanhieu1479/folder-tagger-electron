import React, { ReactElement, ReactNode, useState, useEffect } from 'react';
import _ from 'lodash';
import { MenuItem } from '@blueprintjs/core';
import { MultiSelect, ItemRenderer, ItemPredicate } from '@blueprintjs/select';
import { BreakDownTagType } from '../../common/interfaces/commonInterfaces';
import { MESSAGE } from '../../common/variables/commonVariables';
import { showMessage } from '../../utilities/feUtilities';
import './styles/CustomMultiSelect.styled.scss';

interface CustomMultiSelect {
  inputId: string;
  itemKey: BreakDownTagType;
  allItems: string[];
  selectedItems: string[];
  onSelectItem: (itemKey: BreakDownTagType, selectedItem: string) => void;
  onRemoveItem: (itemKey: BreakDownTagType, removedItem: string) => void;
}
interface PopoverProps {
  minimal: boolean;
  isOpen?: boolean;
  popoverClassName: string;
}
const noSpecialCharactersRegex = new RegExp(/[^A-Za-z0-9\s]/g);

const CustomMultiSelect = ({
  inputId,
  itemKey,
  allItems,
  selectedItems,
  onSelectItem,
  onRemoveItem
}: CustomMultiSelect): ReactElement => {
  const [inputValue, setInputvalue] = useState('');
  const [popoverProps, setPopoverProps] = useState<PopoverProps>({
    minimal: true,
    popoverClassName: 'custom-multi-select_popover'
  });

  useEffect(() => {
    // Do not check !popoverProps.isOpen since we need to set it
    // undefined to make tagInput becomes uncontrolled again.
    if (popoverProps.isOpen === false)
      setPopoverProps(_.omit(popoverProps, 'isOpen'));
  }, [popoverProps]);

  const filterItems: ItemPredicate<string> = (query, item) => {
    return item.toLocaleLowerCase().includes(query.toLocaleLowerCase());
  };
  const clearInput = () => {
    setInputvalue('');
  };
  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setInputvalue(value);
  };
  const onItemSelect = (item: string): void => {
    onSelectItem(itemKey, item);
    clearInput();
  };
  const onRemove = (item: ReactNode): void => {
    onRemoveItem(itemKey, item as string);
    clearInput();
  };
  const onCreatItem = (query: string) => {
    return query.replace(noSpecialCharactersRegex, '');
  };

  const onKeyDownInput = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const isHoldingShift = event.shiftKey;

    if (isHoldingShift) {
      event.stopPropagation();
      const { activeElement } = document;
      if (activeElement instanceof HTMLElement) {
        activeElement.blur();
        setPopoverProps({ ...popoverProps, isOpen: false });
      }
    }
  };

  const onClickTag = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const target = event.target as HTMLElement;
    // Not clicking on remove icon and clicking on inner div, not the whole tag
    if (target.localName !== 'path' && target.childElementCount === 0) {
      event.stopPropagation();
      navigator.clipboard.writeText(target.innerText);
      showMessage.info(MESSAGE.COPY_TO_CLIPBOARD);
    }
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
  ) => {
    const sanitizedQuery = query.replace(noSpecialCharactersRegex, '');
    return (
      <MenuItem
        icon="add"
        text={`Create "${sanitizedQuery}" tag`}
        active={active}
        onClick={handleClick}
      />
    );
  };
  return (
    <MultiSelect
      fill={true}
      resetOnQuery={false}
      items={allItems}
      query={inputValue}
      selectedItems={selectedItems}
      itemRenderer={renderSelectItems}
      onItemSelect={onItemSelect}
      createNewItemRenderer={renderCreateItems}
      createNewItemFromQuery={onCreatItem}
      tagRenderer={item => item}
      tagInputProps={{
        onRemove,
        inputProps: {
          id: inputId,
          value: inputValue,
          onChange: onInputChange,
          onKeyDown: onKeyDownInput
        },
        tagProps: {
          interactive: true,
          onClick: onClickTag
        }
      }}
      itemPredicate={filterItems}
      popoverProps={{ ...popoverProps }}
      openOnKeyDown={true}
    />
  );
};

export default CustomMultiSelect;
