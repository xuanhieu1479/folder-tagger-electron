import React, { ReactElement } from 'react';
import { RadioGroup, Radio, InputGroup, FileInput } from '@blueprintjs/core';
import {
  SettingReducer,
  SettingDefaultValue
} from '../../../common/interfaces/feInterfaces';
import { SEED_DATA } from '../../../common/variables/commonVariables';

interface SettingDefaultValues {
  defaultValueSettings: SettingDefaultValue;
  onUpdateSettings: (newSettings: Partial<SettingReducer>) => void;
}

const DefaultValueRadio = (): ReactElement => {
  return (
    <Radio label="none" value="" className="setting-dialog_tab-panel_radio" />
  );
};

const SettingDefaultValues = ({
  defaultValueSettings,
  onUpdateSettings
}: SettingDefaultValues): ReactElement => {
  const {
    defaultSearchParams,
    defaultExternalProgram,
    isSearchRandomly,
    defaultCategory,
    defaultLanguage
  } = defaultValueSettings;

  const onChangeSearchParamsInput = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = event.currentTarget;
    onUpdateSettings({
      defaultValue: { ...defaultValueSettings, defaultSearchParams: value }
    });
  };
  const onChangeExtenalProgram = (event: React.FormEvent<HTMLInputElement>) => {
    const { files } = event.target as HTMLInputElement;
    if (files && files[0]) {
      onUpdateSettings({
        defaultValue: {
          ...defaultValueSettings,
          defaultExternalProgram: files[0].path
        }
      });
    }
  };

  const onChangeCategoryRadio = (event: React.FormEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    onUpdateSettings({
      defaultValue: { ...defaultValueSettings, defaultCategory: value }
    });
  };
  const onChangeLanguageRadio = (event: React.FormEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    onUpdateSettings({
      defaultValue: { ...defaultValueSettings, defaultLanguage: value }
    });
  };
  const onChangeIsRandomRadio = (event: React.FormEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    onUpdateSettings({
      defaultValue: { ...defaultValueSettings, isSearchRandomly: value }
    });
  };

  return (
    <section>
      <div className="setting-dialog_tab-panel_row">
        <div className="setting-dialog_tab-panel_row_title">Search</div>
        <div className="setting-dialog_tab-panel_row_content">
          <InputGroup
            fill={true}
            value={defaultSearchParams}
            onChange={onChangeSearchParamsInput}
          />
        </div>
      </div>
      <div className="setting-dialog_tab-panel_row">
        <div className="setting-dialog_tab-panel_row_title">Program</div>
        <div className="setting-dialog_tab-panel_row_content">
          <FileInput
            fill={true}
            buttonText="Select"
            hasSelection={true}
            text={defaultExternalProgram}
            inputProps={{
              accept: '.exe',
              onChange: onChangeExtenalProgram
            }}
          />
        </div>
      </div>
      <div className="setting-dialog_tab-panel_row">
        <div className="setting-dialog_tab-panel_row_title">Is Random</div>
        <div className="setting-dialog_tab-panel_row_content">
          <RadioGroup
            inline={true}
            onChange={onChangeIsRandomRadio}
            selectedValue={isSearchRandomly}
          >
            <Radio
              label="Yes"
              value="yes"
              className="setting-dialog_tab-panel_radio"
            />
            <Radio
              label="No"
              value="no"
              className="setting-dialog_tab-panel_radio"
            />
          </RadioGroup>
        </div>
      </div>
      <div className="setting-dialog_tab-panel_row">
        <div className="setting-dialog_tab-panel_row_title">Category</div>
        <div className="setting-dialog_tab-panel_row_content">
          <RadioGroup
            inline={true}
            onChange={onChangeCategoryRadio}
            selectedValue={defaultCategory}
          >
            {DefaultValueRadio()}
            {Object.values(SEED_DATA.CATEGORY).map(category => (
              <Radio
                key={category}
                label={category}
                value={category}
                className="setting-dialog_tab-panel_radio"
              />
            ))}
          </RadioGroup>
        </div>
      </div>
      <div className="setting-dialog_tab-panel_row">
        <div className="setting-dialog_tab-panel_row_title">Language</div>
        <div className="setting-dialog_tab-panel_row_content">
          <RadioGroup
            inline={true}
            onChange={onChangeLanguageRadio}
            selectedValue={defaultLanguage}
          >
            {DefaultValueRadio()}
            {Object.values(SEED_DATA.LANGUAGE).map(language => (
              <Radio
                key={language}
                label={language}
                value={language}
                className="setting-dialog_tab-panel_radio"
              />
            ))}
          </RadioGroup>
        </div>
      </div>
    </section>
  );
};

export default SettingDefaultValues;
