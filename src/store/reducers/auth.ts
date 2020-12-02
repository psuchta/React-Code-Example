import { ActionType, createReducer } from 'typesafe-actions';
import { AuthState } from 'store/types/auth';
import * as actions from 'store/actions/auth';

const authData = JSON.parse(localStorage.getItem('authData') || '{}');

const initialState: AuthState = {
  sessionExpiration: authData?.sessionExpiration || null,
  token: authData?.token || null,
  refreshToken: authData?.refreshToken || null,
};

export const authReducer = createReducer<AuthState, ActionType<typeof actions>>(initialState)
  .handleAction(actions.loginRequest.success, (state, { payload }) => ({
    ...state,
    sessionExpiration: payload.sessionExpiration,
    token: payload.token,
    refreshToken: payload.refreshToken,
  }))
  .handleAction(actions.logout.success, () => ({
    ...initialState,
  }));
