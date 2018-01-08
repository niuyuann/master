import React from 'react';
import { Router, Route, Redirect } from 'dva/router';
import IndexPage from './routes/IndexPage';
import PartData from "./components/PartData/PDItem.js";

function RouterConfig({ history }) {
  return (
    <Router history={history}>
    <div>
      <Redirect from="/" to="/PartData" /> 
      <Route path="/PartData" component={PartData}/>
    </div>
    </Router>
  );
}

export default RouterConfig;

