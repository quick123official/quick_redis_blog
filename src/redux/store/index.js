/**
 * @description: store
 * @param {type}
 * @return:
 */
import appReducer from "@/redux/reducers";
import { createStore, applyMiddleware, compose } from "redux";
import thunkMiddleware from "redux-thunk";
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
    : compose;

const store = createStore(
    appReducer,
    composeEnhancers(applyMiddleware(thunkMiddleware))
);
export default store;
