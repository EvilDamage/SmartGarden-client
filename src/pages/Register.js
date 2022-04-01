import React, {useState} from "react";
import {useMutation} from "@apollo/client";
import {LOGIN_USER, REGISTER_USER} from "../helpers/gqlQueries";
import {useHistory} from "react-router-dom";
import {Modal} from 'react-bootstrap';
import {onError} from "@apollo/client/link/error";
import {ErrorMessage, Field, Form, Formik} from "formik";
import * as Yup from "yup";

const Register = () => {
    const history = useHistory();
    const [register, {data, loading, error}] = useMutation(REGISTER_USER);

    const validate = Yup.object().shape({
        name: Yup.string()
            .min(1, 'Nazwa użytkownika jest za krótka'),
        email: Yup.string()
            .email('Niepoprawny adres email')
            .required('Pole jest wymagane'),
        password: Yup.string()
            .min(8, "Hasło musi mieć min. 8 znaków")
            .matches(/^(?=.*[A-Z])/, 'Hasło musi zawierać min. 1 duża literę')
            .matches(/^(?=.*[a-z])/, 'Hasło musi zawierać min. 1 małą literę')
            .matches(/^(?=.*\d)/, 'Hasło musi zawierać min. 1 liczbę.')
            .matches(/^(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]/, 'Hasło musi zawierać min. 1 znak specjalny.')
    });

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
                        <Formik
                            initialValues={{
                                name: '',
                                email: '',
                                password: '',
                            }}
                            validationSchema={validate}
                            onSubmit={(values, {resetForm}) => {
                                register({
                                    variables: {
                                        name: values.name,
                                        email: values.email,
                                        password: values.password
                                    }
                                }).then((res) => {
                                    if (res.data.register) {
                                        history.push('/login', {registerSuccess: true})
                                    }
                                }).catch((e) => {
                                    console.error(e)
                                })
                            }}>
                            <Form>
                                <label className="form-label">Nazwa</label>
                                <Field id={"name"} name={"name"} type="text"
                                       className="form-control mb-1" placeholder="Nazwa"
                                />
                                <ErrorMessage name="name" render={msg => <div className={'form-error'}>{msg}</div>}/>
                                <label className="form-label">Adres Email</label>
                                <Field id={"email"} name={"email"} type="text"
                                       className="form-control mb-1" placeholder="mail@website.com"
                                />
                                <ErrorMessage name="email" render={msg => <div className={'form-error'}>{msg}</div>}/>
                                <label className="form-label">Hasło</label>
                                <Field id={"password"} name={"password"} type="password"
                                       className="form-control mb-1" placeholder="Min. 8 znaków"
                                />
                                <ErrorMessage name="password" render={msg => <div className={'form-error'}>{msg}</div>}/>
                                <button type="submit" className="btn btn-primary mt-3">
                                    {!loading ? 'Zarejestruj' :
                                        <div className="spinner-border spinner-border-sm" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    }
                                </button>
                            </Form>
                        </Formik>
                        <p className={'mt-3'}>Masz konto? <span className={'password-reminder'}
                                                 onClick={() => history.push('/login')}>Zaloguj</span>
                        </p>
                    </div>
                </div>
                <div className="col-md-5 carousel-side"/>
            </div>
        </div>
    )
}

export default Register;
