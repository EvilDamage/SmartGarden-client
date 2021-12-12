import React, {useState} from "react";
import {useMutation} from "@apollo/client";
import {LOGIN_USER} from "../helpers/gqlQueries";
import {useHistory} from "react-router-dom";
import {Modal} from 'react-bootstrap';

const Login = () => {
    const history = useHistory();

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [modalVisibility, setModalVisibility] = useState(false)

    const [client, {data, loading, error}] = useMutation(LOGIN_USER);

    return (
        <div className="container-fluid" id={"login"}>
            <div className="row">
                <div className="col-md-7 login-side">
                    <div className={'login-container'}>
                        <h1>Login</h1>
                        <p className="lead mb-4">
                            Zobacz rozwój swojego ogrodu i uzyskaj dostęp do historii!
                        </p>
                        {error &&
                            <div className="alert alert-warning alert-dismissible fade show" role="alert">
                                <strong>Uwaga!</strong> Nie udało się zalogować
                            </div>
                        }
                        <label className="form-label">Adres Email</label>
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
                            {!loading ? 'Zaloguj' :
                                <div className="spinner-border spinner-border-sm" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            }
                        </button>
                        <p className={'mt-3'}>Nie pamiętasz hasła? <span className={'password-reminder'} onClick={() => setModalVisibility(true)}>Przypomnij hasło</span>
                        </p>
                    </div>
                </div>
                <div className="col-md-5 carousel-side"></div>
            </div>
            <Modal
                show={modalVisibility}
                size="md"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Nie pamiętasz hasła?
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className={'container'}>
                        <label className="form-label">Adres Email</label>
                        <input type="email" className="form-control" placeholder="mail@website.com"
                               onChange={(e) => setEmail(e.target.value)}/>
                        <button type="button" className="btn btn-primary"
                                onClick={() => client({variables: {email: email, password: password}}).then((res) => {
                                    if (res.data.login) {
                                        localStorage.setItem('access_token', res.data.login.access_token);
                                        localStorage.setItem('refresh_token', res.data.login.refresh_token);
                                        history.push('/')
                                    }
                                })}>
                            {!loading ? 'Przypomnij' :
                                <div className="spinner-border spinner-border-sm" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            }
                        </button>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default Login;
