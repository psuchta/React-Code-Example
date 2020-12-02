import React from 'react';
import { Switch, Route, RouteComponentProps } from 'react-router-dom';

import Home from 'screens/Home';

// Auth
import SignUp from 'components/auth/SignUp';
import Confrimation from 'components/auth/SignUp/Confirmation';
import SignUpCompleted from 'components/auth/SignUp/SignUpCompleted';

interface IRoute {
  path: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: any;
  routes?: IRoute[];
  exact: boolean;
}

const Routes = [
  { path: '/', component: Home, exact: true },
  { path: '/sign_up', component: SignUp, exact: true },
  { path: '/confirmation', component: Confrimation, exact: true },
  { path: '/sign_up_completed', component: SignUpCompleted, exact: true },
];

const Router: React.FC = () => {
  return (
    <Switch>
      {Routes.map((route, i) => (
        <RouteWithSubRoutes key={route.path} {...route} />
      ))}
    </Switch>
  );
};

const RouteWithSubRoutes: React.FC<IRoute> = (route) => {
  return (
    <Route
      path={route.path}
      render={(props: RouteComponentProps) => <route.component {...props} routes={route.routes} />}
    />
  );
};

export default Router;
