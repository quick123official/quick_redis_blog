import { combineReducers } from "redux";

import HostDataReducer from "@/redux/reducers/HostDataReducer";
import HostTabsReducer from "@/redux/reducers/HostTabsReducer";

const appReducer = combineReducers({
    hostDataReducer: HostDataReducer,
    hostTabsReducer: HostTabsReducer
});
export default appReducer;
