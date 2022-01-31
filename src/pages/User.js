import Banner from "../components/Banner";
import React, {useEffect, useState} from "react";
import {useMutation, useQuery} from "@apollo/client";
import {ADD_USER, DELETE_USER, EDIT_USER, GET_USER, GET_USERS} from "../helpers/gqlQueries";
import {FiUserMinus, FiUserPlus} from 'react-icons/fi'

const User = () => {
    const [addName, setAddName] = useState('')
    const [addEmail, setAddEmail] = useState('')

    const [editName, setEditName] = useState('')
    const [editEmail, setEditEmail] = useState('')
    const [editPassword, setEditPassword] = useState('')

    const {data: usersList, refetch: usersRefeach} = useQuery(GET_USERS)
    const {data} = useQuery(GET_USER)
    const [addUser, {loading: loadingAddUser, error: errorAddUser}] = useMutation(ADD_USER)
    const [editUser, {loading: loadingEditUser, error: errorEditUser}] = useMutation(EDIT_USER)
    const [deleteUser, {loading: LoadingDeleteUser, error: errorDeleteUser}] = useMutation(DELETE_USER)


    return (
        <div id={'user-panel'}>
            <Banner title={'Panel użytkownika'}/>
            <div className={'container mt-3'}>
                <div className={'row'}>
                    <div className={'col-lg-7'}>
                        <h4>Edytuj swoje dane</h4>
                        <form>
                            <label className="form-label">Nazwa</label>
                            <input type="text" className="form-control" placeholder="Jan"
                                   onChange={(e) => setEditName(e.target.value)} required={true}/>
                            <label className="form-label mt-3">Adres Email</label>
                            <input type="email" className="form-control" placeholder="mail@website.com"
                                   onChange={(e) => setEditEmail(e.target.value)} required={true}/>
                            <label className="form-label mt-3">Nowe hasło</label>
                            <input type="password" className="form-control" placeholder="mail@website.com"
                                   onChange={(e) => setEditPassword(e.target.value)} required={true}/>
                            <button type="button" className="btn btn-primary mt-3"
                                    onClick={() => {
                                        if (editName !== '' && editEmail !== '' && editPassword !== '') {
                                            editUser({
                                                variables: {
                                                    name: editName,
                                                    email: editEmail,
                                                    password: editPassword,
                                                }
                                            }).then(()=>{
                                                usersRefeach()
                                            })
                                        }
                                    }}>
                                {!loadingEditUser ? 'Zapisz' :
                                    <div className="spinner-border spinner-border-sm" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                }
                            </button>
                        </form>
                    </div>
                    <div className={'col-lg-5'}>
                        <h4>Zaproś nowego użytkownika</h4>
                        <form className={'mt-3'}>
                            <label className="form-label">Nazwa</label>
                            <input type="text" className="form-control" placeholder="Jan"
                                   onChange={(e) => setAddName(e.target.value)} required={true}/>
                            <label className="form-label mt-3">Adres Email</label>
                            <input type="email" className="form-control" placeholder="mail@website.com"
                                   onChange={(e) => setAddEmail(e.target.value)} required={true}/>
                            <button type="button" className="btn btn-primary mt-3"
                                    onClick={() => {
                                        if (addName !== '' && addEmail !== '') {
                                            addUser({
                                                variables: {
                                                    name: addName,
                                                    email: addEmail
                                                }
                                            }).then(()=> {
                                                usersRefeach()
                                            })
                                        }
                                    }}>
                                {!loadingAddUser ? 'Dodaj' :
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
                                        <li className={user.confirmed ? "list-group-item list-item" : "list-group-item list-item list-group-item-dark"} style={{height: '65px'}}>
                                            <div>
                                                <span style={{marginRight: '0.5rem'}}>{user.name}</span>
                                                <small className={"text-muted"}>{user.email}</small>
                                            </div>
                                            {
                                                data && data.me.id !== user.id &&
                                                    <button type="button" className="btn btn-danger btn-remove" onClick={()=>{
                                                        deleteUser({
                                                            variables: {
                                                                id: user.id
                                                            }
                                                        }).then(()=>{
                                                            usersRefeach()
                                                        })
                                                    }}><FiUserMinus/></button>
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

export default User;
