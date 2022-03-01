import {Button, Form, Spinner} from "react-bootstrap";
import {useMutation, useQuery} from "@apollo/client";
import {
    ADD_USER,
    DELETE_USER,
    EDIT_USER,
    GET_SETTINGS,
    GET_USER,
    GET_USERS,
    UPDATE_SETTINGS
} from "../helpers/gqlQueries";
import Banner from "../components/Banner";
import React, {useEffect, useState} from "react";
import {FiCheck, FiUserMinus} from "react-icons/fi";

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
                            <Form>
                                <label className="form-label">Tryb pracy</label>
                                <Form.Select value={mode} onChange={(e) => setMode(e.target.value)}>
                                    <option value="manual">Manual</option>
                                    <option value="plan">Plan</option>
                                    <option value="off">Off</option>
                                </Form.Select>
                                <label className="form-label mt-3">Interwał odczytów (min)</label>
                                <Form.Select value={interval}
                                             onChange={(e) => setInterval(e.target.value)}>
                                    <option value="1">1</option>
                                    <option value="5">5</option>
                                    <option value="10">10</option>
                                    <option value="30">30</option>
                                    <option value="60">60</option>
                                    <option value="120">120</option>
                                </Form.Select>
                                <div className={'mt-3'}>
                                    <Form.Check
                                        type="switch"
                                        checked={pump}
                                        onClick={() => setPump(!pump)}
                                        label="Dozowanie wody"
                                    />
                                    <Form.Check
                                        type="switch"
                                        checked={pumpFertilizer}
                                        onClick={() => setPumpFertilizer(!pumpFertilizer)}
                                        label="Dozowanie nawozu"
                                    />
                                    <Form.Check
                                        type="switch"
                                        checked={light}
                                        onClick={() => setLight(!light)}
                                        label="Oświetlenie"
                                    />
                                    <Form.Check
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
                            </Form>
                        </>
                        }
                    </div>
                    <div className={'col-lg-6'}>
                        <h4>Zaproś nowego użytkownika</h4>
                        <form>
                            <label className="form-label">Adres Email</label>
                            <input type="email" className="form-control" placeholder="mail@website.com"
                                   onChange={(e) => setAddEmail(e.target.value)} required={true}/>
                            <button type="button" className="btn btn-primary mt-3"
                                    onClick={() => {
                                        if (addEmail !== '') {
                                            addUser({
                                                variables: {
                                                    email: addEmail
                                                }
                                            }).then(() => {
                                                usersRefeach()
                                            })
                                        }
                                    }}>
                                {!loadingAddUser ? 'Zaproś' :
                                    <div className="spinner-border spinner-border-sm" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                }
                            </button>
                        </form>
                        <h4 className={'mt-3'}>Lista użytkowników</h4>
                        <ul className="list-group">
                            {
                                usersList && usersList.users.map((user) => {
                                    return (
                                        <li className={user.confirmed ? "list-group-item list-item" : "list-group-item list-item list-group-item-dark"}
                                            style={{height: '50px'}}>
                                            <div>
                                                <span style={{marginRight: '0.5rem'}}>{user.name}</span>
                                                <small className={"text-muted"}>{user.email}</small>
                                            </div>
                                            {
                                                userData && userData.me.id !== user.id &&
                                                <div className={'user-manage'}>
                                                    <Form.Select className={'w-25'} value={user.role}
                                                                 onChange={(e) => setInterval(e.target.value)}>
                                                        <option value="ADMIN">Admin</option>
                                                        <option value="VISITOR">Gość</option>
                                                    </Form.Select>
                                                    {!user.confirmed_by_admin &&
                                                        <button type="button" className="btn btn-success btn-list"
                                                                onClick={() => {

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
