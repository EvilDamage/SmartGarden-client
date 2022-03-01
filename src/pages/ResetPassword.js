import React, {useState} from "react";
import {useHistory} from "react-router-dom";
import {ErrorMessage, Field, Form, Formik} from "formik";
import * as Yup from "yup";
import {useMutation} from "@apollo/client";
import {SET_NEW_PASSWORD} from "../helpers/gqlQueries";


const ResetPassword = () => {
    const history = useHistory();
    const url = window.location;

    const [setNewPassword, {data, loading, error}] = useMutation(SET_NEW_PASSWORD)

    const validate = Yup.object().shape({
        password: Yup.string().required('Pole jest wymagane'),
        passwordConfirmation: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Hasła muszą być identyczne')
            .required('Pole jest wymagane'),
        token: Yup.string().required('Pole jest wymagane')
    })

    return (
        <div className="container-fluid" id={"login"}>
            <div className="row">
                <div className="col-md-7 login-side">
                    <div className={'login-container w-50'}>
                        <h1>Ustaw nowe hasło</h1>
                        <p className="lead mb-4">
                            Ustaw nowe hasło dla swojego konta
                        </p>
                        {/*{error &&*/}
                        {/*<div className="alert alert-danger alert-dismissible fade show" role="alert">*/}
                        {/*    <strong>Uwaga!</strong> Nie udało się ustawić nowego hasła*/}
                        {/*</div>*/}
                        {/*}*/}
                        <Formik
                            initialValues={{
                                password: '',
                                passwordConfirmation: '',
                                token: new URLSearchParams(url.search).get('reset_token')
                            }}
                            validationSchema={validate}
                            onSubmit={(values) => {
                                setNewPassword({
                                    variables: {
                                        password: values.password,
                                        token: values.token
                                    }
                                }).then(() => {
                                    history.push('/')
                                })
                            }}
                        >
                            <Form>
                                <label className="form-label">Hasło</label>
                                <Field id={"password"} name={"password"} type="password"
                                       className="form-control" placeholder="Min. 8 znaków"
                                />
                                <ErrorMessage name="password"
                                              render={msg => <div className={'form-error'}>{msg}</div>}/>
                                <label className="form-label">Powtórz hasło</label>
                                <Field id={"passwordConfirmation"} name={"passwordConfirmation"} type="password"
                                       className="form-control" placeholder="Min. 8 znaków"
                                />
                                <ErrorMessage name="passwordConfirmation"
                                              render={msg => <div className={'form-error'}>{msg}</div>}/>
                                <button type="submit" className="btn btn-primary mt-3" disabled={false}>
                                    Zapisz
                                    {/*{!loadingUpdateManualPlan ? 'Zapisz' :*/}
                                    {/*    <div className="spinner-border spinner-border-sm" role="status">*/}
                                    {/*        <span className="visually-hidden">Loading...</span>*/}
                                    {/*    </div>}*/}
                                </button>
                            </Form>
                        </Formik>
                        <p className={'mt-3'}>Pamiętasz swoje hasło? <span className={'password-reminder'}
                                                                           onClick={() => history.push('/login')}>Zaloguj</span>
                        </p>
                        <p>Nie masz konta? <span className={'password-reminder'}
                                                 onClick={() => history.push('/register')}>Utwórz</span>
                        </p>
                    </div>
                </div>
                <div className="col-md-5 carousel-side"></div>
            </div>
        </div>
    )
}

export default ResetPassword;
