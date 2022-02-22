import React, { useEffect } from 'react';
import { Switch, Route, useHistory, Redirect } from 'react-router-dom';

import AdminDashboard from './AdminDashboard';
import HodDashboard from './HodDashboard';
import UserDashboard from './UserDashboard';
import CommiteeDashboard from './CommitteeDashboard';
import DirectorDashboard from './DirectorDashboard';
import axiosInstance from '../helpers/axiosInstance';

const Dashboards = ({ match }) => {
  const history = useHistory();

  useEffect(() => {
    const isAuthenticated = async () => {
      try {
        const result = await axiosInstance.get('/api/isAuthenticated');
        if (!result.data.success) history.push('/');
      } catch (error) {
        history.push('/');
      }
    };
    isAuthenticated();
  }, [history]);

  return (
    <Switch>
      <Route
        exact
        path={`${match.url}/student`}
        render={(props) => <UserDashboard {...props} />}
      />

      <Route
        exact
        path={`${match.url}/admin`}
        render={(props) => <AdminDashboard {...props} />}
      />

      <Route
        exact
        path={`${match.url}/hod`}
        render={(props) => <HodDashboard {...props} />}
      />

      <Route
        exact
        path={`${match.url}/committee`}
        render={(props) => <CommiteeDashboard {...props} />}
      />
       <Route
        exact
        path={`${match.url}/director`}
        render={(props) => <DirectorDashboard {...props} />}
      />
      

      <Redirect to="/error" />
    </Switch>
  );
};

export default Dashboards;
