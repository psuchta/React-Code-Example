import { compose } from 'redux';

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Intercom: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    opera: any;
  }
}
