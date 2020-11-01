import React from "react";
import ReactDOM from "react-dom";
import App from "@/app/App";
import { Provider } from "react-redux";
import store from "@/redux/store";
import ErrorBoundary from "@/components/ErrorBoundary";
import * as serviceWorker from "@/serviceWorker";

ReactDOM.render(
    <Provider store={store}>
        <ErrorBoundary>
            <App />
        </ErrorBoundary>
    </Provider>,
    document.getElementById("root")
);

serviceWorker.unregister();
