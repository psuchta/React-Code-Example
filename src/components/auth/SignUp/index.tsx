import React, { useState } from 'react';

// Hooks
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

// Utils
import * as Yup from 'yup';
import i18n from 'i18n';
import { Form, Formik, FormikHelpers, FormikConfig } from 'formik';
import countries from 'i18n-iso-countries';
import moment from 'moment';
import { trimValues } from 'utils';

// Components
import TextInput from 'components/inputs/TextInput';
import AutoCompleteSelect from 'components/inputs/AutoCompleteSelect';
import SingleDayPicker from 'components/inputs/SingleDayPicker';
import PhoneInput from 'components/inputs/PhoneInput';
import { ReactComponent as PhoneSvg } from 'images/icons/phone.svg';
import { LoaderContext } from 'context/LoaderContext';

// Actions
import { signUp } from 'store/actions/auth';

// Types
import { DocumentType } from 'store/types/auth';

// Styles
import styles from './index.module.css';

export type CreateAccountType = {
  email: string;
  password: string;
  passwordConfirmation: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  phone: string;
  countryCode: string;
  addressLine1: string;
  addressLine2: string;
  documentType: DocumentType;
  documentNumber: string;
};

const tomorrowDate = moment().add(1, 'days');

const SignUp: React.FC = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [withPhone, setWithPhone] = useState(false);
  const history = useHistory();
  const { setLoading } = React.useContext(LoaderContext);

  const requiredMessage = (field: string) => t('validations:required', { field });

  // Get country list from localized file
  const language = i18n.language.substring(0, 2);
  const countryOptions = countries.getNames(language);
  const countriesArray = Object.keys(countryOptions).map((key) => [key, countryOptions[key]]);

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email(t('validations:auth.emailInvalid'))
      .required(requiredMessage(t('models:user:email'))),
    password: Yup.string()
      .required(requiredMessage(t('models:user:password')))
      .min(8, t('validations:length', { field: t('models:user:password'), length: 8 })),
    passwordConfirmation: Yup.string()
      .required(requiredMessage(t('models:user:passwordConfirm')))
      .oneOf([Yup.ref('password')], t('validations:passwordConfirm', { field: t('models:user:passwordConfirm') })),
    phone: withPhone ? Yup.string().required(requiredMessage(t('models:user:phoneNumber'))) : Yup.string(),
    firstName: Yup.string().required(requiredMessage(t('models:user:firstName'))),
    lastName: Yup.string().required(requiredMessage(t('models:user:lastName'))),
    countryCode: Yup.string().required(requiredMessage(t('models:user:country'))),
    birthDate: Yup.date()
      .max(tomorrowDate.toString(), t('validations:auth:signUp:birthInFuture'))
      .required(requiredMessage(t('models:user:birthDate'))),
    documentType: Yup.string().required(requiredMessage(t('models:user:documentType'))),
    documentNumber: Yup.string()
      .required(requiredMessage(t('models:user:documentNumber')))
      .matches(/^\d+$/, t('validations:mustBeNumber', { field: t('models:user:documentNumber') })),
  });

  const formikParams: FormikConfig<CreateAccountType> = {
    initialValues: {
      email: '',
      password: '',
      passwordConfirmation: '',
      firstName: '',
      lastName: '',
      birthDate: '',
      phone: '',
      countryCode: '',
      addressLine1: '',
      addressLine2: '',
      documentType: DocumentType.PASSPORT,
      documentNumber: '',
    },
    validationSchema,
    onSubmit: async (values: CreateAccountType, actions: FormikHelpers<CreateAccountType>) => {
      setLoading(true);
      const payload = trimValues(values);

      try {
        await dispatch(signUp.request({ ...payload }));

        setLoading(false);
        history.push('/confirmation', { email: payload.email, phone: values.phone, fromRegistration: true });
      } catch ({ response }) {
        setLoading(false);

        if (response.data?.errorMessage) {
          let errorMessage = '';

          Object.entries(response.data.errorMessage).forEach(([name, message]) => {
            if (name === 'email') {
              errorMessage = t('validations:auth:emailTaken');
            } else {
              errorMessage = `${name} ${message}`;
            }

            actions.setFieldError(name, errorMessage);
          });
        }
      }
    },
  };

  return (
    <div className={styles.pageContainer}>
      <div className="container">
        <div className={styles.body}>
          <div className={styles.bodyHeader}>
            <span className={styles.title}>{t('views:auth:signUp:header')}</span>
            <button type="button">{t('views:auth:signUp:login')}</button>
          </div>
          <div>
            <Formik {...formikParams}>
              {() => (
                <Form>
                  <TextInput name="email" label={t('models:user:email')} />
                  <div className={styles.inline}>
                    <TextInput type="password" name="password" label={t('models:user:password')} />
                    <TextInput type="password" name="passwordConfirmation" label={t('models:user:passwordConfirm')} />
                  </div>
                  {withPhone && <PhoneInput name="phone" label={t('models:user:phoneNumber')} />}
                  <div className="mt-5 text-center">
                    <button
                      type="button"
                      className={styles.signInMobileBtn}
                      onClick={() => setWithPhone((prevWithPhone) => !prevWithPhone)}
                    >
                      {!withPhone ? (
                        <>
                          <span className="pr-3">
                            <PhoneSvg />
                          </span>
                          <p className="d-inline">{t('views:auth:signUp:viaMobilePhone')}</p>
                        </>
                      ) : (
                        <p className="d-inline">{t('views:auth:signUp:viaEmail')}</p>
                      )}
                    </button>
                  </div>
                  <div className={styles.inline}>
                    <TextInput name="firstName" label={t('models:user:firstName')} />
                    <TextInput name="lastName" label={t('models:user:lastName')} />
                  </div>
                  <SingleDayPicker name="birthDate" label={t('models:user:birthDate')} />
                  <TextInput name="addressLine1" label={t('models:user:addressLine1')} />
                  <TextInput name="addressLine2" label={t('models:user:addressLine2')} />
                  <AutoCompleteSelect name="countryCode" label={t('models:user:country')} options={countriesArray} />
                  <div className={styles.inline}>
                    <AutoCompleteSelect
                      name="documentType"
                      label={t('models:user:documentType')}
                      options={[[DocumentType.PASSPORT, 'Passport']]}
                    />
                    <TextInput name="documentNumber" label={t('models:user:documentNumber')} />
                  </div>
                  <div className={styles.termsAndSubmit}>
                    <span>
                      {t('views:auth:signUp:clickAgreement')} <span>{t('views:auth:signUp:termsAndConditions')}</span>
                    </span>
                    <button type="submit">{t('views:auth:signUp:signUp')}</button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
