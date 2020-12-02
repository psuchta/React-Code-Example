import React, { FC, useState } from 'react';

// Utils
import { useField } from 'formik';
import moment from 'moment';
import cx from 'classnames';
import { DayPickerSingleDateController } from 'react-dates';

// Components
import { ReactComponent as PrevArrowSvg } from 'images/icons/iconfinder_chevron-left.svg';
import { ReactComponent as NextArrowSvg } from 'images/icons/iconfinder_chevron-right.svg';
import MonthAndYearPicker from './MonthAndYearPicker';

// Styles
import inputStyles from './InputStyles.module.css';
import styles from './SingleDayPicker.module.css';

type Props = {
  label: string;
  name: string;
  id?: string;
  visibleDateFormat?: string;
  returnedDateFormat?: string;
};

const SingleDayPicker: FC<Props> = ({ label, visibleDateFormat, id, name, returnedDateFormat }) => {
  const [showPicker, setShowPicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(moment());
  const [visibleValue, setVisibleValue] = useState('');

  const [field, meta, { setValue, setTouched }] = useField({ id, name });
  const hasError = meta.touched && meta.error;

  const dateFormat = (date: moment.Moment): string => date.format(visibleDateFormat ?? 'D MMM YYYY');

  const handleDateChange = (date: moment.Moment | null) => {
    const momentDate = moment(date);

    setValue(momentDate.format(returnedDateFormat ?? 'YYYY-MM-DD'));
    setVisibleValue(dateFormat(momentDate));
    setSelectedDate(momentDate);

    setTouched(true);
    setShowPicker(false);
  };

  const onInputChange = () => {
    setVisibleValue('');
    setValue('');
  };

  return (
    <>
      <div className={cx('mt-4', inputStyles.inputGroup)}>
        <label className={inputStyles.inputUnderlined}>
          <input
            className={cx({ [inputStyles.errorBottom]: hasError, [inputStyles.presenceField]: field.value })}
            onFocus={() => setShowPicker(true)}
            onChange={onInputChange}
            value={visibleValue}
            id={id}
            name={name}
          />
          <span className={inputStyles.inputLabel}>{label}</span>
        </label>
      </div>
      {hasError && <div className={inputStyles.error}>{meta.error}</div>}
      <div className={`DayPickerSingleDateController BirthDatePickerSignUp ${styles.dayPicker}`}>
        {showPicker && (
          <DayPickerSingleDateController
            date={selectedDate}
            onDateChange={handleDateChange}
            focused
            onFocusChange={() => null}
            initialVisibleMonth={() => selectedDate}
            numberOfMonths={1}
            onOutsideClick={() => {
              setShowPicker(false);
              setTouched(true);
            }}
            monthFormat="MMM YYYY"
            renderMonthElement={MonthAndYearPicker}
            navPrev={
              <div className={styles.arrowPrev}>
                <PrevArrowSvg />
              </div>
            }
            navNext={
              <div className={styles.arrowNext}>
                <NextArrowSvg />
              </div>
            }
            hideKeyboardShortcutsPanel
          />
        )}
      </div>
    </>
  );
};

export default SingleDayPicker;
