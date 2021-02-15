import React, { ReactElement } from 'react';
import { RadioGroup, Radio, InputGroup } from '@blueprintjs/core';
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

  return (
    <>
      <div className="setting-dialog_tab-panel_row">
        <div className="setting-dialog_tab-panel_row_title">Search</div>
        <div className="setting-dialog_tab-panel_row_content">
          <InputGroup
            value={defaultSearchParams}
            onChange={onChangeSearchParamsInput}
          />
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
            {SEED_DATA.CATEGORY.map(c => (
              <Radio
                key={c.Category}
                label={c.Category}
                value={c.Category}
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
            {SEED_DATA.LANGUAGE.map(l => (
              <Radio
                key={l.Language}
                label={l.Language}
                value={l.Language}
                className="setting-dialog_tab-panel_radio"
              />
            ))}
          </RadioGroup>
        </div>
      </div>
    </>
  );
};

export default SettingDefaultValues;
