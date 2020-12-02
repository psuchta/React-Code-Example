import React from 'react';

// Hooks
import { useDispatch } from 'react-redux';
import { useLocation, useHistory } from 'react-router-dom';

// Utils
import ReactCodeInput from 'react-verification-code-input';
import { parsePhoneNumber } from 'libphonenumber-js';
import { useTranslation } from 'react-i18next';
import cx from 'classnames';

// Components
import { LoaderContext } from 'context/LoaderContext';

// Actions
import { resendVerificationCode, validateVerificationCode } from 'store/actions/auth';

// Styles
import { ReactComponent as RedCross } from 'images/icons/cross-red.svg';
import styles from './Confirmation.module.css';

enum VerificationStatus {
  Valid = 'valid',
  Invalid = 'invalid',
  ApiError = 'apiError',
  None = 'none',
}

interface LocationState {
  email: string;
  phone: string;
  fromRegistration?: boolean;
}

const resendInterval = 60;

const Confirmation: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();
  const locationState = useLocation<LocationState>();
  const { setLoading } = React.useContext(LoaderContext);

  const { email, phone, fromRegistration } = locationState.state || {};
  const inputRef = React.useRef<ReactCodeInput>(null);

  const [verificationStatus, setVerificationStatus] = React.useState<VerificationStatus>(VerificationStatus.None);
  const [seconds, setSeconds] = React.useState(fromRegistration ? resendInterval : 0);
  const [error, setError] = React.useState<string | null>(null);

  const formatPhoneNumber = () => (phone ? parsePhoneNumber(`+${phone}`).formatInternational() : null);

  const clearErrors = () => {
    setVerificationStatus(VerificationStatus.None);
    setError('');
  };

  const handleVerificationCode = async (value: string) => {
    setLoading(true);

    clearErrors();

    try {
      await dispatch(
        validateVerificationCode.request({
          confirmationCode: value,
          phone,
          email,
        }),
      );
      setVerificationStatus(VerificationStatus.Valid);
      setLoading(false);
      history.push('/sign_up_completed');
    } catch ({ response }) {
      setLoading(false);
      /* eslint no-underscore-dangle: ["error", { "allow": ["__clearvalues__"] }] */
      inputRef.current?.__clearvalues__();

      if (response.data?.status === 404) {
        setError(t('validations:notFound'));
        setVerificationStatus(VerificationStatus.ApiError);
      } else {
        setVerificationStatus(VerificationStatus.Invalid);
      }
    }
  };

  const handleResendVerificationCode = async () => {
    clearErrors();
    setSeconds(resendInterval);
    try {
      await dispatch(
        resendVerificationCode.request({
          confirmationCode: '',
          phone,
          email,
        }),
      );
    } catch ({ response }) {
      if (response.data?.errorName === 'Errors::ConfirmationCodeAlreadySent') {
        setError(t('validations:auth:confirmation:codeAlreadySent'));
      } else if (response.data?.status === 404) {
        setError(t('validations:notFound'));
      }
      setVerificationStatus(VerificationStatus.ApiError);
    }
  };

  const userIdentifier = formatPhoneNumber() ?? email;
  const verified = verificationStatus === VerificationStatus.Valid;
  const invalidCode = verificationStatus === VerificationStatus.Invalid;
  const apiError = verificationStatus === VerificationStatus.ApiError;

  React.useEffect(() => {
    if (seconds === 0) return undefined;

    const timeout = setTimeout(() => setSeconds(seconds - 1), 1000);

    return () => clearTimeout(timeout);
  });

  return (
    <div className={styles.pageContainer}>
      <div className="container">
        <div className={styles.body}>
          <div className={styles.bodyHeader}>
            <span className={styles.title}>
              {t('views:auth:confirmation:header', {
                field: phone ? t('models:user:phoneNumber') : t('models:user:email'),
              })}
            </span>
          </div>
          <div>
            <div className="mt-5">
              <span className="d-block">{t('views:auth:confirmation:weSent')}</span>
              <span title={userIdentifier} className={cx('mt-1', 'd-block', styles.identifier)}>
                {userIdentifier}
              </span>
            </div>
            <p className="mt-4">
              {t('views:auth:confirmation:checkCode', {
                field: phone ? t('models:user:phone') : t('models:user:email'),
              })}
            </p>
            <div className={styles.validationStatus}>
              <span>{t('views:auth:confirmation:validationCode')}</span>
              {verified && <span className={styles.validated}>{t('views:auth:confirmation:validated')}</span>}
              {invalidCode && (
                <div className={styles.invalid}>
                  <RedCross /> <span>{t('views:auth:confirmation:invalid')}</span>
                </div>
              )}
            </div>
            <ReactCodeInput
              className={cx(styles.codeVerification, { [styles.error]: invalidCode || apiError })}
              onComplete={handleVerificationCode}
              onChange={() => clearErrors()}
              ref={inputRef}
            />
            {apiError && <span className={styles.error}>{error}</span>}
            <div className={styles.resendEmailGroup}>
              <span>{t('views:auth:confirmation:didntGet')}</span>
              {!seconds ? (
                <span onClick={handleResendVerificationCode} className={styles.resendEmail}>
                  {t('views:auth:confirmation:resendEmail')}
                </span>
              ) : (
                <span className={styles.retryResend}>{t('views:auth:confirmation:retryResend', { seconds })}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
