import React, {useContext, createContext, useState} from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect, useHistory
} from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import NoMatch from "./pages/NoMatch";

const authContext = createContext();

function App() {
    return (
        <ProvideAuth>
            <Router>
                <Switch>
                    <Route path="/login">
                        <Login/>
                    </Route>
                    <PrivateRoute exact path="/">
                        <Home/>
                    </PrivateRoute>
                    <Route component={NoMatch} />
                </Switch>
            </Router>
        </ProvideAuth>
    );
}

function ProvideAuth({children}) {
    //TODO: add auth
    const auth = {user: false};
    return (
        <authContext.Provider value={auth}>
            {children}
        </authContext.Provider>
    );
}

function PrivateRoute({children, ...rest}) {
    let auth = useContext(authContext);
    return (
        <Route
            {...rest}
            render={({location}) =>
                auth.user ? (
                    children
                ) : (
                    <Redirect
                        to={{
                            pathname: "/login",
                            state: {from: location}
                        }}
                    />
                )
            }
        />
    );
}

export default App;
