import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';
import { Container, Paper } from '@material-ui/core';

import Login from './auth';
import Dashboards from './Dashboards/index';
import ComplaintViews from './complaintViews';
import Header from './LandingPage/Header';
import Forms from './forms';
import Table from './Dashboards/Table';
import StoreDashboard from './store/pages/StoreDashboard';
import Store from './store/pages/Store';
import Contact from './LandingPage/Contactpage';
import Help from './LandingPage/Help';
import PageNotFound404 from './helpers/components/PageNotFound404';
import landing from './LandingPage/index.js';
import Footer from './LandingPage/Footer';
import Report from './Dashboards/Report';
const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    console.log(isLoggedIn);
  }, [isLoggedIn]);

  return (
    <Router>
      <Container className="App">
        <Paper elevation={3} square style={{ padding: '20px' }}>
          <Container>
            <Header setIsLoggedIn={setIsLoggedIn} isLoggedIn={isLoggedIn} />
            <Switch>
              {/* <Redirect exact from="/" to={'/'} /> */}
              <Route exact path="/landing" component={landing} />
              <Route exact path="/help" component={Help} />
              <Route exact path="/contactPage" component={Contact} />
              <Route exact path="/" component={landing} />
              <Route path="/forms/Report" component={Report} />
              <Route
                path="/login"
                render={(props) => (
                  <Login {...{ setIsLoggedIn, isLoggedIn, ...props }} />
                )}
              />

              <Route path="/dashboard" component={Dashboards} />
              <Route path="/forms/" component={Forms} />
              <Route exact path="/store" component={StoreDashboard} />
              <Route path="/view" component={ComplaintViews} />
              <Route path="/error" component={PageNotFound404} />
              <Route path="/table" component={Table}/>
              <Route exact path="/store/Store" component={Store} />
              <Redirect to="/error" />
            </Switch>
          </Container>
        </Paper>
      </Container>
      <Footer />
    </Router>
  );
};

export default App;
