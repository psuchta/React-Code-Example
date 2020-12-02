import { call, put, select, takeLeading } from 'redux-saga/effects';
import { resolvePromiseAction, rejectPromiseAction } from 'redux-saga-promise-actions';

import GipsyApi from 'apis/Gipsy';
import Endpoints from 'endpoints';

import { ActionType } from 'typesafe-actions';
import * as actions from 'store/actions/auth';
import { IStore } from 'store/reducers';

import { request } from './api';

function* signUp(action: ActionType<typeof actions.signUp.request>) {
  try {
    const { payload } = action;

    yield GipsyApi.request({
      method: 'post',
      url: Endpoints.signUpPath(),
      params: { user: payload },
    });

    yield call(resolvePromiseAction, action);
    yield put(actions.signUp.success());
  } catch (err) {
    yield call(rejectPromiseAction, action, err);
    yield put(actions.signUp.failure(err));
  }
}


function* validateVerificationCode(
  action:
    | ActionType<typeof actions.validateVerificationCode.request>
    | ActionType<typeof actions.resendVerificationCode.request>,
) {
  try {
    const {
      payload: { phone, email, confirmationCode },
    } = action;

    yield GipsyApi.request({
      method: action.type === 'VALIDATE_VERIFICATION_CODE' ? 'GET' : 'POST',
      url: Endpoints.confirmationPath(),
      params: {
        phone,
        email: email?.toLowerCase().trim(),
        confirmationCode,
      },
    });

    yield call(resolvePromiseAction, action);
    yield put(actions.validateVerificationCode.success());
  } catch (err) {
    yield call(rejectPromiseAction, action, err);
    yield put(actions.validateVerificationCode.failure(err));
  }
}


export const watchAuth = [
  takeLeading(actions.signUp.request, signUp),
  takeLeading(
    [actions.validateVerificationCode.request, actions.resendVerificationCode.request],
    validateVerificationCode,
  ),
];
