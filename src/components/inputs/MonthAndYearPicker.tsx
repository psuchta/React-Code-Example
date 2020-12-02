import React from 'react';

// Utils
import moment from 'moment';

// Styles
import styles from './MonthAndYearPicker.module.css';

type MonthProps = {
  month: moment.Moment;
  onMonthSelect: (currentMonth: moment.Moment, newMonthVal: string) => void;
  onYearSelect: (currentMonth: moment.Moment, newYearVal: string) => void;
};

const MonthPicker = ({ month, onMonthSelect, onYearSelect }: MonthProps) => {
  const returnYears = () => {
    const years = [];
    for (let i = moment().year() - 100; i <= moment().year(); i += 1) {
      years.push(
        <option key={i} value={i}>
          {i}
        </option>,
      );
    }
    return years;
  };

  return (
    <div className={styles.monthAndYearInputs}>
      <div>
        <select value={month.month()} onChange={(e) => onMonthSelect(month, e.target.value)}>
          {moment.months().map((monthLabel, value) => (
            <option key={monthLabel} value={value}>
              {monthLabel}
            </option>
          ))}
        </select>
      </div>
      <div>
        <select value={month.year()} onChange={(e) => onYearSelect(month, e.target.value)}>
          {returnYears()}
        </select>
      </div>
    </div>
  );
};

export default MonthPicker;
