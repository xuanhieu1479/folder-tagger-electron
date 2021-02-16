import React, { ReactElement, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Dialog } from '@blueprintjs/core';
import {
  BreakDownTagType,
  ManageTagsSortType
} from '../../common/interfaces/commonInterfaces';
import { RootState, CommonDialog } from '../../common/interfaces/feInterfaces';
import { getManagedTags } from '../redux/tag/tagAction';

const ManageTagsDialog = ({ isOpen, onClose }: CommonDialog): ReactElement => {
  const dispatch = useDispatch();
  const { managedTags } = useSelector((state: RootState) => state.tag);
  const [filterBy, setFilterBy] = useState<BreakDownTagType>('author');
  const [sortBy, setSortBy] = useState<ManageTagsSortType>('Tag Name');

  useEffect(() => {
    if (isOpen) getManagedTags(dispatch, { filterBy, sortBy });
  }, [isOpen]);

  return <Dialog isOpen={isOpen} onClose={onClose}></Dialog>;
};

export default ManageTagsDialog;
