import React, { ReactElement, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Dialog,
  HTMLSelect,
  Button,
  Intent,
  EditableText,
  Tooltip,
  InputGroup
} from '@blueprintjs/core';
import _ from 'lodash';
import {
  BreakDownTagType,
  UpdatedTag
} from '../../common/interfaces/commonInterfaces';
import { RootState, CommonDialog } from '../../common/interfaces/feInterfaces';
import { getManagedTags, updateTags } from '../redux/tag/tagAction';
import './styles/ManageTagsDialog.styled.scss';

const filterByOptions: BreakDownTagType[] = [
  'author',
  'character',
  'genre',
  'parody'
];
type ManageTagsSortType = 'Tag Name' | 'Used Times';
const sortByOptions: ManageTagsSortType[] = ['Tag Name', 'Used Times'];

const ManageTagsDialog = ({ isOpen, onClose }: CommonDialog): ReactElement => {
  const dispatch = useDispatch();
  const { managedTags } = useSelector((state: RootState) => state.tag);
  const [updatedTags, setUpdatedTags] = useState<UpdatedTag[]>([]);
  const [search, setSearch] = useState('');
  const [filterBy, setFilterBy] = useState(filterByOptions[0]);
  const [sortBy, setSortBy] = useState(sortByOptions[0]);
  const [isLoading, setLoading] = useState(false);

  const reset = () => {
    setUpdatedTags([]);
    setSearch('');
    getManagedTags(dispatch, { filterBy });
  };

  useEffect(() => {
    if (isOpen) reset();
    else {
      setFilterBy(filterByOptions[0]);
      setSortBy(sortByOptions[0]);
    }
  }, [isOpen, filterBy]);

  const onChangeFilter = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newFilter = event.currentTarget.value as BreakDownTagType;
    setFilterBy(newFilter);
  };
  const onChangeSort = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newSort = event.currentTarget.value as ManageTagsSortType;
    setSortBy(newSort);
  };
  const onConfirmUpdateTag = (oldValue: string, newValue: string) => {
    const newUpdatedTags = [...updatedTags];
    const existingTag = newUpdatedTags.find(tag => tag.oldValue === oldValue);
    if (existingTag) existingTag.newValue = newValue;
    else newUpdatedTags.push({ tagType: filterBy, oldValue, newValue });
    setUpdatedTags(
      newUpdatedTags.filter(
        tag => tag.newValue !== '' && tag.oldValue !== tag.newValue
      )
    );
  };
  const onSave = () => {
    setLoading(true);
    const onSuccess = () => reset();
    const onFinally = () => setLoading(false);
    updateTags(updatedTags, onSuccess, onFinally);
  };

  const getTagColor = (tagName: string) => {
    const changedTag = updatedTags.find(tag => tag.oldValue === tagName);
    if (changedTag) {
      if (changedTag.newValue === 'delete') return 'danger';
      if (managedTags.some(tag => tag.tagName === changedTag.newValue))
        return 'warning';
    }
    return 'primary';
  };
  const getRenderTagsList = () => {
    const sortedTags = _.sortBy(managedTags, tag => {
      switch (sortBy) {
        case 'Tag Name':
          return tag.tagName;
        case 'Used Times':
          return tag.usedTimes;
      }
    });
    if (!search) return sortedTags;
    else return sortedTags.filter(tag => tag.tagName.includes(search));
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Manage Tags"
      className="manage-tags-dialog_container"
    >
      <section className="manage-tags-dialog_content_container">
        <div className="manage-tags-dialog_content_filter">
          <div className="manage-tags-dialog_content_filter_item">
            <span className="manage-tags-dialog_content_filter_label">
              Filter by:
            </span>
            <HTMLSelect
              options={filterByOptions}
              value={filterBy}
              onChange={onChangeFilter}
            />
          </div>
          <div className="manage-tags-dialog_content_filter_item">
            <span className="manage-tags-dialog_content_filter_label">
              Sort by:
            </span>
            <HTMLSelect
              options={sortByOptions}
              value={sortBy}
              onChange={onChangeSort}
            />
          </div>
          <Button
            onClick={onSave}
            loading={isLoading}
            intent={Intent.PRIMARY}
            className="manage-tags-dialog_content_save-button"
          >
            Save
          </Button>
        </div>
        <div className="manage-tags-dialog_content_filter">
          <div className="manage-tags-dialog_content_filter_item search">
            <span className="manage-tags-dialog_content_filter_label">
              Search:
            </span>
            <InputGroup
              fill={true}
              small={true}
              value={search}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setSearch(event.currentTarget.value)
              }
            />
          </div>
        </div>
        <div className="manage-tags-dialog_content_data">
          <div className="manage-tags-dialog_content_table">
            <div className="manage-tags-dialog_content_header">Tag Name</div>
            <Tooltip content="Input 'delete' to obliterate unwanted tag.">
              <div className="manage-tags-dialog_content_header">New Value</div>
            </Tooltip>
            <div className="manage-tags-dialog_content_header">Used Times</div>
            {getRenderTagsList().map(tag => (
              <>
                <div
                  key={`${tag.tagName}`}
                  className={`manage-tags-dialog_content_cell ${getTagColor(
                    tag.tagName
                  )}`}
                >
                  {tag.tagName}
                </div>
                <EditableText
                  placeholder=""
                  key={`${tag.tagName}-new-value`}
                  onConfirm={value => onConfirmUpdateTag(tag.tagName, value)}
                  className={`manage-tags-dialog_content_cell ${getTagColor(
                    tag.tagName
                  )}`}
                />
                <div
                  key={`${tag.tagName}-used-times`}
                  className="manage-tags-dialog_content_cell number"
                >
                  {tag.usedTimes}
                </div>
              </>
            ))}
          </div>
        </div>
      </section>
    </Dialog>
  );
};

export default ManageTagsDialog;
