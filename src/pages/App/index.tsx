import React, { Suspense } from "react";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import logger from "redux-logger";
import reducers from "@/redux";
import { BrowserRouter as Router } from "react-router-dom";
import { renderRoutes } from "react-router-config";
import { mainRouterList } from "@/router";
import "@/assets/theme/_antdTheme.less";
import "./index.scss";

const store = createStore(reducers, applyMiddleware(thunk, logger));

const App: React.FC = () => {
  return (
    <Router>
      <Provider store={store}>
        <div className="App">
          <Suspense fallback={<div>Loading...</div>}>{renderRoutes(mainRouterList)}</Suspense>
        </div>
      </Provider>
    </Router>
  );
};

export default App;
