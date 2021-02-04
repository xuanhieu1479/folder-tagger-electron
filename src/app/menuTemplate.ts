import { Menu } from 'electron';
import {
  onAddFolder,
  onAddParentFolder,
  onOpenSetting,
  onImportData,
  onOpenDevtool,
  onReload
} from './menuActions/menuActions';

const menuTemplate = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Add folder',
        click: onAddFolder
      },
      {
        label: 'Add parent folder',
        click: onAddParentFolder
      }
    ]
  },
  {
    label: 'Setting',
    submenu: [
      {
        label: 'Open setting',
        click: onOpenSetting
      }
    ]
  },
  {
    label: 'Backup',
    submenu: [
      {
        label: 'Import Data',
        click: onImportData
      }
    ]
  },
  {
    label: 'Debug',
    submenu: [
      {
        label: 'Toggle Devtool',
        accelerator: 'F12',
        click: onOpenDevtool
      },
      {
        label: 'Reload',
        accelerator: 'F5',
        click: onReload
      }
    ]
  }
];

export default Menu.buildFromTemplate(menuTemplate);
