import { all } from 'redux-saga/effects';

import { watchFaqs } from './faqs';
import { watchLocations } from './locations';
import { watchStaticPages } from './static_pages';
import { watchStations } from './stations';
import { watchAuth } from './auth';
import { watchUser } from './users';

export default function* rootSaga() {
  yield all([...watchFaqs, ...watchLocations, ...watchStaticPages, ...watchStations, ...watchAuth, ...watchUser]);
}
