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
    placeholderCategory,
    placeholderLanguage,
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

  const onChangeIsRandom = (event: React.FormEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    onUpdateSettings({
      defaultValue: { ...defaultValueSettings, isSearchRandomly: value }
    });
  };
  const onChangePlaceholderCategory = (
    event: React.FormEvent<HTMLInputElement>
  ) => {
    const { value } = event.currentTarget;
    onUpdateSettings({
      defaultValue: { ...defaultValueSettings, placeholderCategory: value }
    });
  };
  const onChangePlaceholderLanguage = (
    event: React.FormEvent<HTMLInputElement>
  ) => {
    const { value } = event.currentTarget;
    onUpdateSettings({
      defaultValue: { ...defaultValueSettings, placeholderLanguage: value }
    });
  };
  const onChangeDefaultCategory = (
    event: React.FormEvent<HTMLInputElement>
  ) => {
    const { value } = event.currentTarget;
    onUpdateSettings({
      defaultValue: { ...defaultValueSettings, defaultCategory: value }
    });
  };
  const onChangeDefaultLanguage = (
    event: React.FormEvent<HTMLInputElement>
  ) => {
    const { value } = event.currentTarget;
    onUpdateSettings({
      defaultValue: { ...defaultValueSettings, defaultLanguage: value }
    });
  };

  return (
    <section>
      <div className="setting-dialog_tab-panel_row">
        <div className="setting-dialog_tab-panel_row_title">
          Search on startup
        </div>
        <div className="setting-dialog_tab-panel_row_content">
          <InputGroup
            fill={true}
            value={defaultSearchParams}
            onChange={onChangeSearchParamsInput}
          />
        </div>
      </div>
      <div className="setting-dialog_tab-panel_row">
        <div className="setting-dialog_tab-panel_row_title">
          External program path
        </div>
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
        <div className="setting-dialog_tab-panel_row_title">
          Is random on startup
        </div>
        <div className="setting-dialog_tab-panel_row_content">
          <RadioGroup
            inline={true}
            onChange={onChangeIsRandom}
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
        <div className="setting-dialog_tab-panel_row_title">
          Category placeholder
        </div>
        <div className="setting-dialog_tab-panel_row_content">
          <RadioGroup
            inline={true}
            onChange={onChangePlaceholderCategory}
            selectedValue={placeholderCategory}
          >
            {DefaultValueRadio()}
            {Object.values(SEED_DATA.CATEGORY).map(category => (
              <Radio
                key={`placeholder-${category}`}
                label={category}
                value={category}
                className="setting-dialog_tab-panel_radio"
              />
            ))}
          </RadioGroup>
        </div>
      </div>
      <div className="setting-dialog_tab-panel_row">
        <div className="setting-dialog_tab-panel_row_title">
          Language placeholder
        </div>
        <div className="setting-dialog_tab-panel_row_content">
          <RadioGroup
            inline={true}
            onChange={onChangePlaceholderLanguage}
            selectedValue={placeholderLanguage}
          >
            {DefaultValueRadio()}
            {Object.values(SEED_DATA.LANGUAGE).map(language => (
              <Radio
                key={`placeholder-${language}`}
                label={language}
                value={language}
                className="setting-dialog_tab-panel_radio"
              />
            ))}
          </RadioGroup>
        </div>
      </div>
      <div className="setting-dialog_tab-panel_row">
        <div className="setting-dialog_tab-panel_row_title">
          Category on startup
        </div>
        <div className="setting-dialog_tab-panel_row_content">
          <RadioGroup
            inline={true}
            onChange={onChangeDefaultCategory}
            selectedValue={defaultCategory}
          >
            {DefaultValueRadio()}
            {Object.values(SEED_DATA.CATEGORY).map(category => (
              <Radio
                key={`default-${category}`}
                label={category}
                value={category}
                className="setting-dialog_tab-panel_radio"
              />
            ))}
          </RadioGroup>
        </div>
      </div>
      <div className="setting-dialog_tab-panel_row">
        <div className="setting-dialog_tab-panel_row_title">
          Language on startup
        </div>
        <div className="setting-dialog_tab-panel_row_content">
          <RadioGroup
            inline={true}
            onChange={onChangeDefaultLanguage}
            selectedValue={defaultLanguage}
          >
            {DefaultValueRadio()}
            {Object.values(SEED_DATA.LANGUAGE).map(language => (
              <Radio
                key={`default-${language}`}
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
