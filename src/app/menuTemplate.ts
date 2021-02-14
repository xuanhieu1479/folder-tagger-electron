import { Menu } from 'electron';
import {
  onAddFolder,
  onAddParentFolder,
  onOpenSetting,
  calculateTagsRelation,
  onImportData,
  onOpenDevtool,
  onReload,
  onExportData,
  onClearNonexistentFolders,
  onClearUnusedTags,
  onUpdateMissingThumbnails
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
        click: onOpenSetting
      },
      {
        label: 'Calculate Tags Relation',
        click: calculateTagsRelation
      },
      {
        label: 'Clear Nonexistent Folders',
        click: onClearNonexistentFolders
      },
      {
        label: 'Clear Unused Tags',
        click: onClearUnusedTags
      },
      {
        label: 'Update Missing Thumbnails',
        click: onUpdateMissingThumbnails
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
