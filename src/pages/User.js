import Banner from "../components/Banner";
import React, {useEffect, useState} from "react";
import {useMutation, useQuery} from "@apollo/client";
import {ADD_USER, DELETE_USER, EDIT_USER, GET_USER, GET_USERS} from "../helpers/gqlQueries";
import {FiUserMinus, FiUserPlus} from 'react-icons/fi'

import {Formik, Field, Form, ErrorMessage} from 'formik';
import * as Yup from "yup";
import {Form as BootstrapForm} from "react-bootstrap";

const User = () => {
    const [notifications, setNotifications] = useState('')

    const {data: usersList, refetch: usersRefeach} = useQuery(GET_USERS)
    const {data} = useQuery(GET_USER)
    const [addUser, {loading: loadingAddUser, error: errorAddUser}] = useMutation(ADD_USER)
    const [editUser, {loading: loadingEditUser, error: errorEditUser}] = useMutation(EDIT_USER)
    const [deleteUser, {loading: LoadingDeleteUser, error: errorDeleteUser}] = useMutation(DELETE_USER)

    const validate = Yup.object().shape({
        name: Yup.string()
            .min(1, 'Nazwa użytkownika jest za krótka'),
        email: Yup.string().
            email('Niepoprawny adres email'),
        password: Yup.string()
            .min(8, "Hasło jest za krótkie")
    });

    return (
        <div id={'user-panel'}>
            <Banner title={'Panel użytkownika'}/>
            <div className={'container mt-3'}>
                <div className={'row'}>
                    <div className={'col-lg-6'}>
                        <h4>Edytuj swoje dane</h4>
                        {data &&
                        <Formik
                            initialValues={{
                                name: data.me.name || '',
                                email: data.me.email || '',
                                password: ''
                            }}
                            validationSchema={validate}
                            onSubmit={(values) => {
                                editUser({
                                    variables: {
                                        name: values.name == '' ? undefined : values.name,
                                        email: values.email == '' ? undefined : values.email,
                                        password: values.password == '' ? undefined : values.password,
                                    }
                                }).then(() => {
                                    usersRefeach()
                                })
                            }}
                        >
                            <Form>
                                <Field id={"name"} name={"name"} type="text"
                                       className="form-control mb-1" placeholder="Nazwa"
                                />
                                <ErrorMessage name="name" render={msg => <div className={'form-error'}>{msg}</div>} />
                                <Field id={"email"} name={"email"} type="text"
                                       className="form-control mb-1" placeholder="Email"
                                />
                                <ErrorMessage name="email" render={msg => <div className={'form-error'}>{msg}</div>} />
                                <Field id={"password"} name={"password"} type="password"
                                       className="form-control mb-1" placeholder="Hasło"
                                />
                                <ErrorMessage name="password" render={msg => <div className={'form-error'}>{msg}</div>} />
                                <button type="submit" className="btn btn-primary" disabled={loadingEditUser}>
                                    {!loadingEditUser ? 'Zapisz' :
                                        <div className="spinner-border spinner-border-sm" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>}
                                </button>
                            </Form>
                        </Formik>
                        }
                    </div>
                    <div className={'col-lg-6'}>
                        <h4>Powiadomienia email</h4>
                        <Formik>
                            <Form>
                                <Field name={'notification'}>
                                    {({field, form, meta}) => {
                                        console.log(field)
                                        return (<BootstrapForm.Check
                                            type="switch"
                                            checked={notifications}
                                            onClick={() => setNotifications(!notifications)}
                                            label="Otrzymuj codziennie informacje z podsumowaniem dnia"
                                        />)
                                    }}
                                </Field>
                                <Field name={'alerts'}>
                                    {({field, form, meta}) => {
                                        console.log(field)
                                        return (<BootstrapForm.Check
                                            type="switch"
                                            checked={notifications}
                                            onClick={() => setNotifications(!notifications)}
                                            label="Otrzymuj informacje o możliwych awariach"
                                        />)
                                    }}
                                </Field>
                                <button type="submit" className="btn btn-primary mt-3" disabled={loadingEditUser}>
                                    {!loadingEditUser ? 'Zapisz' :
                                        <div className="spinner-border spinner-border-sm" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>}
                                </button>
                            </Form>
                        </Formik>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default User;
