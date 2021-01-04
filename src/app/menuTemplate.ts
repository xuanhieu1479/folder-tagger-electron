import { Menu, dialog, app } from 'electron';
import { addOneFolder } from './menuAction';

const onAddFolder = () => {
  const directory = dialog.showOpenDialogSync({
    title: 'Add folder',
    defaultPath: `${app.getPath('desktop')}`,
    properties: ['openDirectory']
  });
  if (directory !== undefined) {
    const selectedDirectory = directory[0];
    addOneFolder(selectedDirectory);
  }
};

const menuTemplate = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Add folder',
        click: onAddFolder
      }
    ]
  }
];

export default Menu.buildFromTemplate(menuTemplate);
