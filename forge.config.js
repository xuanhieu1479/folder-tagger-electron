module.exports = {
  packagerConfig: {
    executableName: 'Folder Tagger',
    name: 'Folder Tagger'
  },
  makers: [{ name: '@electron-forge/custom-maker' }],
  publishers: [
    {
      name: '@electron-forge/publisher-github',
      platforms: ['win32'],
      config: {
        repository: {
          owner: 'xuanhieu1479',
          name: 'folder-tagger-electron'
        }
      }
    }
  ],
  plugins: [
    [
      '@electron-forge/plugin-webpack',
      {
        mainConfig: './webpack.main.config.js',
        renderer: {
          config: './webpack.renderer.config.js',
          entryPoints: [
            {
              html: './src/index.html',
              js: './src/renderer.ts',
              name: 'main_window'
            }
          ]
        },
        port: 1479
      }
    ]
  ]
};
