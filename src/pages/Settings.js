import {Button, Form as BootstrapForm, OverlayTrigger, Spinner, Toast, ToastContainer, Tooltip} from "react-bootstrap";
import {useMutation, useQuery} from "@apollo/client";
import {
    ADD_USER,
    DELETE_USER,
    EDIT_USER,
    GET_SETTINGS,
    GET_USER,
    GET_USERS,
    UPDATE_SETTINGS,
    EDIT_USER_PERMISSION, MANUAL_CONTROL, EMERGENCY_STOP
} from "../helpers/gqlQueries";
import Banner from "../components/Banner";
import React, {useEffect, useState} from "react";
import {FiCheck, FiUserMinus} from "react-icons/fi";
import {Formik, Field, Form, ErrorMessage} from 'formik';
import * as Yup from "yup";
import {FaLeaf, MdBlock} from "react-icons/all";

const Settings = () => {
    const [pump, setPump] = useState(false);
    const [pumpFertilizer, setPumpFertilizer] = useState(false);
    const [light, setLight] = useState(false);
    const [fan, setFan] = useState(false);
    const [mode, setMode] = useState('off');
    const [interval, setInterval] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const toggleShowToast = () => setShowToast(!showToast);

    const [showToastInvite, setShowToastInvite] = useState(false);
    const toggleShowToastInvite = () => setShowToastInvite(!showToastInvite);

    const {data, loading, error} = useQuery(GET_SETTINGS);
    const [updateSettings, {loading: loadingUpdateSettings, error: ErrorUpdateSettings}] = useMutation(UPDATE_SETTINGS);
    const [emergencyStop, {loading: loadingEmergencyStop, error: ErrorEmergencyStop}] = useMutation(EMERGENCY_STOP);

    const {data: usersList, refetch: usersRefeach} = useQuery(GET_USERS)
    const {data: userData} = useQuery(GET_USER)
    const [addUser, {loading: loadingAddUser, error: errorAddUser}] = useMutation(ADD_USER)
    const [editUser, {loading: loadingEditUser, error: errorEditUser}] = useMutation(EDIT_USER)
    const [editUserPermission, {
        loading: loadingEditUserPermission,
        error: errorEditUserPermission
    }] = useMutation(EDIT_USER_PERMISSION)
    const [deleteUser, {loading: LoadingDeleteUser, error: errorDeleteUser}] = useMutation(DELETE_USER)
    const [manualControl, {loading: LoadingManualControl, error: errorManualControl}] = useMutation(MANUAL_CONTROL)

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

    const validate = Yup.object().shape({
        pump: Yup.number()
            .min(0, "Minimalna wartość to 0")
            .typeError('Wartość musi być liczbą'),
        pump_fertilizer: Yup.number()
            .min(0, "Minimalna wartość to 0")
            .typeError('Wartość musi być liczbą'),
        fan: Yup.number()
            .min(0, "Minimalna wartość to 0")
            .typeError('Wartość musi być liczbą')
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
                                    <option value="off">Tylko odczyt</option>
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
                                        disabled={userData && userData.me.role !== 'ADMIN'}
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
                                            }).then(() => {
                                                setShowToast(true)
                                                setTimeout(() => {
                                                    setShowToast(false)
                                                }, 3000)
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
                        <div className={'mt-3'}>
                            <h4>Manualne sterowanie</h4>
                            <Formik
                                initialValues={{
                                    pump: 0,
                                    pumpFertilizer: 0,
                                    fan: 0
                                }}
                                validationSchema={validate}
                                onSubmit={(values,{resetForm}) => {
                                    manualControl({
                                        variables: {
                                            pump: values.pump,
                                            pump_fertilizer: values.pumpFertilizer,
                                            fan: values.fan
                                        }
                                    }).then(()=>{
                                        resetForm({})
                                    })
                                }}>
                                <Form>
                                    <div>
                                        <label>Uruchom pompe (ml)</label>
                                        <Field id={"pump"} name={"pump"} type="number"
                                               className="form-control" placeholder="Pompa wody"
                                        />
                                        <ErrorMessage name="air_temperature"
                                                      render={msg => <div className={'form-error'}>{msg}</div>}/>
                                    </div>
                                    <div>
                                        <label>Uruchom pompe nawozu (ml)</label>
                                        <Field id={"pumpFertilizer"} name={"pumpFertilizer"} type="number"
                                               className="form-control" placeholder="Pompa nawozu"
                                        />
                                        <ErrorMessage name="air_temperature"
                                                      render={msg => <div className={'form-error'}>{msg}</div>}/>
                                    </div>
                                    <div>
                                        <label>Uruchom wentylację (sec)</label>
                                        <Field id={"fan"} name={"fan"} type="number"
                                               className="form-control" placeholder="Wentylacja"
                                        />
                                        <ErrorMessage name="air_temperature"
                                                      render={msg => <div className={'form-error'}>{msg}</div>}/>
                                    </div>
                                    <button type="submit" className="btn btn-primary mt-3">
                                        Wykonaj
                                    </button>
                                    <button type={'button'}  className="btn btn-danger mt-3" onClick={() => {
                                        emergencyStop({
                                            variables: {
                                                stop: true
                                            }
                                        })
                                    }}>
                                        STOP!
                                    </button>
                                </Form>
                            </Formik>
                        </div>
                    </div>
                    <div className={'col-lg-6'}>
                        <h4>Zaproś nowego użytkownika</h4>
                        {
                            userData && userData.me.role !== 'ADMIN' &&
                            <span>Towoje rola nie pozwala na wyświetlenie tych informacji</span>
                        }
                        {
                            userData && userData.me.role === 'ADMIN' &&
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
                                        setShowToastInvite(true)
                                        setTimeout(() => {
                                            setShowToastInvite(false)
                                        }, 3000)
                                    })
                                }}
                            >
                                <Form>
                                    <label className="form-label">Adres Email</label>
                                    <Field id={"email"} name={"email"} type="text"
                                           className="form-control mb-1" placeholder="Email"
                                    />
                                    <ErrorMessage name="email"
                                                  render={msg => <div className={'form-error'}>{msg}</div>}/>
                                    <button type="submit" className="btn btn-primary mt-3" disabled={loadingAddUser}>
                                        {!loadingAddUser ? 'Zaproś' :
                                            <div className="spinner-border spinner-border-sm" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </div>}
                                    </button>
                                </Form>
                            </Formik>
                        }
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
                                                                              }).then(() => {
                                                                                  setShowToast(true)
                                                                                  setTimeout(() => {
                                                                                      setShowToast(false)
                                                                                  }, 3000)
                                                                              })
                                                                          }}>
                                                        <option value="ADMIN">Admin</option>
                                                        <option value="VISITOR">Konsultant</option>
                                                    </BootstrapForm.Select>
                                                    {!user.confirmed_by_admin ?
                                                        <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Aktywuj
                                                            użytkownika</Tooltip>}>
                                                            <button type="button" className="btn btn-success btn-list"
                                                                    onClick={() => {
                                                                        editUserPermission({
                                                                            variables: {
                                                                                id: user.id,
                                                                                confirmed_by_admin: true
                                                                            }
                                                                        }).then(() => {
                                                                            usersRefeach()
                                                                            setShowToast(true)
                                                                            setTimeout(() => {
                                                                                setShowToast(false)
                                                                            }, 3000)
                                                                        })
                                                                    }}>
                                                                <FiCheck/>
                                                            </button>
                                                        </OverlayTrigger>
                                                        :
                                                        <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Dezaktywuj
                                                            użytkownika</Tooltip>}>
                                                            <button type="button" className="btn btn-danger btn-list"
                                                                    onClick={() => {
                                                                        editUserPermission({
                                                                            variables: {
                                                                                id: user.id,
                                                                                confirmed_by_admin: false
                                                                            }
                                                                        }).then(() => {
                                                                            usersRefeach()
                                                                            setShowToast(true)
                                                                            setTimeout(() => {
                                                                                setShowToast(false)
                                                                            }, 3000)
                                                                        })
                                                                    }}>
                                                                <MdBlock/>
                                                            </button>
                                                        </OverlayTrigger>
                                                    }
                                                    <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Usuń
                                                        użytkownika</Tooltip>}>
                                                        <button type="button" className="btn btn-danger btn-list"
                                                                onClick={() => {
                                                                    deleteUser({
                                                                        variables: {
                                                                            id: user.id
                                                                        }
                                                                    }).then(() => {
                                                                        usersRefeach()
                                                                        setShowToast(true)
                                                                        setTimeout(() => {
                                                                            setShowToast(false)
                                                                        }, 3000)
                                                                    })
                                                                }}>
                                                            <FiUserMinus/>
                                                        </button>
                                                    </OverlayTrigger>
                                                </div>
                                            }
                                        </li>
                                    )
                                })
                            }
                            {
                                userData && userData.me.role !== 'ADMIN' &&
                                <span>Towoje rola nie pozwala na wyświetlenie tych informacji</span>
                            }
                        </ul>
                    </div>
                </div>
            </div>
            <ToastContainer className="p-3" position={'bottom-end'}>
                <Toast show={showToast} onClose={toggleShowToast}>
                    <Toast.Header>
                        <FaLeaf style={{color: '#064635', fontSize: '16px', marginRight: '5px'}}/>
                        <strong className="me-auto">Smart Garden</strong>
                        <small>3sec temu </small>
                    </Toast.Header>
                    <Toast.Body>Dane zostały zapisane!</Toast.Body>
                </Toast>
                <Toast show={showToastInvite} onClose={toggleShowToastInvite}>
                    <Toast.Header>
                        <FaLeaf style={{color: '#064635', fontSize: '16px', marginRight: '5px'}}/>
                        <strong className="me-auto">Smart Garden</strong>
                        <small>3sec temu </small>
                    </Toast.Header>
                    <Toast.Body>Użytkownik został zaproszony!</Toast.Body>
                </Toast>
            </ToastContainer>
        </div>
    )
}

export default Settings;
