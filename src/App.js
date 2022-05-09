import React, {useContext, createContext, useState, useEffect} from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect, useHistory
} from "react-router-dom";
import Login from "./pages/Login";
import ContentWrapper from "./components/ContentWrapper";
import NoMatch from "./pages/NoMatch";
import {
    ApolloProvider,
    ApolloClient,
    createHttpLink,
    InMemoryCache,
} from "@apollo/client";
import {setContext} from "@apollo/client/link/context";
import Register from "./pages/Register";
import Stats from "./pages/Stats";
import Settings from "./pages/Settings";
import User from "./pages/User";
import Home from "./pages/Home";
import Plans from "./pages/Plans";
import {apolloClient, isAuthenticated} from "./helpers/config";
import ResetPassword from "./pages/ResetPassword";
import EmailConfirmation from "./pages/EmailConfirmation";
import UserInvitation from "./pages/UserInvitation";

function App() {
    return (
        <ProvideAuth>
            <Router>
                <Switch>
                    <Route path="/login">
                        <Login/>
                    </Route>
                    <Route path="/register">
                        <Register/>
                    </Route>
                    <Route path="/reset-password">
                        <ResetPassword/>
                    </Route>
                    <Route path="/email-confirmation">
                        <EmailConfirmation/>
                    </Route>
                    <Route path="/invitation">
                        <UserInvitation/>
                    </Route>
                    <PrivateRoute exact path="/">
                        <ContentWrapper><Home/></ContentWrapper>
                    </PrivateRoute>
                    <PrivateRoute exact path="/plans">
                        <ContentWrapper><Plans/></ContentWrapper>
                    </PrivateRoute>
                    <PrivateRoute exact path="/stats">
                        <ContentWrapper><Stats/></ContentWrapper>
                    </PrivateRoute>
                    <PrivateRoute exact path="/settings">
                        <ContentWrapper><Settings/></ContentWrapper>
                    </PrivateRoute>
                    <PrivateRoute exact path="/users">
                        <ContentWrapper><User/></ContentWrapper>
                    </PrivateRoute>
                    <Route component={NoMatch}/>
                </Switch>
            </Router>
        </ProvideAuth>
    );
}

function ProvideAuth({children}) {
    return (
        <ApolloProvider client={apolloClient}>
            {children}
        </ApolloProvider>
    );
}

function PrivateRoute({children, ...rest}) {
    const client = isAuthenticated()

    return (
        <Route
            {...rest}
            render={({location}) =>
                client ? (
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
