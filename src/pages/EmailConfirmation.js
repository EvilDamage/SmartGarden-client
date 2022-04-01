import React, {useEffect} from "react";
import {useHistory} from "react-router-dom";
import {useMutation} from "@apollo/client";
import {CONFIRM_EMAIL} from "../helpers/gqlQueries";


const EmailConfirmation = () => {
    const history = useHistory();
    const url = window.location;
    const token = new URLSearchParams(url.search).get('email_token')

    const [setEmailConfirmation, {data, loading, error}] = useMutation(CONFIRM_EMAIL)

    useEffect(()=>{
        setEmailConfirmation({
            variables:{
                token: token
            }
        })
    }, [])

    return (
        <div className="container-fluid" id={"login"}>
            <div className="row">
                <div className="col-md-7 login-side">
                    <div className={'login-container w-50'}>
                        <h1>Potwierdzenie adresu email</h1>
                        {
                            error?
                                <p className="lead mb-4">
                                    Twoje konto nie zostało aktywowane
                                </p>
                                :
                                <p className="lead mb-4">
                                    Twoje konto zostało aktywowane
                                </p>
                        }
                        <button type="submit" className="btn btn-primary mt-3" onClick={()=> history.push('/')}>
                            Zaloguj
                        </button>
                    </div>
                </div>
                <div className="col-md-5 carousel-side"></div>
            </div>
        </div>
    )
}

export default EmailConfirmation;
