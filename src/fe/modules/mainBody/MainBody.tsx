import React, { ReactElement } from 'react';
import './mainBody.styled.scss';
import { FolderCard } from '../../components/commonComponents';

const MainBody = (): ReactElement => {
  return (
    <section className="main-body_container">
      <FolderCard folderName="Sennyuu Saki de Rinrikan Zero no Hanzaisha ni Hentai Anal Name Houshi Saserareta Kekka Netorare Koushuu Benki Shoufu ni Nacchatta Seigi no Y Buta-chan Bon" />
      <FolderCard folderName="A Story about the Rom-Com's Protagonist's Heroines being Stolen by his Friend" />
      <FolderCard folderName="3" />
      <FolderCard folderName="4" />
      <FolderCard folderName="5" />
      <FolderCard folderName="6" />
      <FolderCard folderName="7" />
      <FolderCard folderName="8" />
      <FolderCard folderName="9" />
      <FolderCard folderName="10" />
    </section>
  );
};

export default MainBody;
