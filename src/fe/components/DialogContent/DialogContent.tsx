import React, { ReactElement } from 'react';
import '../styles/DialogContent.styled.scss';

const DialogContent = (): ReactElement => {
  return (
    <section className="dialog-content-container">
      <div className="dialog-content-row">
        <div className="dialog-content-row-title">Category</div>
        <div className="dialog-content-row-select">Alabama</div>
      </div>
      <div className="dialog-content-row">
        <div className="dialog-content-row-title">Language</div>
        <div className="dialog-content-row-select">Alabama</div>
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
