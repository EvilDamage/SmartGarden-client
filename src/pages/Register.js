import React, {useState} from "react";
import {useMutation} from "@apollo/client";
import {LOGIN_USER} from "../helpers/gqlQueries";
import {useHistory} from "react-router-dom";
import {Modal} from 'react-bootstrap';

const Register = () => {
    const history = useHistory();

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [modalVisibility, setModalVisibility] = useState(false)

    const [client, {data, loading, error}] = useMutation(LOGIN_USER);

    return (
        <div className="container-fluid" id={"register"}>
            <div className="row">
                <div className="col-md-7 login-side">
                    <div className={'login-container'}>
                        <h1>Rejestracja</h1>
                        <p className="lead mb-4">
                            Zobacz rozwój swojego ogrodu i uzyskaj dostęp do historii!
                        </p>
                        {error &&
                        <div className="alert alert-warning alert-dismissible fade show" role="alert">
                            <strong>Uwaga!</strong> Nie udało się zarejestrować
                        </div>
                        }
                        <label className="form-label">Imię</label>
                        <input type="email" className="form-control" placeholder="Jan"
                               onChange={(e) => setEmail(e.target.value)}/>
                        <label className="form-label mt-2">Adres Email</label>
                        <input type="email" className="form-control" placeholder="mail@website.com"
                               onChange={(e) => setEmail(e.target.value)}/>
                        <label className="form-label mt-2">Hasło</label>
                        <input type="password" className="form-control" placeholder="Min. 8 znaków"
                               onChange={(e) => setPassword(e.target.value)}/>
                        <button type="button" className="btn btn-primary"
                                onClick={() => client({variables: {email: email, password: password}}).then((res) => {
                                    if (res.data.login) {
                                        localStorage.setItem('access_token', res.data.login.access_token);
                                        localStorage.setItem('refresh_token', res.data.login.refresh_token);
                                        history.push('/')
                                    }
                                })}>
                            {!loading ? 'Zarejestruj' :
                                <div className="spinner-border spinner-border-sm" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            }
                        </button>
                    </div>
                </div>
                <div className="col-md-5 carousel-side"/>
            </div>
        </div>
    )
}

export default Register;
