## For Developers:

- Install windows-build-tools https://www.npmjs.com/package/windows-build-tools (note: Using anything besides run as administrator Powershell is not recommended, since it might get stuck.)
- Warning: For the first time please run yarn start to rebuild native modules, otherwise we will get NODE_MODULE_VERSION not compatible.

- "yarn start" to start the app in development mode.
- "yarn package" to package your app.
- "yarn make" to package your app and creat installer.
- "yarn run publish" to publish new version.

* Delete "Database" folder if make some change to database schema to re-create database.

## Usage:

- Select folders with arrow keys or with mouse.
- Look up tags with their type, there are 5 (name, author, parody, character, genre).
  example: parody: Avenger character: Iron Man genre: Superhero.
- If no tag type was specified all tags will be assumed as wildcard, meaning it will match any tag belong to 4 types above or be a part of folder's name.
- All tags that have too few letters (3) or are common words (the) will be ignored.
- Put - before a tag to exclude it while searching.
- Put " between a tag to find it absolute.
  example: alp will yield the results alp or alpha, but "alp" will only return alp.
- Ctrl + F to focus on search input.
- Select a folder and press Ctrl + C to copy its tags.
- Open folder dialog for editing (default Ctrl E/S/D) then press Ctrl + V to paste copied tags.
- When open folder dialog, press 1,2,3,4 to quickly focus on a tag input.
- When done tagging press Shift + Enter for quick save.
- Remember to run "Calculate Tag Relations" every once in a while for better tag suggestions.
- When update tags, if their new value is duplicate with another tag, all folders of that tag will be merged into the existing tag.
