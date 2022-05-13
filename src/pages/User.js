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
    const [editUser, {loading: loadingEditUser, error: errorEditUser}] = useMutation(EDIT_USER)

    const validate = Yup.object().shape({
        name: Yup.string()
            .min(1, 'Nazwa użytkownika jest za krótka'),
        email: Yup.string().email('Niepoprawny adres email'),
        password: Yup.string()
            .min(8, "Hasło musi mieć min. 8 znaków")
            .matches(/^(?=.*[A-Z])/, 'Hasło musi zawierać min. 1 duża literę')
            .matches(/^(?=.*[a-z])/, 'Hasło musi zawierać min. 1 małą literę')
            .matches(/^(?=.*\d)/, 'Hasło musi zawierać min. 1 liczbę.')
            .matches(/^(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]/, 'Hasło musi zawierać min. 1 znak specjalny.'),
        oldPassword: Yup.string()
            .required("Hasło jest wymagane")
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
                                    password: '',
                                    oldPassword: '',
                                    notifications: data.me.notifications,
                                    notifications_alerts: data.me.notifications_alerts
                                }}
                                validationSchema={validate}
                                onSubmit={(values) => {
                                    editUser({
                                        variables: {
                                            name: values.name == '' ? undefined : values.name,
                                            email: values.email == '' ? undefined : values.email,
                                            password: values.password == '' ? undefined : values.password,
                                            oldPassword: values.oldPassword,
                                            notifications: values.notifications,
                                            notifications_alerts: values.notifications_alerts,
                                        }
                                    }).then(() => {
                                        localStorage.setItem('user', values.name);
                                        usersRefeach()
                                    })
                                }}
                            >
                                <Form>
                                    <Field id={"name"} name={"name"} type="text"
                                           className="form-control mb-1" placeholder="Nazwa"
                                    />
                                    <ErrorMessage name="name"
                                                  render={msg => <div className={'form-error'}>{msg}</div>}/>
                                    <Field id={"email"} name={"email"} type="text"
                                           className="form-control mb-1" placeholder="Email"
                                    />
                                    <ErrorMessage name="email"
                                                  render={msg => <div className={'form-error'}>{msg}</div>}/>
                                    <Field id={"oldPassword"} name={"oldPassword"} type="password"
                                           className="form-control mb-1" placeholder="Hasło"
                                    />
                                    <ErrorMessage name="oldPassword"
                                                  render={msg => <div className={'form-error'}>{msg}</div>}/>
                                    <Field id={"password"} name={"password"} type="password"
                                           className="form-control mb-1" placeholder="Nowe Hasło"
                                    />
                                    <ErrorMessage name="password"
                                                  render={msg => <div className={'form-error'}>{msg}</div>}/>
                                    <h4 className={'mt-3'}>Powiadomienia email</h4>
                                    <Field name={'notifications'}>
                                        {({field, form, meta}) => {
                                            return (<BootstrapForm.Check
                                                {...field}
                                                type="switch"
                                                checked={field.value}
                                                label="Otrzymuj codziennie informacje z podsumowaniem dnia"
                                            />)
                                        }}
                                    </Field>
                                    <Field name={'notifications_alerts'}>
                                        {({field, form, meta}) => {
                                            return (<BootstrapForm.Check
                                                {...field}
                                                type="switch"
                                                checked={field.value}
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
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default User;
