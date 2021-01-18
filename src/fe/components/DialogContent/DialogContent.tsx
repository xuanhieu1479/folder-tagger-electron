import React, { ReactElement, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../common/interfaces/feInterfaces';
import DialogSuggest from './DialogSuggest';
import '../styles/DialogContent.styled.scss';

const DialogContent = (): ReactElement => {
  const { categories, languages } = useSelector(
    (state: RootState) => state.folder
  );
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');

  return (
    <section className="dialog-content-container">
      <div className="dialog-content-row">
        <div className="dialog-content-row-title">Category</div>
        <div className="dialog-content-row-select">
          <DialogSuggest
            selectedItem={selectedCategory}
            items={categories}
            updateSelectedItem={setSelectedCategory}
          />
        </div>
      </div>
      <div className="dialog-content-row">
        <div className="dialog-content-row-title">Language</div>
        <div className="dialog-content-row-select">
          <DialogSuggest
            selectedItem={selectedLanguage}
            items={languages}
            updateSelectedItem={setSelectedLanguage}
          />
        </div>
      </div>
      <div className="dialog-content-row">
        <div className="dialog-content-row-title">Artist</div>
        <div className="dialog-content-row-select">Alabama</div>
      </div>
      <div className="dialog-content-row">
        <div className="dialog-content-row-title">Group</div>
        <div className="dialog-content-row-select">Alabama</div>
      </div>
      <div className="dialog-content-row">
        <div className="dialog-content-row-title">Parody</div>
        <div className="dialog-content-row-select">Alabama</div>
      </div>
      <div className="dialog-content-row">
        <div className="dialog-content-row-title">Character</div>
        <div className="dialog-content-row-select">Alabama</div>
      </div>
      <div className="dialog-content-row">
        <div className="dialog-content-row-title">Genre</div>
        <div className="dialog-content-row-select">Alabama</div>
      </div>
    </section>
  );
};

export default DialogContent;
