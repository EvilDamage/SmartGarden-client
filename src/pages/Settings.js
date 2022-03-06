import {Button, Form as BootstrapForm, Spinner} from "react-bootstrap";
import {useMutation, useQuery} from "@apollo/client";
import {
    ADD_USER,
    DELETE_USER,
    EDIT_USER,
    GET_SETTINGS,
    GET_USER,
    GET_USERS,
    UPDATE_SETTINGS,
    EDIT_USER_PERMISSION
} from "../helpers/gqlQueries";
import Banner from "../components/Banner";
import React, {useEffect, useState} from "react";
import {FiCheck, FiUserMinus} from "react-icons/fi";
import {Formik, Field, Form, ErrorMessage} from 'formik';
import * as Yup from "yup";

const Settings = () => {
    const [pump, setPump] = useState(false);
    const [pumpFertilizer, setPumpFertilizer] = useState(false);
    const [light, setLight] = useState(false);
    const [fan, setFan] = useState(false);
    const [mode, setMode] = useState(false);
    const [interval, setInterval] = useState(false);

    const {data, loading, error} = useQuery(GET_SETTINGS);
    const [updateSettings, {loading: loadingUpdateSettings, error: ErrorUpdateSettings}] = useMutation(UPDATE_SETTINGS);

    const [addEmail, setAddEmail] = useState('')

    const {data: usersList, refetch: usersRefeach} = useQuery(GET_USERS)
    const {data: userData} = useQuery(GET_USER)
    const [addUser, {loading: loadingAddUser, error: errorAddUser}] = useMutation(ADD_USER)
    const [editUser, {loading: loadingEditUser, error: errorEditUser}] = useMutation(EDIT_USER)
    const [editUserPermission, {
        loading: loadingEditUserPermission,
        error: errorEditUserPermission
    }] = useMutation(EDIT_USER_PERMISSION)
    const [deleteUser, {loading: LoadingDeleteUser, error: errorDeleteUser}] = useMutation(DELETE_USER)

    useEffect(() => {
        if (data) {
            setPump(data.settings.pump)
            setPumpFertilizer(data.settings.pump_fertilizer)
            setLight(data.settings.light)
            setFan(data.settings.fan)
            setInterval(data.settings.interval)
            setMode(data.settings.mode)
        }
    }, [data])

    const validateEmail = Yup.object().shape({
        email: Yup.string()
            .email('Niepoprawny adres email')
            .required("Pole jest wymagane"),
    });

    return (
        <div id={'settings'}>
            <Banner title={'Ustawienia'}/>
            <div className={'container mt-3'}>
                <div className={'row'}>
                    <div className={'col-lg-6'}>
                        <h4>Ustawienia systemu</h4>
                        {loading &&
                        <div className={'mt-3'} style={{textAlign: 'center'}}>
                            <Spinner animation="border" variant="primary" className={'spinner'}
                                     style={{height: '6em', width: '6em'}}/>
                            <p>Ładowanie</p>
                        </div>
                        }
                        {data &&
                        <>
                            <BootstrapForm>
                                <label className="form-label">Tryb pracy</label>
                                <BootstrapForm.Select value={mode} onChange={(e) => setMode(e.target.value)}>
                                    <option value="manual">Manual</option>
                                    <option value="plan">Plan</option>
                                    <option value="off">Off</option>
                                </BootstrapForm.Select>
                                <label className="form-label mt-3">Interwał odczytów (min)</label>
                                <BootstrapForm.Select value={interval}
                                                      onChange={(e) => setInterval(e.target.value)}>
                                    <option value="1">1</option>
                                    <option value="5">5</option>
                                    <option value="10">10</option>
                                    <option value="30">30</option>
                                    <option value="60">60</option>
                                    <option value="120">120</option>
                                </BootstrapForm.Select>
                                <div className={'mt-3'}>
                                    <BootstrapForm.Check
                                        type="switch"
                                        checked={pump}
                                        onClick={() => setPump(!pump)}
                                        label="Dozowanie wody"
                                    />
                                    <BootstrapForm.Check
                                        type="switch"
                                        checked={pumpFertilizer}
                                        onClick={() => setPumpFertilizer(!pumpFertilizer)}
                                        label="Dozowanie nawozu"
                                    />
                                    <BootstrapForm.Check
                                        type="switch"
                                        checked={light}
                                        onClick={() => setLight(!light)}
                                        label="Oświetlenie"
                                    />
                                    <BootstrapForm.Check
                                        type="switch"
                                        checked={fan}
                                        onClick={() => setFan(!fan)}
                                        label="Wentylacja"
                                    />
                                </div>
                                <button type="button" className="btn btn-primary mt-3"
                                        onClick={() => {
                                            updateSettings({
                                                variables: {
                                                    mode: mode,
                                                    interval: parseInt(interval),
                                                    pump: pump,
                                                    pump_fertilizer: pumpFertilizer,
                                                    light: light,
                                                    fan: fan
                                                }
                                            })
                                        }}>
                                    {!loadingUpdateSettings ? 'Zapisz' :
                                        <div className="spinner-border spinner-border-sm" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    }
                                </button>
                            </BootstrapForm>
                        </>
                        }
                    </div>
                    <div className={'col-lg-6'}>
                        <h4>Zaproś nowego użytkownika</h4>
                        <Formik
                            initialValues={{
                                email: '',
                            }}
                            validationSchema={validateEmail}
                            onSubmit={(values, {resetForm}) => {
                                addUser({
                                    variables: {
                                        email: values.email
                                    }
                                }).then(() => {
                                    resetForm()
                                })
                            }}
                        >
                            <Form>
                                <label className="form-label">Adres Email</label>
                                <Field id={"email"} name={"email"} type="text"
                                       className="form-control mb-1" placeholder="Email"
                                />
                                <ErrorMessage name="email" render={msg => <div className={'form-error'}>{msg}</div>}/>
                                <button type="submit" className="btn btn-primary mt-3" disabled={loadingAddUser}>
                                    {!loadingAddUser ? 'Zapisz' :
                                        <div className="spinner-border spinner-border-sm" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>}
                                </button>
                            </Form>
                        </Formik>
                        <h4 className={'mt-3'}>Lista użytkowników</h4>
                        <ul className="list-group">
                            {
                                userData && userData.me.role === 'ADMIN' && usersList && usersList.users.map((user) => {
                                    return (
                                        <li className={user.confirmed ? "list-group-item list-item" : "list-group-item list-item list-group-item-dark"}
                                            style={{height: '50px'}}>
                                            <div className={'user-name'}>
                                                <span style={{marginRight: '0.5rem'}}>{user.name}</span>
                                                <span className={"text-muted small"}>{user.email}</span>
                                            </div>
                                            {
                                                userData && userData.me.id !== user.id &&
                                                <div className={'user-manage'}>
                                                    <BootstrapForm.Select className={'w-50'} defaultValue={user.role}
                                                                          onChange={(e) => {
                                                                              editUserPermission({
                                                                                  variables: {
                                                                                      id: user.id,
                                                                                      role: e.target.value
                                                                                  }
                                                                              })
                                                                          }}>
                                                        <option value="ADMIN">Admin</option>
                                                        <option value="VISITOR">Gość</option>
                                                    </BootstrapForm.Select>
                                                    {!user.confirmed_by_admin &&
                                                    <button type="button" className="btn btn-success btn-list"
                                                            onClick={() => {
                                                                editUserPermission({
                                                                    variables: {
                                                                        id: user.id,
                                                                        confirmed_by_admin: true
                                                                    }
                                                                }).then(()=>{
                                                                    usersRefeach()
                                                                })
                                                            }}>
                                                        <FiCheck/>
                                                    </button>
                                                    }
                                                    <button type="button" className="btn btn-danger btn-list"
                                                            onClick={() => {
                                                                deleteUser({
                                                                    variables: {
                                                                        id: user.id
                                                                    }
                                                                }).then(() => {
                                                                    usersRefeach()
                                                                })
                                                            }}>
                                                        <FiUserMinus/>
                                                    </button>
                                                </div>
                                            }
                                        </li>
                                    )
                                })
                            }
                                </ul>
                                </div>
                                </div>
                                </div>
                                </div>
                                )
                            }

export default Settings;
