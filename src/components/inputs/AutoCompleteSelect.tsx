import React, { FC, useState, useRef, useEffect, useMemo } from 'react';

import cx from 'classnames';
import { useField } from 'formik';
import styles from './AutoCompleteSelect.module.css';
import inputStyles from './InputStyles.module.css';

type Props = {
  label: string;
  name: string;
  id?: string;
  options: Array<Array<string>>;
};

const AutoCompleteSelect: FC<Props> = ({ label, options, id, name }) => {
  const entireComponentRef = useRef<HTMLDivElement>(null);

  const [{ ...field }, meta, { setValue, setTouched }] = useField({ id, name });
  const hasError = meta.touched && meta.error;

  const initialValue = options.find((e) => e[0] === field.value);

  const [showSelect, setShowSelect] = useState(false);
  const [isSelected, setIsSelected] = useState(!!initialValue);
  const [visibleValue, setVisibleValue] = useState(initialValue ? initialValue[1] : '');

  const filteredOptions = useMemo(() => {
    if (visibleValue && !isSelected) {
      return options.filter((option: Array<string>) => option[1].toLowerCase().includes(visibleValue.toLowerCase()));
    }
    return options;
  }, [visibleValue, isSelected, options]);

  useEffect(() => {
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  });

  const handleOutsideClick = (e: MouseEvent) => {
    if (entireComponentRef.current?.contains(e.target as Node)) {
      return;
    }
    !isSelected && setVisibleValue('');
    setShowSelect(false);
  };

  const selectOption = (visible: string, value: string) => {
    setVisibleValue(visible);
    setValue(value);
    setIsSelected(true);
    setShowSelect(false);
  };

  const handleOptionClick = (key: Array<string>) => {
    selectOption(key[1], key[0]);
  };

  const onInputChange = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>): void => {
    if (!isSelected) {
      setVisibleValue(value);
      return;
    }

    setVisibleValue(value.slice(-1));
    setValue('');
    setIsSelected(false);
    setShowSelect(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (showSelect && e.key === 'Enter') {
      const firstOption = filteredOptions[0];
      if (firstOption) {
        selectOption(firstOption[1], firstOption[0]);
      }
      e.preventDefault();
    }
    if (isSelected && e.key === 'Backspace') {
      setVisibleValue('');
      setValue('');
      e.preventDefault();
    }
  };

  const hanleOnBlur = () => {
    setTouched(true);
  };

  return (
    <div ref={entireComponentRef} className={styles.selectGroup}>
      <div className={cx('mt-4', inputStyles.inputGroup)}>
        <label className={inputStyles.inputUnderlined}>
          <input
            className={cx({ [inputStyles.errorBottom]: hasError, [inputStyles.presenceField]: field.value })}
            onClick={() => setShowSelect(true)}
            onBlur={hanleOnBlur}
            onChange={onInputChange}
            value={visibleValue}
            id={id}
            name={name}
            onKeyDown={handleKeyDown}
          />
          <span className={inputStyles.inputLabel}>{label}</span>
        </label>
      </div>
      {hasError ? <div className={inputStyles.error}>{meta.error}</div> : null}
      <div className={styles.select}>
        <div className={cx(styles.countryOptions, { [styles.hide]: !showSelect })}>
          {filteredOptions.map((key) => (
            <div
              key={key[0]}
              className={styles.option}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleOptionClick(key)}
            >
              <div>
                <p>{key[1]}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default AutoCompleteSelect;
