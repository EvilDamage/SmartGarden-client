import React, {useState} from "react";
import {useMutation} from "@apollo/client";
import {LOGIN_USER} from "../helpers/gqlQueries";
import {useHistory} from "react-router-dom";

const Login = () => {
    const history = useHistory();

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [ client, { data, loading, error }] = useMutation(LOGIN_USER);

    return (
        <div>
            <input type="text" className="form-control" placeholder="email" onChange={(e)=> setEmail(e.target.value)}/>
            <input type="password" className="form-control" placeholder="hasło" onChange={(e)=> setPassword(e.target.value)}/>
            <button type="button" className="btn btn-primary" onClick={()=> client({variables: {email: email, password: password}}).then((res)=>{
                if(res.data.login){
                    localStorage.setItem('access_token', res.data.login.access_token);
                    localStorage.setItem('refresh_token', res.data.login.refresh_token);
                    // history.push('/')
                }
            })}>Zaloguj</button>
        </div>
    )
}

export default Login;
