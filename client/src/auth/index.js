import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import Login from './pages/Login';

const LoginIndex = ({ match, setIsLoggedIn, isLoggedIn }) => {
  return (
    <Switch>
      <Route
        exact
        path={`${match.url}`}
        render={(routeProps) => (
          <Login {...{ setIsLoggedIn, isLoggedIn, ...routeProps }} />
        )}
      />
      <Redirect to="/error" />
    </Switch>
  );
};

export default LoginIndex;
