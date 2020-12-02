import React from 'react';

import cx from 'classnames';
import { useField } from 'formik';
import styles from './InputStyles.module.css';

type Props = {
  label: string;
  name: string;
  id?: string;
  type?: string;
};

const TextInput: React.FC<Props> = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  const hasError = meta.touched && meta.error;

  return (
    <div>
      <div className={cx('mt-4', styles.inputGroup)}>
        <label className={styles.inputUnderlined}>
          <input
            className={cx({ [styles.errorBottom]: hasError, [styles.presenceField]: field.value })}
            {...field}
            {...props}
          />
          <span className={styles.inputLabel}>{label}</span>
        </label>
        {hasError && <div className={styles.error}>{meta.error}</div>}
      </div>
    </div>
  );
};

export default TextInput;
