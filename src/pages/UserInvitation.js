import React, {useEffect} from "react";
import {useHistory} from "react-router-dom";
import {ErrorMessage, Field, Form, Formik} from "formik";
import * as Yup from "yup";
import {getEmailFromInvitation} from "../helpers/config";
import {useMutation} from "@apollo/client";
import {CONFIRM_EMAIL, REGISTER_INVITED_USER} from "../helpers/gqlQueries";

const UserInvitation = () => {
    const history = useHistory();
    const url = window.location;
    const invitationToken = new URLSearchParams(url.search).get('invitation_token');

    const validate = Yup.object().shape({
        name: Yup.string().required('Pole jest wymagane'),
        password: Yup.string().required('Pole jest wymagane'),
        passwordConfirmation: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Hasła muszą być identyczne')
            .required('Pole jest wymagane'),
        token: Yup.string().required('Pole jest wymagane')
    })

    useEffect(()=>{
        let email = getEmailFromInvitation(invitationToken)
        if(email === false){
            // history.push('/')
        }
    }, [])


    const [invitationUserRegister, {data, loading, error}] = useMutation(REGISTER_INVITED_USER)

    return (
        <div className="container-fluid" id={"login"}>
            <div className="row">
                <div className="col-md-7 login-side">
                    <div className={'login-container w-50'}>
                        <h1>Zaproszenie do systemu</h1>
                        <p className="lead mb-4">
                            Wprowadź swoje dane
                        </p>
                        <Formik
                            initialValues={{
                                name: '',
                                email: '',
                                password: '',
                                passwordConfirmation: '',
                                token: new URLSearchParams(url.search).get('invitation_token')
                            }}
                            validationSchema={validate}
                            onSubmit={(values)=>{
                                invitationUserRegister({
                                    variables:{
                                        name: values.name,
                                        password: values.password,
                                        token: values.token
                                    }
                                }).then(()=>{
                                    history.push('/')
                                })
                            }}>
                            <Form>
                                <label className="form-label">Nazwa użytkownika</label>
                                <Field id={"name"} name={"name"} type="text"
                                       className="form-control" placeholder="Jan"
                                />
                                <label className="form-label">Emial</label>
                                <Field id={"email"} name={"email"} type="email" disabled={true}
                                       className="form-control" value={getEmailFromInvitation(new URLSearchParams(url.search).get('invitation_token'))}
                                />
                                <label className="form-label">Hasło</label>
                                <Field id={"password"} name={"password"} type="password"
                                       className="form-control" placeholder="Min. 8 znaków"
                                />
                                <label className="form-label">Potwierdź hasło</label>
                                <Field id={"passwordConfirmation"} name={"passwordConfirmation"} type="password"
                                       className="form-control" placeholder="Min. 8 znaków"
                                />
                                <button type="submit" className="btn btn-primary mt-3" disabled={loading}>
                                    {!loading ? 'Zapisz' :
                                        <div className="spinner-border spinner-border-sm" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>}
                                </button>
                            </Form>
                        </Formik>
                    </div>
                </div>
                <div className="col-md-5 carousel-side"></div>
            </div>
        </div>
    )
}

export default UserInvitation;
