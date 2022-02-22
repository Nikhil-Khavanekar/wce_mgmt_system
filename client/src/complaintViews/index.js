import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import StudentView from './StudentView';
import HodView from './HodView';
import AdminView from './AdminView';
import CommiteeView from './CommiteeView';
import DirectorView from './DirectorView';
import StoreView from './StoreView';
const Dashboards = ({ match }) => {
  return (
    <Switch>
      <Route
        path={`${match.url}/student/:complaintId`}
        render={(props) => <StudentView {...props} />}
      />

      <Route
        path={`${match.url}/admin/:complaintId`}
        render={(props) => <AdminView {...props} />}
      />

      <Route
        path={`${match.url}/hod/:complaintId`}
        render={(props) => <HodView {...props} />}
      />

      <Route
        path={`${match.url}/committee/:complaintId`}
        render={(props) => <CommiteeView {...props} />}
      />
       <Route
        path={`${match.url}/director/:complaintId`}
        render={(props) => <DirectorView {...props} />}
      />
       <Route
        path={`${match.url}/store/:complaintId`}
        render={(props) => <StoreView {...props} />}
      />

      <Redirect to="/error" />
    </Switch>
  );
};

export default Dashboards;
