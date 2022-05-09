import jwt from 'jsonwebtoken'
import {REFRESH_TOKEN} from "./gqlQueries";
import {ApolloClient, ApolloLink, createHttpLink, fromPromise, InMemoryCache, useQuery} from "@apollo/client";
import {setContext} from "@apollo/client/link/context";
import {onError} from "@apollo/client/link/error";

const link = createHttpLink({
    uri: process.env.REACT_APP_API_URL,
});

const authLink = setContext((_, {headers}) => {
    const token = localStorage.getItem('access_token');
    return {
        headers: {
            ...headers,
            Authorization: token ? `Bearer ${token}` : "",
        }
    }
});

const errorLink = onError(
    ({graphQLErrors, networkError, operation, forward}) => {
        if (graphQLErrors) {
            console.log('adadsasd', graphQLErrors)
            for (let err of graphQLErrors) {
                switch (err.extensions.code) {
                    case "UNAUTHENTICATED":
                        return fromPromise(
                            getNewToken().catch((error) => {
                                // Handle token refresh errors e.g clear stored tokens, redirect to login
                                return;
                            })
                        )
                            .filter((value) => Boolean(value))
                            .flatMap((accessToken) => {
                                const oldHeaders = operation.getContext().headers;
                                // modify the operation context with a new token
                                operation.setContext({
                                    headers: {
                                        ...oldHeaders,
                                        authorization: `Bearer ${accessToken}`,
                                    },
                                });

                                // retry the request, returning the new observable
                                return forward(operation);
                            });
                }
            }
        }
    }
);


export const apolloClient = new ApolloClient({
    link: ApolloLink.from([errorLink,authLink, link]),
    cache: new InMemoryCache(),
});

export const isAuthenticated = () => {
    const token = localStorage.getItem('access_token');

    if (token) {
        const {expire_in} = jwt.decode(token)
        return new Date(expire_in) > new Date()
    }
    return false;
}

const getNewToken = () => {
    return apolloClient.mutate({mutation: REFRESH_TOKEN, variables: {refresh_token: localStorage.getItem('refresh_token')}}).then((response) => {

        console.log(response)
        const {access_token, refresh_token} = response.data.refreshToken;


        localStorage.setItem('access_token', access_token);
        localStorage.setItem('refresh_token', refresh_token);
    });
};

export const getEmailFromInvitation = (token) => {
    if (token) {
        const {email} = jwt.decode(token)
        return email
    }
    return false;
}
