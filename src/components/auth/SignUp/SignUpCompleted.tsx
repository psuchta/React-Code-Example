import React from 'react';

// Hooks
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

// Utils
import cx from 'classnames';

// Styles
import styles from './SignUpCompleted.module.css';

const SignUpCompleted: React.FC = () => {
  const { t } = useTranslation();
  const history = useHistory();

  const handleGoToHome = () => {
    history.replace('/');
  };

  return (
    <div className={styles.pageContainer}>
      <div className="container">
        <div className={styles.body}>
          <div className={styles.bodyHeader}>
            <span>{t('views:auth:signUpCompleted:header')}</span>
          </div>
          <div>
            <div className="mt-4">
              <span>{t('views:auth:signUpCompleted:description')}</span>
            </div>
            <div className={cx('mt-4', styles.loginSection)}>
              <span onClick={handleGoToHome}>{t('views:auth:signUpCompleted:backToMain')}</span>
              <button type="button">{t('views:auth:signUp:login')}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpCompleted;
