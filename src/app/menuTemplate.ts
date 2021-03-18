import { Menu } from 'electron';
import {
  onAddFolder,
  onAddParentFolder,
  onOpenSetting,
  calculateTagRelations,
  onImportData,
  onOpenDevtool,
  onReload,
  onOpenAppDirectory,
  onExportData,
  onClearFoldersUpdateThumbnails,
  onClearUnusedTags,
  onManageTags
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
        label: 'Open Setting',
        accelerator: 'Ctrl + T',
        click: onOpenSetting
      },
      {
        label: 'Calculate Tag Relations',
        click: calculateTagRelations
      },
      {
        label: 'Clear Folders And Update Thumbnails',
        click: onClearFoldersUpdateThumbnails
      },
      {
        label: 'Clear Unused Tags',
        click: onClearUnusedTags
      }
    ]
  },
  {
    label: 'Backup',
    submenu: [
      {
        label: 'Import Data',
        click: onImportData
      },
      {
        label: 'Export Data',
        click: onExportData
      },
      {
        label: 'Manage Tags',
        click: onManageTags
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
      },
      {
        label: 'Open App Directory',
        click: onOpenAppDirectory
      }
    ]
  }
];

export default Menu.buildFromTemplate(menuTemplate);
