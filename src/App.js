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
import {ApolloProvider, ApolloClient, createHttpLink, InMemoryCache, useApolloClient} from "@apollo/client";
import {setContext} from "@apollo/client/link/context";
import {isAuthenticated} from "./helpers/config";
import Register from "./pages/Register";

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
    const link = createHttpLink({
        uri: 'http://localhost:4000/graphql',
    });

    const authLink = setContext((_, { headers }) => {
        const token = localStorage.getItem('access_token');
        return {
            headers: {
                ...headers,
                Authorization: token ? `Bearer ${token}` : "",
            }
        }
    });

    const client = new ApolloClient({
        link: authLink.concat(link),
        cache: new InMemoryCache()
    });

    return (
        <ApolloProvider client={client}>
            {children}
        </ApolloProvider>
    );
}

function PrivateRoute({children, ...rest}) {
    const client = useApolloClient();

    console.log(client)

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
