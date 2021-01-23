import React, { ReactElement } from 'react';
import { RadioGroup, Radio } from '@blueprintjs/core';
import { SettingDefaultValueInterface } from '../../../common/interfaces/feInterfaces';
import { SEED_DATA } from '../../../common/variables/commonVariables';

interface SettingDefaultValuesInterface {
  defaultValueSetting: SettingDefaultValueInterface;
  onUpdateSettings: (newSettings: SettingDefaultValueInterface) => void;
}

const DefaultValueRadio = (): ReactElement => {
  return (
    <Radio label="none" value="" className="setting-dialog_tab-panel_radio" />
  );
};

const SettingDefaultValues = ({
  defaultValueSetting,
  onUpdateSettings
}: SettingDefaultValuesInterface): ReactElement => {
  const { defaultCategory, defaultLanguage } = defaultValueSetting;

  const onChangeCategoryRadio = (event: React.FormEvent<HTMLInputElement>) => {
    onUpdateSettings({
      defaultCategory: event.currentTarget.value,
      defaultLanguage
    });
  };
  const onChangeLanguageRadio = (event: React.FormEvent<HTMLInputElement>) => {
    onUpdateSettings({
      defaultCategory,
      defaultLanguage: event.currentTarget.value
    });
  };

  return (
    <>
      <div className="setting-dialog_tab-panel_row">
        <div className="setting-dialog_tab-panel_row_title">Category</div>
        <div className="setting-dialog_tab-panel_row_radios">
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
        <div className="setting-dialog_tab-panel_row_radios">
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
