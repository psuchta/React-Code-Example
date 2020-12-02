import { createPromiseAction } from 'redux-saga-promise-actions';
import { AxiosError } from 'axios';
import {
  TVerificationCodePayload,
  TVerificationCodeFailurePayload,
  SignUpPayload,
  SignUpFailurePayload,
} from 'store/types/auth';
import { createAsyncAction } from 'typesafe-actions';

export const signUp = createPromiseAction('SIGN_UP', 'SIGN_UP_SUCCEEDED', 'SIGN_UP_FAILURE')<
  SignUpPayload,
  undefined,
  AxiosError<SignUpFailurePayload>
>();

export const validateVerificationCode = createPromiseAction(
  'VALIDATE_VERIFICATION_CODE',
  'VALIDATE_VERIFICATION_CODE_SUCCEEDED',
  'VALIDATE_VERIFICATION_CODE_FAILURE',
)<TVerificationCodePayload, undefined, AxiosError<TVerificationCodeFailurePayload>>();

export const resendVerificationCode = createPromiseAction(
  'RESEND_VERIFICATION_CODE',
  'RESEND_VERIFICATION_CODE_SUCCEEDED',
  'RESEND_VERIFICATION_CODE_FAILURE',
)<TVerificationCodePayload, undefined, AxiosError<TVerificationCodeFailurePayload>>();
