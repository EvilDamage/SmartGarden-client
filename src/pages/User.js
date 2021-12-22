import Banner from "../components/Banner";
import React, {useEffect, useState} from "react";
import {useMutation, useQuery} from "@apollo/client";
import {ADD_USER, DELETE_USER, EDIT_USER, GET_USERS} from "../helpers/gqlQueries";

const User = () => {
    const [addName, setAddName] = useState('')
    const [addEmail, setAddEmail] = useState('')

    const {data: userList} = useQuery(GET_USERS)
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
                    </div>
                    <div className={'col-lg-5'}>
                        <h4>Zaproś nowego użytkownika</h4>
                        <form className={'mt-3'}>
                            <input type="text" className="form-control" placeholder="Jan"
                                   onChange={(e) => setAddName(e.target.value)} required={true}/>
                            <input type="email" className="form-control mt-3" placeholder="mail@website.com"
                                   onChange={(e) => setAddEmail(e.target.value)} required={true}/>
                            <button type="button" className="btn btn-primary"
                                    onClick={() => {
                                        if (addName !== '' && addEmail !== '') {
                                            addUser({
                                                variables: {
                                                    name: addName,
                                                    email: addEmail
                                                }
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
                        {
                            userList && userList.users.map((user) => {
                                return <div>{user.name} {user.email}</div>
                            })
                        }
                    </div>
                </div>
            </div>
        </div>

    )
}

export default User;
