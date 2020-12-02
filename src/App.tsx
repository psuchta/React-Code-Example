import React, { FC, useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import ScrollToTop from 'components/ScrollToTop';
import { getCurrentLocation } from './store/actions/locations';
import { getStaticPages } from './store/actions/static_pages';

import './i18n';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';

import './stylesheets/bootstrap.css';
import './stylesheets/react_dates_overrides.css';

import LoadingProvider from './providers/LoaderProvider';
import Sidebar from './components/sidebar/Sidebar';
import Header from './components/header/Header';
import PaymentMethodsFooter from './components/footer/PaymentMethodsFooter';
import Footer from './components/footer/Footer';

import Router from './routes';

import styles from './App.module.css';

interface Props {
  useSuspense?: boolean;
}

const App: FC<Props> = (_props) => {
  const [displaySidebar, setDisplaySidebar] = useState<boolean>(false);
  const handleHideSidebar = () => setDisplaySidebar(false);
  const handleShowSidebar = () => setDisplaySidebar(true);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getStaticPages());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getCurrentLocation.request());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <LoadingProvider>
        <Sidebar displaySidebar={displaySidebar} handleHideSidebar={handleHideSidebar} />
        <div className={styles.body}>
          <nav className={styles.navigation}>
            <Header handleShowSidebar={handleShowSidebar} />
          </nav>
          <Router />
          <footer>
            <PaymentMethodsFooter />
            <Footer />
          </footer>
        </div>
      </LoadingProvider>
    </BrowserRouter>
  );
};

export default App;
