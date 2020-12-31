import { Menu, dialog, app } from 'electron';

const onAddFolder = () => {
  const directory = dialog.showOpenDialogSync({
    title: 'Add folder',
    defaultPath: `${app.getPath('desktop')}`,
    properties: ['openDirectory']
  });
  if (directory) {
    console.log(directory[0]);
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
