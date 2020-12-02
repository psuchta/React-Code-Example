import React, { FC, useState } from 'react';

// Hooks
import { useTranslation } from 'react-i18next';
import { useField } from 'formik';

// Utils
import PhoneComponent from 'react-phone-input-2';
import 'react-phone-input-2/lib/high-res.css';
import { CountryCode as LibCountryCode, isValidNumberForRegion } from 'libphonenumber-js';

// Styles
import styles from './PhoneInput.module.css';

type Props = {
  label: string;
  name: string;
  id?: string;
};

interface CountryData {
  name: string;
  dialCode: string;
  countryCode: string;
  format: string;
}

const PhoneInput: FC<Props> = ({ label, ...props }) => {
  const { t } = useTranslation();

  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>('');

  const validate = (value: string) => {
    if (!isValidNumberForRegion(value, selectedCountryCode as LibCountryCode)) {
      return t('validations:invalid', { field: t('models:user:phoneNumber') });
    }
    return '';
  };

  const [{ value: formikValue }, { touched, error }, { setValue, setTouched }] = useField({ validate, ...props });
  const hasError = touched && error;

  const containerClass = () => {
    if (hasError) return styles.phoneInputErrorContainer;
    if (isFocused) return styles.phoneInputFocusedContainer;
    return styles.phoneInputContainer;
  };

  return (
    <div className={styles.inputGroup}>
      <span>{label}</span>
      <PhoneComponent
        country="pt"
        containerClass={containerClass()}
        inputClass={styles.phoneInput}
        buttonClass={styles.phoneInputButton}
        dropdownClass={styles.phoneDropdown}
        searchClass={styles.searchClass}
        enableSearch
        onFocus={() => {
          setIsFocused(true);
        }}
        onBlur={() => {
          setIsFocused(false);
          setTouched(true);
        }}
        onChange={(value, country: CountryData) => {
          setSelectedCountryCode(country.countryCode.toUpperCase());
          setValue(value);
        }}
        value={formikValue}
      />
      {hasError ? <div className={styles.error}>{error}</div> : null}
    </div>
  );
};

export default PhoneInput;
